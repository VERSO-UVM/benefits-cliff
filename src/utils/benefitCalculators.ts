import type {
  ProcessedHouseholdData,
  CalculationResult,
  BenefitResult,
  SupplementalInfo,
  RawHouseholdData,
  TaxFilingStatus,
} from "../types";
import { getThreeSquaresValues } from "../data/Three_Squares_VT_Rules";
import { getMedicaidLimit } from "../data/Medicaid_Rules";
import type { MedicaidLimitType } from "../data/Medicaid_Rules";
import { getWeeklyCopay } from "../data/ccfap";
import { CalculateEarnedTaxCredits } from "../data/Taxes";
import { calculateReachUp } from "../data/ReachUP_Rules";

function calculateThreeSquares(data: ProcessedHouseholdData): BenefitResult {
  const { householdSize, grossMonthlyIncome, netMonthlyIncome } = data;

  const grossLimit = getThreeSquaresValues(householdSize, "grossMonthlyLimit");
  const netLimit = getThreeSquaresValues(householdSize, "netMonthlyLimit");
  const maxBenefit = getThreeSquaresValues(householdSize, "maximumBenefit");

  const eligible =
    grossMonthlyIncome <= grossLimit || netMonthlyIncome <= netLimit;
  const benefit = eligible
    ? Math.max(0, Math.round(maxBenefit - netMonthlyIncome * 0.3))
    : 0;

  return {
    name: "ThreeSquaresVT",
    amount: benefit,
    eligible: benefit > 0 ? true : false,
  };
}
function calculateMedicaid(
  data: ProcessedHouseholdData,
  supplemental: SupplementalInfo,
): BenefitResult[] {
  const results: BenefitResult[] = [];

  const checks = [
    {
      condition: data.children > 0,
      type: "ChildrenUnder19" as MedicaidLimitType,
      name: "DrDynasaur (Medicaid for Children)",
    },
    {
      condition: supplemental.hasPregnantMember,
      type: "PregnantWomen" as MedicaidLimitType,
      name: "Medicaid for Pregnant Women",
    },
    {
      condition: true,
      type: "MedicaidForAdults" as MedicaidLimitType,
      name: "Medicaid for Adults",
    },
  ];

  checks.forEach(({ condition, type, name }) => {
    if (condition) {
      const limit = getMedicaidLimit(data.householdSize, type);
      results.push({
        name,
        eligible: data.grossMonthlyIncome <= limit,
      });
    }
  });

  return results;
}

function calculateCCFAP(data: ProcessedHouseholdData): BenefitResult {
  // No children = not eligible
  if (data.children === 0) {
    return {
      name: "Child Care Financial Assistance",
      eligible: false,
      amount: 0,
    };
  }

  // No childcare costs = not eligible
  if (data.monthlyChildcareCost === 0) {
    return {
      name: "Child Care Financial Assistance",
      eligible: false,
      amount: 0,
    };
  }

  const weeklyCopay = getWeeklyCopay(
    data.householdSize,
    data.grossMonthlyIncome,
  );

  // Income too high (weeklyCopay returns null/undefined)
  if (weeklyCopay === null || weeklyCopay === undefined) {
    return {
      name: "Child Care Financial Assistance",
      eligible: false,
      amount: 0,
    };
  }

  // generally speaking this is wrong, because it should be *per child*
  const weeklyChildcareCost = data.monthlyChildcareCost / 4.33;
  console.log(weeklyChildcareCost);
  const weeklyBenefit = Math.max(0, weeklyChildcareCost - weeklyCopay);
  const monthlyBenefit = Math.round(weeklyBenefit * 4.33);

  return {
    name: "Monthly Child Care Financial Assistance",
    eligible: true,
    amount: monthlyBenefit,
  };
}

function buildReachUP(
  data: ProcessedHouseholdData,
  supplemental: SupplementalInfo,
): BenefitResult {
  // NOTE: defaults to Chittenden if not provided.
  const familySize = data.adults + data.children.length;
  const earnedIncome = data.earnedMonthlyIncome;
  const rent = data.monthlyShelterCost;
  const inChittenden = supplemental.inChittenden
    ? supplemental.inChittenden
    : true;
  const reachUpGrant = calculateReachUp(
    familySize,
    inChittenden,
    rent,
    earnedIncome,
    supplemental.inSubsidizedHousing,
  );

  return {
    name: "Reach Up Grant",
    eligible: reachUpGrant > 0,
    amount: reachUpGrant,
  };
}

function ProcessFIlingStatus(filingStatus: TaxFilingStatus): number {
  const status =
    filingStatus === "single"
      ? 1
      : filingStatus === "marriedFilingJointly"
        ? 2
        : 3;
  return status;
}

export default function calculateBenefits(
  processedData: ProcessedHouseholdData,
  supplemental: SupplementalInfo,
): CalculationResult {
  return {
    income: processedData.grossMonthlyIncome,
    benefits: [
      calculateThreeSquares(processedData),
      calculateCCFAP(processedData),
      buildReachUP(processedData, supplemental),
      ...calculateMedicaid(processedData, supplemental),
    ],
  };
}
