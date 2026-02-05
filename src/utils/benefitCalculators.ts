import type {
  ProcessedHouseholdData,
  CalculationResult,
  BenefitResult,
  SupplementalInfo,
} from "../types";
import { getThreeSquaresValues } from "../data/Three_Squares_VT_Rules";
import { getMedicaidLimit } from "../data/Medicaid_Rules";
import type { MedicaidLimitType } from "../data/Medicaid_Rules";
import { getWeeklyCopay } from "../data/ccfap";

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

export default function calculateBenefits(
  data: ProcessedHouseholdData,
  supplemental: SupplementalInfo,
): CalculationResult {
  return {
    income: data.grossMonthlyIncome,
    benefits: [
      calculateThreeSquares(data),
      calculateCCFAP(data),
      ...calculateMedicaid(data, supplemental),
    ],
  };
}
