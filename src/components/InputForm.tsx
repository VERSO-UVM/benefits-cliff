import { useState } from "react";
import type { RawHouseholdData } from "../types";
import { Button, NumberInput, Stack, Container } from "@mantine/core";

interface InputFormProps {
  onCalculate: (data: RawHouseholdData) => void;
}

export default function InputForm({ onCalculate }: InputFormProps) {
  const [formData, setFormData] = useState<RawHouseholdData>({
    earnedMonthlyIncome: 0,
    unearnedMonthlyIncome: 0,
    adults: 1,
    children: 0,
    monthlyShelterCost: 0,
  });

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Container size="xs">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <NumberInput
            label="Earned Monthly Income"
            value={formData.earnedMonthlyIncome}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                earnedMonthlyIncome: Number(value),
              }))
            }
            min={0}
            step={100}
            thousandSeparator=","
            prefix="$"
          />

          <NumberInput
            label="Unearned Monthly Income"
            value={formData.unearnedMonthlyIncome}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                unearnedMonthlyIncome: Number(value),
              }))
            }
            min={0}
            step={100}
            thousandSeparator=","
            prefix="$"
          />

          <NumberInput
            label="Adults in Household"
            value={formData.adults}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, adults: Number(value) }))
            }
            min={1}
            max={10}
          />

          <NumberInput
            label="Children Under Nineteen in Household"
            value={formData.children}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, children: Number(value) }))
            }
            min={0}
            max={10}
          />

          <NumberInput
            label="Monthly Shelter Cost"
            value={formData.monthlyShelterCost}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                monthlyShelterCost: Number(value),
              }))
            }
            min={0}
            step={100}
            thousandSeparator=","
            prefix="$"
          />

          <Button type="submit" fullWidth>
            Calculate Benefits
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
