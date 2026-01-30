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

export function getStandardDeduction(householdSize: number): number {
  const limits = deductions.standard;
  if (householdSize <= 5) {
    return limits[householdSize as keyof typeof limits] as number;
  }
  // For households > 10
  return limits["6+"];
}
