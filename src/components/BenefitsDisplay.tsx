import {
  Container,
  Stack,
  Text,
  Title,
  Card,
  Group,
  Badge,
  Center,
} from "@mantine/core";
import type { CalculationResult, ProcessedHouseholdData } from "../types";

interface ResultsProps {
  result: CalculationResult;
  processedData: ProcessedHouseholdData;
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
            <Card key={benefit.name} withBorder mb="sm">
              <Group justify="space-between">
                <Text fw={600}>{benefit.name}</Text>
                {benefit.eligible ? (
                  <Badge color="green" size="lg">
                    ${benefit.amount}/month
                  </Badge>
                ) : (
                  <Badge color="gray">Not eligible</Badge>
                )}
              </Group>
            </Card>
          ))}
        </div>
      </Stack>
    </Container>
  );
}
