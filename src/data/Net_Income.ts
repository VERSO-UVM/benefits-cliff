// source: https://www.ahsnet.ahs.state.vt.us/Public/3sVT/assets/BRM/2400_Benefits.htm#Net_Income

export const deductions = {
  standard: {
    1: 209,
    2: 209,
    3: 209,
    4: 223,
    5: 261,
    "6+": 299,
  },
};

export function netIncomeDeduction(householdSize: number): number {
  const limits = deductions.standard;
  if (householdSize <= 5) {
    return limits[householdSize as keyof typeof limits] as number;
  }
  // For households > 10
  return limits["6+"];
}
