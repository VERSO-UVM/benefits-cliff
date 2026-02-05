import type {
  RawHouseholdData,
  ProcessedHouseholdData,
  SupplementalInfo,
} from "../types";
import { getStandardDeduction } from "../data/deductions";
import { getWeeklyChildcarePaymentMax } from "../data/ccfap";
import type { ChildcareInformation } from "../data/ccfap";

function processIncome(data: RawHouseholdData): {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
} {
  const grossMonthlyIncome =
    data.earnedMonthlyIncome + data.unearnedMonthlyIncome;
  const monthlyShelterCost = data.monthlyShelterCost;
  const householdSize = data.adults + data.children;

  // calculations: https://www.ahsnet.ahs.state.vt.us/Public/3sVT/assets/BRM/2400_Benefits.htm#Net_Income
  const earnedDeduction = data.earnedMonthlyIncome * 0.2;
  const standardDeduction = getStandardDeduction(householdSize);
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

function processChildcareCost(
  data: RawHouseholdData,
  supplemental: SupplementalInfo,
): number {
  if (data.children === 0) return 0;
  // default to most likely scenario if no data
  const childcareInfo: ChildcareInformation = {
    childAgeRange: supplemental.childAgeRange ?? "preschool",
    childcareDuration: supplemental.childcareDuration ?? "fullTime",
    childcareType: supplemental.childcareType ?? "licensedCenter",
  };

  return Math.min(
    data.monthlyChildcareCost,
    getWeeklyChildcarePaymentMax(childcareInfo) * 4.33, // convert to monthly
  );
}

export default function processHouseholdData(
  data: RawHouseholdData,
  supplemental: SupplementalInfo,
): ProcessedHouseholdData {
  const processedIncome = processIncome(data);
  const childcareCost = processChildcareCost(data, supplemental);

  return {
    grossMonthlyIncome: processedIncome.grossMonthlyIncome,
    netMonthlyIncome: processedIncome.netMonthlyIncome,
    adults: data.adults,
    children: data.children,
    householdSize: data.adults + data.children,
    monthlyChildcareCost: childcareCost,
  };
}
