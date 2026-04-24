import { useState } from "react";

import MainInputForm from "./components/MainInputForm";
import calculateBenefits from "./utils/benefitCalculators";
import Results from "./components/BenefitsDisplay";
import { Title, Center, Alert, Stack, Text } from "@mantine/core";

import type {
  RawHouseholdData,
  ProcessedHouseholdData,
  CalculationResult,
  SupplementalInfo,
} from "./types";

import processHouseholdData from "./utils/processHouseholdData";

function App() {
  const [processedData, setProcessedData] =
    useState<ProcessedHouseholdData | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = (
    data: RawHouseholdData,
    supplemental: SupplementalInfo,
  ) => {
    const processed = processHouseholdData(data, supplemental);
    setProcessedData(processed);
    setResult(calculateBenefits(processed, data, supplemental));
  };

  return (
    <div className="App">
      <Center>
        <Stack align="center">
          <Title order={1}>Vermont Benefits Estimator</Title>

          <MainInputForm onCalculate={handleCalculate} />
          {result && processedData && (
            <Results result={result} processedData={processedData} />
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
