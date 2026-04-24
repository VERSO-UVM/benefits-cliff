// NOTE: everything is on an *annual* scale here.

const FEDERAL_BRACKETS = {
  // Single Payer
  1: [
    { threshold: 11075, rate: 0.1 },
    { threshold: 48475, rate: 0.12 },
    { threshold: 103350, rate: 0.22 },
    { threshold: 197300, rate: 0.24 },
    { threshold: 205525, rate: 0.32 },
    { threshold: 626350, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 },
  ],
  // Married jointly / widow
  2: [
    { threshold: 23850, rate: 0.1 },
    { threshold: 96950, rate: 0.12 },
    { threshold: 206700, rate: 0.22 },
    { threshold: 394600, rate: 0.24 },
    { threshold: 501050, rate: 0.32 },
    { threshold: 751600, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 },
  ],
  // Head of Household
  3: [
    { threshold: 17000, rate: 0.1 },
    { threshold: 64850, rate: 0.12 },
    { threshold: 103350, rate: 0.22 },
    { threshold: 197300, rate: 0.24 },
    { threshold: 250501, rate: 0.32 },
    { threshold: 626350, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 },
  ],
};

const FEDERAL_STD_DEDUCTIONS = {
  1: 15750,
  2: 31500,
  3: 23625,
};

const VT_STD_DEDUCTIONS = {
  1: 7650,
  2: 15300,
  3: 11450,
};

const VERMONT_BRACKETS = {
  // Single
  1: [
    { threshold: 49400, rate: 0.0335 },
    { threshold: 119700, rate: 0.066 },
    { threshold: 249700, rate: 0.076 },
    { threshold: Infinity, rate: 0.0875 },
  ],
  // Married Filing Jointly
  2: [
    { threshold: 82500, rate: 0.0335 },
    { threshold: 199450, rate: 0.066 },
    { threshold: 304000, rate: 0.076 },
    { threshold: Infinity, rate: 0.0875 },
  ],
  // Head of Household
  3: [
    { threshold: 66200, rate: 0.0335 },
    { threshold: 171000, rate: 0.066 },
    { threshold: 276850, rate: 0.076 },
    { threshold: Infinity, rate: 0.0875 },
  ],
};

const FICA = [
  { threshold: 184500, social: 0.062, medicare: 0.0145 },
  { threshold: Infinity, social: 0, medicare: 0.0145 },
];

const VT_PERSONAL_EXEMPTION = 5300;

const FEDERAL_EITC = {
  // single / head of household
  1: {
    0: {
      incomeForMaxCredit: 8490,
      maxCredit: 649,
      thresholdPhaseout: 10620,
      completedPhaseout: 19104,
    },
    1: {
      incomeForMaxCredit: 12730,
      maxCredit: 4328,
      thresholdPhaseout: 23350,
      completedPhaseout: 50434,
    },
    2: {
      incomeForMaxCredit: 17880,
      maxCredit: 7152,
      thresholdPhaseout: 23350,
      completedPhaseout: 57310,
    },
    3: {
      incomeForMaxCredit: 17880,
      maxCredit: 8046,
      thresholdPhaseout: 23350,
      completedPhaseout: 61555,
    },
  },
  // married filing jointly
  2: {
    0: {
      incomeForMaxCredit: 8490,
      maxCredit: 649,
      thresholdPhaseout: 17730,
      completedPhaseout: 26214,
    },
    1: {
      incomeForMaxCredit: 12730,
      maxCredit: 4328,
      thresholdPhaseout: 30470,
      completedPhaseout: 57554,
    },
    2: {
      incomeForMaxCredit: 17880,
      maxCredit: 7152,
      thresholdPhaseout: 30470,
      completedPhaseout: 64430,
    },
    3: {
      incomeForMaxCredit: 17880,
      maxCredit: 8046,
      thresholdPhaseout: 30470,
      completedPhaseout: 68675,
    },
  },
  // head of household: same as single
  3: {
    0: {
      incomeForMaxCredit: 8490,
      maxCredit: 649,
      thresholdPhaseout: 10620,
      completedPhaseout: 19104,
    },
    1: {
      incomeForMaxCredit: 12730,
      maxCredit: 4328,
      thresholdPhaseout: 23350,
      completedPhaseout: 50434,
    },
    2: {
      incomeForMaxCredit: 17880,
      maxCredit: 7152,
      thresholdPhaseout: 23350,
      completedPhaseout: 57310,
    },
    3: {
      incomeForMaxCredit: 17880,
      maxCredit: 8046,
      thresholdPhaseout: 23350,
      completedPhaseout: 61555,
    },
  },
};

function SumBasicFederalTaxes(
  filingStatus: number,
  grossIncome: number,
): number {
  let deductionIncome =
    grossIncome -
    FEDERAL_STD_DEDUCTIONS[filingStatus as keyof typeof FEDERAL_STD_DEDUCTIONS];
  deductionIncome = Math.max(0, deductionIncome);
  const schedule =
    FEDERAL_BRACKETS[filingStatus as keyof typeof FEDERAL_BRACKETS];
  let sum = 0;
  let previous_threshold = 0;
  for (let i = 0; i < schedule.length; i++) {
    let threshold = schedule[i].threshold;
    let rate = schedule[i].rate;
    let taxable = Math.min(deductionIncome, threshold) - previous_threshold;
    taxable = Math.max(taxable, 0);
    sum += taxable * rate;
    previous_threshold = threshold;
  }
  return sum;
}

function SumFICATaxes(selfEmployed: Boolean, earnedIncome: number): number {
  let sum = 0;
  let previous_threshold = 0;
  let selfEmployedScaler = 1;
  if (selfEmployed) selfEmployedScaler = 2;
  for (let i = 0; i < FICA.length; i++) {
    let threshold = FICA[i].threshold;
    let rate = (FICA[i].social + FICA[i].medicare) * selfEmployedScaler;
    let taxable = Math.min(earnedIncome, threshold) - previous_threshold;
    taxable = Math.max(taxable, 0);
    sum += taxable * rate;
    previous_threshold = threshold;
  }
  return sum;
}

function SumBasicVermontTaxes(
  filingStatus: number,
  grossIncome: number,
  numberChildren: number,
): number {
  let exemptions = numberChildren + 1;
  if (filingStatus === 2) {
    exemptions += 1;
  }
  let deductionIncome =
    grossIncome -
    VT_STD_DEDUCTIONS[filingStatus as keyof typeof VT_STD_DEDUCTIONS] -
    exemptions * VT_PERSONAL_EXEMPTION;
  deductionIncome = Math.max(0, deductionIncome);
  const schedule =
    VERMONT_BRACKETS[filingStatus as keyof typeof VERMONT_BRACKETS];
  let sum = 0;
  let previous_threshold = 0;
  for (let i = 0; i < schedule.length; i++) {
    let threshold = schedule[i].threshold;
    let rate = schedule[i].rate;
    let taxable = Math.min(deductionIncome, threshold) - previous_threshold;
    taxable = Math.max(taxable, 0);
    sum += taxable * rate;
    previous_threshold = threshold;
  }
  return sum;
}

function CalculateFederalEITC(
  filingStatus: number,
  earnedIncome: number,
  numberChildren: number,
): number {
  numberChildren = Math.min(numberChildren, 3);
  let credit = 0;

  // access data structure
  const schedules = FEDERAL_EITC[filingStatus as keyof typeof FEDERAL_EITC];
  const schedule = schedules[numberChildren as keyof typeof schedules];
  const maxCredit = schedule.maxCredit;
  const incomeForMaxCredit = schedule.incomeForMaxCredit;
  const thresholdPhaseout = schedule.thresholdPhaseout;
  const completedPhaseout = schedule.completedPhaseout;

  // logic
  const phaseInRate = maxCredit / incomeForMaxCredit;
  const phaseOutRate = maxCredit / (completedPhaseout - thresholdPhaseout);
  const phaseInCredit =
    Math.min(earnedIncome, incomeForMaxCredit) * phaseInRate;
  const phaseOutDebit =
    Math.max(0, earnedIncome - thresholdPhaseout) * phaseOutRate;
  return Math.max(0, phaseInCredit - phaseOutDebit);
}

function CalculateVT_EITC(federalEITC: number): number {
  return federalEITC * 0.38;
}

export function CalculateAnnualAfterTaxIncome(
  filingStatus: number,
  grossIncome: number,
  numberChildren: number,
  earnedIncome: number,
  selfEmployed: boolean,
): number {
  const federalTaxes = SumBasicFederalTaxes(filingStatus, grossIncome);
  const FICATaxes = SumFICATaxes(selfEmployed, earnedIncome);
  const VTTaxes = SumBasicVermontTaxes(
    filingStatus,
    grossIncome,
    numberChildren,
  );

  const debits = federalTaxes + FICATaxes + VTTaxes;
  return grossIncome - debits;
}

export function CalculateEarnedTaxCredits(
  filingStatus: number,
  earnedIncome: number,
  numberChildren: number,
): { federal: number; vermont: number } {
  const FederalCredits = CalculateFederalEITC(
    filingStatus,
    earnedIncome,
    numberChildren,
  );
  const VermontCredits = CalculateVT_EITC(FederalCredits);
  return { federal: FederalCredits, vermont: VermontCredits };
}
