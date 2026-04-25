import type { ChildcareDuration, ChildcareType } from "../data/ccfap";

export interface DependentChild {
  age: number;
  childcareDuration: ChildcareDuration;
  childcareType: ChildcareType;
}

export type TaxFilingStatus =
  | "single"
  | "marriedFilingJointly"
  | "headOfHousehold";

// main input
export interface RawHouseholdData {
  earnedMonthlyIncome: number;
  unearnedMonthlyIncome: number;
  adults: number;
  dependentChildren: DependentChild[];
  taxFilingStatus: TaxFilingStatus;
  monthlyShelterCost: number;
  monthlyChildcareCost: number;
}

// secondary input
export interface SupplementalInfo {
  hasPregnantMember?: boolean;
  inChittenden?: boolean;
  inSubsidizedHousing?: boolean;
}

// data storage
export interface ProcessedHouseholdData {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  earnedMonthlyIncome: number;
  monthlyChildcareCost: number;
  adults: number;
  children: DependentChild[];
  householdSize: number;
  taxFilingStatus: TaxFilingStatus;
  monthlyShelterCost: number;
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
