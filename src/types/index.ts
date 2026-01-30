export interface HouseholdData {
  annualIncome: number;
  adults: number;
  children: number;
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
