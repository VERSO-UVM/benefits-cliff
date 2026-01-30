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
    1: 292,
    2: 536,
    3: 768,
    4: 975,
    5: 1158,
    6: 1390,
    7: 1536,
    8: 1755,
    additionalMember: 220,
  },
};

export function getThreeSquaresGrossIncomeLimit(householdSize: number): number {
  const limits = Three_Squares_VT_Values_2025.grossMonthlyLimit;
  if (householdSize <= 10) {
    return limits[householdSize as keyof typeof limits] as number;
  }
  // For households > 10
  return limits[10] + (householdSize - 10) * limits.additionalMember;
}

export function getThreeSquaresNetIncomeLimit(householdSize: number): number {
  const limits = Three_Squares_VT_Values_2025.netMonthlyLimit;
  if (householdSize <= 10) {
    return limits[householdSize as keyof typeof limits] as number;
  }
  // For households > 10
  return limits[10] + (householdSize - 10) * limits.additionalMember;
}

export function getThreeSquaresAllotment(householdSize: number): number {
  const limits = Three_Squares_VT_Values_2025.grossMonthlyLimit;
  if (householdSize <= 10) {
    return limits[householdSize as keyof typeof limits] as number;
  }
  // For households > 10
  return limits[10] + (householdSize - 10) * limits.additionalMember;
}
