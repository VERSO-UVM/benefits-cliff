import type {
  ProcessedHouseholdData,
  CalculationResult,
  BenefitResult,
  RawHouseholdData,
} from "../types";
import {
  getThreeSquaresAllotment,
  getThreeSquaresGrossIncomeLimit,
  getThreeSquaresNetIncomeLimit,
} from "../data/Three_Squares_VT_Rules";

function calculateThreeSquares(data: ProcessedHouseholdData): BenefitResult {
  //
  const householdSize = data.householdSize;
  const grossLimit = getThreeSquaresGrossIncomeLimit(householdSize);
  const netLimit = getThreeSquaresNetIncomeLimit(householdSize);

  // calculate benefits
  const allotment = getThreeSquaresAllotment(householdSize);
  const allotment_adjustment = data.netMonthlyIncome * 0.3;
  const benefit = allotment - allotment_adjustment;

  if (
    data.grossMonthlyIncome <= grossLimit ||
    data.netMonthlyIncome <= netLimit
  ) {
    return {
      name: "ThreeSquaresVT",
      amount: benefit,
      eligible: true,
    };
  }
  return {
    name: "ThreeSquaresVT",
    amount: 0,
    eligible: false,
  };
}

export default function calculateBenefits(
  data: RawHouseholdData,
): CalculationResult {
  console.log("Calculate with", data);
  return {
    income: data.annualIncome,
    benefits: [{ name: "3SquaresVT", amount: 5000, eligible: true }],
  };
}
