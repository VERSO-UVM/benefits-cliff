export interface RawHouseholdData {
  earnedMonthlyIncome: number;
  unearnedMonthlyIncome: number;
  adults: number;
  children: number;
  monthlyShelterCost: number;
}

interface Deduction {
  name: string;
  value: number;
}

export interface ProcessedHouseholdData {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  adults: number;
  children: number;
  householdSize: number;
  deductions?: Deduction[];
}

export interface BenefitResult {
  name: string;
  eligible: boolean;
  amount?: number;
}

export interface CalculationResult {
  income: number;
  benefits: BenefitResult[];
}
