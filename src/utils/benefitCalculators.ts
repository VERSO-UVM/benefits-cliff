import type { HouseholdData, CalculationResult } from "../types";

export default function calculateBenefits(
  data: HouseholdData,
): CalculationResult {
  console.log("Calculate with", data);
  return {
    income: data.annualIncome,
    benefits: [{ name: "3SquaresVT", amount: 5000, eligible: true }],
  };
}
