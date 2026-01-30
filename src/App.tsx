import { useState } from "react";

import InputForm from "./components/InputForm";
import calculateBenefits from "./utils/benefitCalculators";
import type { HouseholdData, CalculationResult } from "./types";

function App() {
  const [result, setResults] = useState<CalculationResult | null>(null);

  const handleCalculate = (data: HouseholdData) => {
    const results = calculateBenefits(data);
    setResults(results);
  };

  return (
    <div className="App">
      <h1> Vermont Benefits Cliff Calculator</h1>
      <InputForm onCalculate={handleCalculate} />
    </div>
  );
}

export default App;
