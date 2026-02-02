import type { RawHouseholdData, ProcessedHouseholdData } from "../types";
import { getStandardDeduction } from "../data/deductions";

export default function processHouseholdData(
  data: RawHouseholdData,
): ProcessedHouseholdData {
  const grossMonthlyIncome =
    data.earnedMonthlyIncome + data.unearnedMonthlyIncome;
  const adults = data.adults;
  const children = data.children;
  const householdSize = adults + children;
  const monthlyShelterCost = data.monthlyShelterCost;

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
    adults: adults,
    children: children,
    householdSize: householdSize,
  };
}
