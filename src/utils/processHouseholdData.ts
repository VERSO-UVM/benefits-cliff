import type { RawHouseholdData, ProcessedHouseholdData } from "../types";
import { getStandardDeduction } from "../data/deductions";

export default function processHouseholdData(
  data: RawHouseholdData,
): ProcessedHouseholdData {
  const grossMonthlyIncome = data.annualIncome;
  const adults = data.adults;
  const children = data.children;
  const householdSize = adults + children;
  const monthlyShelterCost = data.monthlyShelterCost;

  // calculations: https://www.ahsnet.ahs.state.vt.us/Public/3sVT/assets/BRM/2400_Benefits.htm#Net_Income
  const earnedDeduction = grossMonthlyIncome * 0.2;
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

  const shelterTemp = 0.5 * tempIncome;
  const shelterDeduction = Math.max(monthlyShelterCost - shelterTemp, 600);
  const netMonthlyIncome = tempIncome - shelterDeduction;
  return {
    grossMonthlyIncome: grossMonthlyIncome,
    netMonthlyIncome: netMonthlyIncome,
    adults: adults,
    children: children,
    householdSize: householdSize,
  };
}
