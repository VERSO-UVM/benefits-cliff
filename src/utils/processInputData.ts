import type {
  RawHouseholdData,
  BenefitProcessedHouseholdData,
  SupplementalInfo,
  TaxProcessedData,
} from "../types";
import { netIncomeDeduction } from "../data/Net_Income";

function processIncomeForBenefits(data: RawHouseholdData): {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
} {
  const grossMonthlyIncome =
    data.earnedMonthlyIncome + data.unearnedMonthlyIncome;
  const monthlyShelterCost = data.monthlyShelterCost;
  const householdSize = data.adults + data.dependentChildren.length;

  // calculations: https://www.ahsnet.ahs.state.vt.us/Public/3sVT/assets/BRM/2400_Benefits.htm#Net_Income
  const earnedDeduction = data.earnedMonthlyIncome * 0.2;
  const standardDeduction = netIncomeDeduction(householdSize);
  const medicalDeduction = 0; // TODO, LOGIC
  const dependentCareDeduction = 0; // TODO Logic
  const childSupportDeduction = 0; // TODO logic
  const tempIncome =
    grossMonthlyIncome -
    standardDeduction -
    earnedDeduction -
    medicalDeduction -
    dependentCareDeduction -
    childSupportDeduction;

  const halfIncome = 0.5 * tempIncome;
  const shelterExcess = Math.max(0, monthlyShelterCost - halfIncome); // avoid negative temporary shelter values
  const maxShelterDeduction = 600;
  const shelterDeduction = Math.min(shelterExcess, maxShelterDeduction);
  const netMonthlyIncome = Math.max(tempIncome - shelterDeduction, 0);
  return {
    grossMonthlyIncome: grossMonthlyIncome,
    netMonthlyIncome: netMonthlyIncome,
  };
}

export function processBenefitHouseholdData(
  data: RawHouseholdData,
  _supplemental: SupplementalInfo,
): BenefitProcessedHouseholdData {
  const householdSize = data.dependentChildren.length + data.adults;
  const processedIncome = processIncomeForBenefits(data);

  return {
    grossMonthlyIncome: processedIncome.grossMonthlyIncome,
    netMonthlyIncome: processedIncome.netMonthlyIncome,
    earnedMonthlyIncome: data.earnedMonthlyIncome,
    adults: data.adults,
    children: data.dependentChildren,
    householdSize: householdSize,
    monthlyChildcareCost: data.monthlyChildcareCost,
    monthlyShelterCost: data.monthlyShelterCost,
  };
}

const FILING_STATUS_CODE = {
  single: 1,
  marriedFilingJointly: 2,
  headOfHousehold: 3,
} as const;

export function processTaxData(data: RawHouseholdData): TaxProcessedData {
  return {
    filingStatus: FILING_STATUS_CODE[data.taxFilingStatus],
    grossAnnualIncome: (data.earnedMonthlyIncome + data.unearnedMonthlyIncome) * 12,
    earnedAnnualIncome: data.earnedMonthlyIncome * 12,
    children: data.dependentChildren,
  };
}
