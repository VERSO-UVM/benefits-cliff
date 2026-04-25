import {
  Container,
  Stack,
  Text,
  Title,
  Card,
  Group,
  Badge,
  Center,
  Anchor,
} from "@mantine/core";
import type { CalculationResult, BenefitProcessedHouseholdData, BenefitResult, TaxCreditResult } from "../types";

interface ResultsProps {
  result: CalculationResult;
  processedData: BenefitProcessedHouseholdData;
}

function BenefitCard({ benefit }: { benefit: BenefitResult }) {
  const badge = benefit.eligible ? (
    benefit.amount ? (
      <Badge color="green" size="lg">
        ${benefit.amount}/month
      </Badge>
    ) : (
      <Badge color="green">Eligible</Badge>
    )
  ) : (
    <Badge color="gray">Not eligible</Badge>
  );

  return (
    <Card key={benefit.name} withBorder mb="sm">
      <Group justify="space-between">
        <Stack gap={2}>
          <Text fw={600}>{benefit.name}</Text>
          {benefit.eligible && benefit.url && (
            <Anchor href={benefit.url} target="_blank" size="xs">
              Learn more →
            </Anchor>
          )}
        </Stack>
        {badge}
      </Group>
    </Card>
  );
}

function TaxCreditCard({ credit }: { credit: TaxCreditResult }) {
  return (
    <Card withBorder mb="sm">
      <Group justify="space-between">
        <Stack gap={2}>
          <Text fw={600}>{credit.name}</Text>
          {credit.url && (
            <Anchor href={credit.url} target="_blank" size="xs">
              Learn more →
            </Anchor>
          )}
        </Stack>
        <Badge color={credit.annualAmount > 0 ? "blue" : "gray"} size="lg">
          {credit.annualAmount > 0 ? `$${credit.annualAmount}/year` : "None"}
        </Badge>
      </Group>
    </Card>
  );
}

export default function Results({ result, processedData }: ResultsProps) {
  return (
    <Container size="xs" mt="xl">
      <Stack gap="lg">
        <Center>
          <Title order={2}>Results</Title>
        </Center>

        <Title order={3}> Income </Title>
        <Card withBorder>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Gross Monthly Income:</Text>
              <Text>${processedData.grossMonthlyIncome.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Net Monthly Income:</Text>
              <Text>${processedData.netMonthlyIncome.toFixed(2)}</Text>
            </Group>
          </Stack>
        </Card>

        <div>
          <Title order={3} mb="sm">
            Benefits
          </Title>
          {result.benefits.map((benefit) => (
            <BenefitCard key={benefit.name} benefit={benefit} />
          ))}
        </div>

        <div>
          <Title order={3} mb={4}>
            Tax Credits
          </Title>
          <Text size="xs" c="dimmed" mb="sm">
            Estimated annual amounts assuming standard deductions
          </Text>
          {result.taxCredits.map((credit) => (
            <TaxCreditCard key={credit.name} credit={credit} />
          ))}
        </div>
      </Stack>
    </Container>
  );
}
