import {
  SumBasicFederalTaxes,
  CalculateEarnedTaxCredits,
  CalculateChildTaxCredits,
} from "../data/Taxes";
import type { TaxProcessedData, TaxCreditResult } from "../types";
import { BENEFIT_URLS } from "../data/benefitUrls";

export function calculateTaxCredits(data: TaxProcessedData): TaxCreditResult[] {
  const { filingStatus, grossAnnualIncome, earnedAnnualIncome, children } =
    data;

  const federalTaxOwed = SumBasicFederalTaxes(filingStatus, grossAnnualIncome);
  const eitc = CalculateEarnedTaxCredits(
    filingStatus,
    earnedAnnualIncome,
    children,
  );
  const childCredits = CalculateChildTaxCredits(
    grossAnnualIncome,
    earnedAnnualIncome,
    children,
    filingStatus,
    federalTaxOwed,
  );

  return [
    {
      name: "Federal Earned Income Tax Credit",
      annualAmount: Math.round(eitc.federal),
      url: BENEFIT_URLS.federalEitc,
    },
    {
      name: "Vermont Earned Income Tax Credit",
      annualAmount: Math.round(eitc.vermont),
      url: BENEFIT_URLS.vermontEitc,
    },
    {
      name: "Additional Child Tax Credit",
      annualAmount: Math.round(childCredits.additionalCredit),
      url: BENEFIT_URLS.childTaxCredit,
    },
  ];
}
