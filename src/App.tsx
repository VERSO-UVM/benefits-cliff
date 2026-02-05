import { useState } from "react";

import MainInputForm from "./components/MainInputForm";
import calculateBenefits from "./utils/benefitCalculators";
import Results from "./components/BenefitsDisplay";
import { Title, Center } from "@mantine/core";

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
    setResult(calculateBenefits(processed, supplemental));
  };

  return (
    <div className="App">
      <Center>
        <Title order={1}>Vermont Benefits Cliff Calculator</Title>
      </Center>
      <MainInputForm onCalculate={handleCalculate} />
      {result && processedData && (
        <Results result={result} processedData={processedData} />
      )}
    </div>
  );
}

export default App;

{
  /* <p><strong>Total Benefits:</strong> ${result.totalBenefits}</p>
        <p><strong>Net Resources:</strong> ${result.netResources}</p> */
}
