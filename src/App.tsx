import { useState } from "react";

import InputForm from "./components/InputForm";
import calculateBenefits from "./utils/benefitCalculators";

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
      <h1> Vermont Benefits Cliff Calculator</h1>
      <InputForm onCalculate={handleCalculate} />
      {result && (
        <div>
          <h2>Results</h2>
          <p>Gross Monthly Income: {processedData?.grossMonthlyIncome}</p>
          <p>Net Monthly Income: {processedData?.netMonthlyIncome}</p>
          <h3>Benefit: </h3>
          {result.benefits.map((benefit) => (
            <div key={benefit.name}>
              <strong>{benefit.name}:</strong>
              {benefit.eligible ? ` $${benefit.amount}/month` : " Not eligible"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default App;

{
  /* <p><strong>Total Benefits:</strong> ${result.totalBenefits}</p>
        <p><strong>Net Resources:</strong> ${result.netResources}</p> */
}
