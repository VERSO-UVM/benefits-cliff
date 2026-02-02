import type {
  ProcessedHouseholdData,
  CalculationResult,
  BenefitResult,
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
  const maxAllotment = getThreeSquaresAllotment(householdSize);
  const allotment_adjustment = data.netMonthlyIncome * 0.3;
  const benefit = Math.max(0, Math.round(maxAllotment - allotment_adjustment));

  console.log(maxAllotment, allotment_adjustment, benefit);

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
  data: ProcessedHouseholdData,
): CalculationResult {
  return {
    income: data.grossMonthlyIncome,
    benefits: [calculateThreeSquares(data)],
  };
}
