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
  hasPregnantMember: boolean;
  inChittenden: boolean;
  inSubsidizedHousing: boolean;
}

// data storage
export interface BenefitProcessedHouseholdData {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  earnedMonthlyIncome: number;
  monthlyChildcareCost: number;
  adults: number;
  children: DependentChild[];
  householdSize: number;
  monthlyShelterCost: number;
}

// tax data storage — all income figures are annual
export interface TaxProcessedData {
  filingStatus: number; // 1=single, 2=marriedFilingJointly, 3=headOfHousehold
  grossAnnualIncome: number;
  earnedAnnualIncome: number;
  children: DependentChild[];
}

export interface TaxCreditResult {
  name: string;
  annualAmount: number;
  url?: string;
}

export interface BenefitResult {
  name: string;
  eligible: boolean;
  amount?: number;
  url?: string;
}

export interface CalculationResult {
  income: number;
  benefits: BenefitResult[];
  taxCredits: TaxCreditResult[];
}
