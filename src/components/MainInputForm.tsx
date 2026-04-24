import { useState, useEffect } from "react";
import type {
  RawHouseholdData,
  SupplementalInfo,
  DependentChild,
  TaxFilingStatus,
} from "../types";
import type { ChildcareDuration, ChildcareType } from "../data/ccfap";
import {
  Button,
  NumberInput,
  Select,
  Stack,
  Container,
  Checkbox,
  Title,
  Collapse,
  Paper,
  Group,
  CloseButton,
  Text,
} from "@mantine/core";

interface InputFormProps {
  onCalculate: (data: RawHouseholdData, supplement: SupplementalInfo) => void;
}

const DURATION_OPTIONS = [
  { value: "partTime", label: "Part time (1-25 hrs/wk)" },
  { value: "fullTime", label: "Full time (26-50 hrs/wk)" },
  { value: "extendedCare", label: "Extended (50+ hrs/wk)" },
];

const TYPE_OPTIONS = [
  { value: "licensedCenter", label: "Licensed center" },
  { value: "registeredHome", label: "Registered home" },
];

const FILING_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "marriedFilingJointly", label: "Married filing jointly" },
  { value: "headOfHousehold", label: "Head of household" },
];

function derivedFilingStatus(
  adults: number,
  numChildren: number,
): TaxFilingStatus | null {
  if (adults === 1) return numChildren === 0 ? "single" : "headOfHousehold";
  return null;
}

function ChildRow({
  child,
  onUpdate,
  onRemove,
}: {
  child: DependentChild;
  onUpdate: (updated: DependentChild) => void;
  onRemove: () => void;
}) {
  return (
    <Paper withBorder p="sm">
      <Group justify="space-between" align="flex-start" mb="xs">
        <NumberInput
          label="Age"
          value={child.age}
          onChange={(v) => onUpdate({ ...child, age: Number(v) })}
          min={0}
          max={18}
          w={70}
        />
        <CloseButton mt={24} onClick={onRemove} />
      </Group>
      <Group gap="xs" grow>
        <Select
          label="Childcare duration"
          value={child.childcareDuration}
          onChange={(v) =>
            onUpdate({ ...child, childcareDuration: v as ChildcareDuration })
          }
          data={DURATION_OPTIONS}
        />
        <Select
          label="Childcare type"
          value={child.childcareType}
          onChange={(v) =>
            onUpdate({ ...child, childcareType: v as ChildcareType })
          }
          data={TYPE_OPTIONS}
        />
      </Group>
    </Paper>
  );
}

function DependentChildrenSection({
  children,
  onChange,
}: {
  children: DependentChild[];
  onChange: (children: DependentChild[]) => void;
}) {
  const addChild = () =>
    onChange([
      ...children,
      { age: 0, childcareDuration: "fullTime", childcareType: "licensedCenter" },
    ]);

  const updateChild = (i: number, updated: DependentChild) =>
    onChange(children.map((c, idx) => (idx === i ? updated : c)));

  const removeChild = (i: number) =>
    onChange(children.filter((_, idx) => idx !== i));

  return (
    <Stack gap="xs">
      <Title order={5}>Dependent children:</Title>
      {children.length === 0 && (
        <Text size="sm" c="dimmed">
          No children added yet.
        </Text>
      )}
      {children.map((child, i) => (
        <ChildRow
          key={i}
          child={child}
          onUpdate={(updated) => updateChild(i, updated)}
          onRemove={() => removeChild(i)}
        />
      ))}
      <Button variant="light" size="xs" onClick={addChild}>
        + Add dependent child
      </Button>
    </Stack>
  );
}

function SupplementalQuestions({
  data,
  onChange,
}: {
  data: SupplementalInfo;
  onChange: (data: SupplementalInfo) => void;
}) {
  return (
    <Stack gap="xs">
      <Title order={5}>Additional household details:</Title>
      <Checkbox
        label="Household includes pregnant member"
        checked={data.hasPregnantMember}
        onChange={(e) =>
          onChange({ ...data, hasPregnantMember: e.currentTarget.checked })
        }
      />
    </Stack>
  );
}

export default function MainInputForm({ onCalculate }: InputFormProps) {
  const [formData, setFormData] = useState<RawHouseholdData>({
    earnedMonthlyIncome: 0,
    unearnedMonthlyIncome: 0,
    adults: 1,
    dependentChildren: [],
    taxFilingStatus: "single",
    monthlyShelterCost: 0,
    monthlyChildcareCost: 0,
  });

  const [supplemental, setSupplemental] = useState<SupplementalInfo>({
    hasPregnantMember: false,
  });

  const [showSupplemental, setShowSupplemental] = useState(false);

  // Auto-lock filing status when only one adult
  useEffect(() => {
    const locked = derivedFilingStatus(
      formData.adults,
      formData.dependentChildren.length,
    );
    if (locked && formData.taxFilingStatus !== locked) {
      setFormData((prev) => ({ ...prev, taxFilingStatus: locked }));
    }
  }, [formData.adults, formData.dependentChildren.length]);

  const locked = derivedFilingStatus(
    formData.adults,
    formData.dependentChildren.length,
  );

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    onCalculate(formData, supplemental);
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

          <Select
            label="Tax filing status"
            value={formData.taxFilingStatus}
            onChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                taxFilingStatus: v as TaxFilingStatus,
              }))
            }
            data={FILING_STATUS_OPTIONS}
            disabled={locked !== null}
            description={
              locked !== null
                ? "Determined by household composition"
                : undefined
            }
          />

          <DependentChildrenSection
            children={formData.dependentChildren}
            onChange={(dependentChildren) =>
              setFormData((prev) => ({ ...prev, dependentChildren }))
            }
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

          <NumberInput
            label="Monthly Childcare Cost"
            value={formData.monthlyChildcareCost}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                monthlyChildcareCost: Number(value),
              }))
            }
            min={0}
            step={100}
            thousandSeparator=","
            prefix="$"
          />

          <Button
            variant="subtle"
            onClick={() => setShowSupplemental(!showSupplemental)}
          >
            {showSupplemental ? "Hide" : "Show"} additional questions for
            greater accuracy
          </Button>

          <Collapse in={showSupplemental}>
            <SupplementalQuestions
              data={supplemental}
              onChange={setSupplemental}
            />
          </Collapse>

          <Button type="submit" fullWidth>
            Calculate Benefits
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
