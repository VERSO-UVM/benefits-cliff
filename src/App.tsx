import { useState } from "react";

import MainInputForm from "./components/MainInputForm";
import calculateBenefits from "./utils/benefitCalculators";
import Results from "./components/BenefitsDisplay";
import BenefitsChart from "./components/BenefitsChart";
import { Title, Center, Alert, Stack, Text } from "@mantine/core";

import type {
  RawHouseholdData,
  BenefitProcessedHouseholdData,
  CalculationResult,
  SupplementalInfo,
} from "./types";
import {
  processBenefitHouseholdData,
  processTaxData,
} from "./utils/processInputData";

function App() {
  const [processedData, setProcessedData] =
    useState<BenefitProcessedHouseholdData | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [rawData, setRawData] = useState<RawHouseholdData | null>(null);
  const [supplementalData, setSupplementalData] =
    useState<SupplementalInfo | null>(null);

  const handleCalculate = (
    data: RawHouseholdData,
    supplemental: SupplementalInfo,
  ) => {
    const processed = processBenefitHouseholdData(data, supplemental);
    const tax = processTaxData(data);
    setRawData(data);
    setSupplementalData(supplemental);
    setProcessedData(processed);
    setResult(calculateBenefits(processed, supplemental, tax));
  };

  return (
    <div className="App">
      <Center>
        <Stack align="center">
          <Title order={1}>Vermont Benefits Estimator</Title>

          <MainInputForm onCalculate={handleCalculate} />
          {result && processedData && rawData && supplementalData && (
            <>
              <Results result={result} processedData={processedData} />
              <BenefitsChart rawData={rawData} supplemental={supplementalData} />
            </>
          )}
          <Alert
            color="red"
            variant="filled"
            styles={{
              body: { textAlign: "center" },
              title: { textAlign: "center" },
            }}
            title="Warning"
          >
            <Text>
              Caveat: the Vermont Benefits Estimator is intended as an initial
              reference.
            </Text>
            <Text>
              It is a work in progress and does not include all factors involved
              in benefits estimation.
            </Text>
            <Text>
              Always trust current state guidelines, policies, and conclusions
              over the estimations you see here.
            </Text>
          </Alert>
        </Stack>
      </Center>
    </div>
  );
}

export default App;

{
  /* <p><strong>Total Benefits:</strong> ${result.totalBenefits}</p>
        <p><strong>Net Resources:</strong> ${result.netResources}</p> */
}
