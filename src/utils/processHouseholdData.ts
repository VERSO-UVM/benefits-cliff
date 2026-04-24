import type {
  RawHouseholdData,
  ProcessedHouseholdData,
  SupplementalInfo,
} from "../types";
import { netIncomeDeduction } from "../data/Net_Income";
import { getWeeklyChildcarePaymentMax } from "../data/ccfap";
import type { ChildAgeRange, ChildcareInformation } from "../data/ccfap";

function ageToRange(age: number): ChildAgeRange {
  if (age < 2) return "infant";
  if (age < 3) return "toddler";
  if (age < 6) return "preschool";
  return "schoolAge";
}

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

function processChildcareCost(data: RawHouseholdData): number {
  if (data.dependentChildren.length === 0 || data.monthlyChildcareCost === 0)
    return 0;

  const totalWeeklyMax = data.dependentChildren.reduce((sum, child) => {
    const childcareInfo: ChildcareInformation = {
      childAgeRange: ageToRange(child.age),
      childcareDuration: child.childcareDuration,
      childcareType: child.childcareType,
    };
    return sum + getWeeklyChildcarePaymentMax(childcareInfo);
  }, 0);

  return Math.min(data.monthlyChildcareCost, totalWeeklyMax * 4.33);
}

export default function processHouseholdData(
  data: RawHouseholdData,
  _supplemental: SupplementalInfo,
): ProcessedHouseholdData {
  const children = data.dependentChildren.length;
  const processedIncome = processIncomeForBenefits(data);
  const childcareCost = processChildcareCost(data);

  return {
    grossMonthlyIncome: processedIncome.grossMonthlyIncome,
    netMonthlyIncome: processedIncome.netMonthlyIncome,
    adults: data.adults,
    children,
    householdSize: data.adults + children,
    monthlyChildcareCost: childcareCost,
    taxFilingStatus: data.taxFilingStatus,
  };
}
