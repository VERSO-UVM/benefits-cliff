// note, this is sourced from the fpl csv files, themselves sourced from the page

import type { BenefitProcessedHouseholdData, BenefitResult } from "../types";
import { BENEFIT_URLS } from "./benefitUrls";

const Three_Squares_VT_Values_2025 = {
  grossMonthlyLimit: {
    1: 2413,
    2: 3261,
    3: 4109,
    4: 4957,
    5: 5805,
    6: 6653,
    7: 7501,
    8: 8349,
    9: 9197,
    10: 10044,
    additionalMember: 848,
  },
  netMonthlyLimit: {
    1: 1305,
    2: 1763,
    3: 2221,
    4: 2680,
    5: 3138,
    6: 3596,
    7: 4055,
    8: 4513,
    9: 4972,
    10: 5431,
    additionalMember: 459,
  },
  maximumBenefit: {
    1: 298,
    2: 546,
    3: 785,
    4: 994,
    5: 1183,
    6: 1421,
    7: 1571,
    8: 1789,
    9: 2007,
    10: 2225,
    additionalMember: 218,
  },
};

type SNAPLimitType = "grossMonthlyLimit" | "netMonthlyLimit" | "maximumBenefit";

function getThreeSquaresValues(
  householdSize: number,
  type: SNAPLimitType,
): number {
  const limits = Three_Squares_VT_Values_2025[type];

  if (householdSize <= 10) {
    return limits[householdSize as keyof typeof limits] as number;
  }

  return limits[10] + (householdSize - 10) * limits.additionalMember;
}

export function calculateThreeSquares(
  data: BenefitProcessedHouseholdData,
): BenefitResult {
  const { householdSize, grossMonthlyIncome, netMonthlyIncome } = data;

  const grossLimit = getThreeSquaresValues(householdSize, "grossMonthlyLimit");
  const netLimit = getThreeSquaresValues(householdSize, "netMonthlyLimit");
  const maxBenefit = getThreeSquaresValues(householdSize, "maximumBenefit");

  const eligible: boolean =
    grossMonthlyIncome <= grossLimit || netMonthlyIncome <= netLimit;
  const benefit = eligible
    ? Math.max(0, Math.round(maxBenefit - netMonthlyIncome * 0.3))
    : 0;

  return {
    name: "Three Squares",
    eligible: eligible,
    amount: benefit,
    url: BENEFIT_URLS.threeSquares,
  };
}
