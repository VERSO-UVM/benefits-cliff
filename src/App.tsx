import { useState } from "react";

import InputForm from "./components/InputForm";
import calculateBenefits from "./utils/benefitCalculators";
import Results from "./components/BenefitsDisplay";
import { Title, Center } from "@mantine/core";

import type {
  RawHouseholdData,
  ProcessedHouseholdData,
  CalculationResult,
} from "./types";

import processHouseholdData from "./utils/processHouseholdData";

function App() {
  const [processedData, setProcessedData] =
    useState<ProcessedHouseholdData | null>(null);
  const [result, setResults] = useState<CalculationResult | null>(null);

  const handleCalculate = (data: RawHouseholdData) => {
    const processedData = processHouseholdData(data);
    console.log(data);
    setProcessedData(processedData);
    console.log(processedData);
    const results = calculateBenefits(processedData);
    setResults(results);
  };

  return (
    <div className="App">
      <Center>
        <Title order={1}> Vermont Benefits Cliff Calculator </Title>
      </Center>
      <InputForm onCalculate={handleCalculate} />
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
