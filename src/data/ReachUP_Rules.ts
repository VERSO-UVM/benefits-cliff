import type {
  BenefitProcessedHouseholdData,
  BenefitResult,
  SupplementalInfo,
} from "../types";
import { BENEFIT_URLS } from "./benefitUrls";

const REACH_UP_BASIC_NEEDS = {
  1: 644,
  2: 942,
  3: 1236,
  4: 1478,
  5: 1733,
  6: 1907,
  7: 2203,
  8: 2458,
  perAdditional: 236,
};

const REACH_UP_SHELTER = {
  insideChittenden: 450,
  outsideChittenden: 400,
};

const REACH_UP_SPECIAL_HOUSING_MAX = 90;
const REACH_UP_RATABLE = 0.496;

function calculateBasicNeeds(familySize: number): number {
  const familyIndex = Math.min(familySize, 8);
  let basicNeeds =
    REACH_UP_BASIC_NEEDS[familyIndex as keyof typeof REACH_UP_BASIC_NEEDS];
  if (familySize > 8) {
    let scale = familySize - 8;
    let additional = REACH_UP_BASIC_NEEDS["perAdditional"];
    basicNeeds += scale * additional;
  }
  return basicNeeds;
}

function calculateShelter(
  inChittenden: boolean,
  rent: number,
  inSubsidizedHousing: boolean,
): number {
  const shelterIndex = inChittenden ? "insideChittenden" : "outsideChittenden";
  const maxShelter = REACH_UP_SHELTER[shelterIndex];
  if (inSubsidizedHousing) {
    return maxShelter;
  }
  if (!inSubsidizedHousing && rent < maxShelter) {
    return rent;
  }
  const specialAllowance = Math.min(
    REACH_UP_SPECIAL_HOUSING_MAX,
    Math.max(rent - maxShelter, 0),
  );
  return maxShelter + specialAllowance;
}

function calculateCountableIncome(earnedIncome: number): number {
  const earnedDisregard = 350;
  const countableIncome = Math.max(0, (earnedIncome - earnedDisregard) * 0.75);
  return countableIncome;
}

export function calculateReachUp(
  data: BenefitProcessedHouseholdData,
  supplemental: SupplementalInfo,
): BenefitResult {
  const eligible =
    data.children.filter((child) => child.age < 18).length > 0 ||
    supplemental.hasPregnantMember;
  if (!eligible)
    return {
      name: "Reach Up",
      eligible: false,
      url: BENEFIT_URLS.reachUp,
    };

  // calculate main variables
  const basicNeeds = calculateBasicNeeds(data.householdSize);
  const shelterWithAllowance = calculateShelter(
    supplemental.inChittenden,
    data.monthlyShelterCost,
    supplemental.inSubsidizedHousing,
  );
  const countableIncome = calculateCountableIncome(data.earnedMonthlyIncome);

  // perform main calculation
  const totalNeeds = basicNeeds + shelterWithAllowance;
  const maximumGrant = totalNeeds * REACH_UP_RATABLE;
  const reachUpGrant = Math.round(maximumGrant - countableIncome);
  return {
    name: "Reach Up",
    eligible: reachUpGrant > 0,
    amount: reachUpGrant,
    url: BENEFIT_URLS.reachUp,
  };
}
