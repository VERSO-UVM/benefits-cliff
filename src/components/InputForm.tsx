import { useState } from "react";
import type { ChangeEvent } from "react";
import type { RawHouseholdData } from "../types";

interface InputFormProps {
  onCalculate: (data: RawHouseholdData) => void;
}

export default function InputForm({ onCalculate }: InputFormProps) {
  const [formData, setFormData] = useState<RawHouseholdData>({
    annualIncome: 0,
    adults: 1,
    children: 0,
    monthlyShelterCost: 0,
  });
  const handleSubmit = () => {
    onCalculate(formData);
  };

  const handleChange =
    (field: keyof RawHouseholdData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: Number(e.target.value) }));
    };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        <label>
          Annual Income:
          <input
            type="number"
            value={formData.annualIncome}
            onChange={handleChange("annualIncome")}
            min="0"
            step="1000"
          />
        </label>
      </div>

      <div>
        <label>
          Adults in Household:
          <input
            type="number"
            value={formData.adults}
            onChange={handleChange("adults")}
            min="1"
            max="10"
          />
        </label>
      </div>

      <div>
        <label>
          Children in Household:
          <input
            type="number"
            value={formData.children}
            onChange={handleChange("children")}
            min="0"
            max="10"
          />
        </label>
      </div>

      <div>
        <label>
          Monthly Shelter Cost
          <input
            type="number"
            value={formData.monthlyShelterCost}
            onChange={handleChange("monthlyShelterCost")}
            min="0"
            max="10000"
            step="100"
          />
        </label>
      </div>

      <button type="submit">Calculate Benefits</button>
    </form>
  );
}
