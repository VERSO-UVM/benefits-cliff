export interface RawHouseholdData {
  monthlyIncome: number;
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

// export interface PersonalInformation {
//   age: number;
//   personalIncome: number;
// }

export interface BenefitResult {
  name: string;
  amount: number;
  eligible: boolean;
}

export interface CalculationResult {
  income: number;
  benefits: BenefitResult[];
}
