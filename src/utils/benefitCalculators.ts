import { calculateCCFAP } from "../data/ccfap";
import { calculateMedicaid } from "../data/Medicaid_Rules";
import { calculateReachUp } from "../data/ReachUP_Rules";
import { calculateThreeSquares } from "../data/Three_Squares_VT_Rules";
import { calculateTaxCredits } from "./taxCalculators";
import type {
  BenefitProcessedHouseholdData,
  TaxProcessedData,
  CalculationResult,
  SupplementalInfo,
} from "../types";

export default function calculateBenefits(
  processedData: BenefitProcessedHouseholdData,
  supplemental: SupplementalInfo,
  taxData: TaxProcessedData,
): CalculationResult {
  return {
    income: processedData.grossMonthlyIncome,
    benefits: [
      calculateThreeSquares(processedData),
      calculateReachUp(processedData, supplemental),
      calculateCCFAP(processedData),
      ...calculateMedicaid(processedData, supplemental),
    ],
    taxCredits: calculateTaxCredits(taxData),
  };
}
