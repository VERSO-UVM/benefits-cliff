import type { ReactNode } from "react";

export const DESCRIPTIONS: Record<string, ReactNode> = {
  earnedMonthlyIncome: (
    <>
      Wages, salary, or self-employment income before taxes.{" "}
      <a
        href="https://itap1.for.irs.gov/owda/0/resource/Commentary_Files_Redirect_ITA/en-US/help/unearn.html"
        target="_blank"
        rel="noreferrer"
      >
        What counts as earned income?
      </a>
    </>
  ),
  unearnedMonthlyIncome: (
    <>
      Social Security, child support, alimony, investment income, and other
      income not directly earned from a job.{" "}
      <a
        href="https://itap1.for.irs.gov/owda/0/resource/Commentary_Files_Redirect_IRS/en-US/help/unearn.html"
        target="_blank"
        rel="noreferrer"
      >
        What counts as unearned income?
      </a>
    </>
  ),
  monthlyShelterCost:
    "Rent or mortgage, including utilities if they are included in the payment.",
  monthlyChildcareCost:
    "Total amount paid to childcare providers (not private schools) per month, summed across all children.",
  adultsInHousehold:
    "Number of adults living in the household. Used to determine household size and tax filing status.",
  taxFilingStatus: (
    <>
      How you file taxes: single, head of household (single with children), or
      married.{" "}
      <a
        href="https://tax.vermont.gov/individuals/personal-income-tax/filing-status"
        target="_blank"
        rel="noreferrer"
      >
        Learn more
      </a>
    </>
  ),
  childcareType: (
    <>
      <a
        href="https://www.childcareresource.org/for-families/types-of-childcare/"
        target="_blank"
        rel="noreferrer"
      >
        See types of childcare
      </a>
    </>
  ),
  hasPregnantMember: "Affects Medicaid eligibility thresholds.",
  inChittenden: "Affects Reach Up shelter allowance calculation.",
  inSubsidizedHousing:
    "Affects how shelter costs are counted in Reach Up benefit calculation.",
};
