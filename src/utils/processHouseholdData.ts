import type { RawHouseholdData, ProcessedHouseholdData } from "../types";
import { getStandardDeduction } from "../data/deductions";

export default function processHouseholdData(
  data: RawHouseholdData,
): ProcessedHouseholdData {
  const grossMonthlyIncome = data.annualIncome / 12;
  const adults = data.adults;
  const children = data.children;
  const householdSize = adults + children;
  const standardDeduction = getStandardDeduction(householdSize);
  const earnedDeduction = grossMonthlyIncome * 0.2;
  const netMonthlyIncome =
    grossMonthlyIncome - standardDeduction - earnedDeduction;
  return {
    grossMonthlyIncome: grossMonthlyIncome,
    netMonthlyIncome: netMonthlyIncome,
    adults: adults,
    children: children,
    householdSize: householdSize,
  };
}
