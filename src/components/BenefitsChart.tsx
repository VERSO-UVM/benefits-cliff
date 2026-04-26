import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Title, Text, RangeSlider } from "@mantine/core";
import type { RawHouseholdData, SupplementalInfo } from "../types";
import calculateBenefits from "../utils/benefitCalculators";
import {
  processBenefitHouseholdData,
  processTaxData,
} from "../utils/processInputData";
import { calculateAfterIncomeTax } from "../data/Taxes";

const AFTER_TAX_COLOR = "#1565C0";

const SERIES_COLORS = [
  "#4CAF50",
  "#9C27B0",
  "#FF9800",
  "#F44336",
  "#00BCD4",
  "#795548",
  "#607D8B",
  "#2196F3",
];

interface Props {
  rawData: RawHouseholdData;
  supplemental: SupplementalInfo;
}

interface RefLineInfo {
  x: number;
  label: string;
}

interface ChartResult {
  points: Array<Record<string, number>>;
  seriesKeys: string[];
  refLines: RefLineInfo[];
}

const AFTER_TAX_KEY = "After-Tax Income";

function buildChartData(
  rawData: RawHouseholdData,
  supplemental: SupplementalInfo,
): ChartResult {
  const rawPoints: Array<Record<string, number>> = [];
  const seenWithAmount = new Set<string>();
  const seenEligibilityOnly = new Set<string>();
  const prevEligibility: Record<string, boolean> = {};
  const cutoffs: Record<string, number> = {};

  for (let annualIncome = 0; annualIncome <= 85000; annualIncome += 100) {
    const data: RawHouseholdData = {
      ...rawData,
      earnedMonthlyIncome: annualIncome / 12,
    };
    const processed = processBenefitHouseholdData(data, supplemental);
    const taxData = processTaxData(data);
    const result = calculateBenefits(processed, supplemental, taxData);

    const pt: Record<string, number> = { annualIncome };

    pt[AFTER_TAX_KEY] = calculateAfterIncomeTax(
      taxData.filingStatus,
      taxData.grossAnnualIncome,
      taxData.children,
    );
    seenWithAmount.add(AFTER_TAX_KEY);

    for (const c of result.taxCredits) {
      seenWithAmount.add(c.name);
      pt[c.name] = c.annualAmount;
    }

    for (const b of result.benefits) {
      if (b.amount !== undefined) {
        seenWithAmount.add(b.name);
        pt[b.name] = Math.max(0, b.amount) * 12;
      } else {
        seenEligibilityOnly.add(b.name);
        const was = prevEligibility[b.name];
        if (was === true && !b.eligible && !(b.name in cutoffs)) {
          cutoffs[b.name] = annualIncome;
        }
        prevEligibility[b.name] = b.eligible;
      }
    }

    rawPoints.push(pt);
  }

  // Only show as reference lines if they never had a dollar amount
  const eligibilityOnlyNames = [...seenEligibilityOnly].filter(
    (n) => !seenWithAmount.has(n),
  );
  const refLines: RefLineInfo[] = eligibilityOnlyNames
    .filter((n) => n in cutoffs)
    .map((n) => ({ x: cutoffs[n], label: n }));

  // After-Tax Income first, then tax credits, then benefits
  const seriesKeys = [
    AFTER_TAX_KEY,
    ...[...seenWithAmount].filter((k) => k !== AFTER_TAX_KEY),
  ];

  // Fill in 0 for any series keys missing from a given point
  const points = rawPoints.map((pt) => {
    const filled: Record<string, number> = { annualIncome: pt.annualIncome };
    for (const k of seriesKeys) {
      filled[k] = pt[k] ?? 0;
    }
    return filled;
  });

  return { points, seriesKeys, refLines };
}

function fmtDollars(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  const nonzero = payload.filter((p) => p.value > 0);
  const total = nonzero.reduce((sum, p) => sum + p.value, 0);

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: "10px 14px",
        fontSize: 13,
        maxWidth: 300,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
        Annual Income: ${Number(label).toLocaleString()}
      </p>
      {nonzero.map((p) => (
        <p key={p.name} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: ${Math.round(p.value).toLocaleString()}/yr
        </p>
      ))}
      {nonzero.length > 1 && (
        <p
          style={{
            margin: "6px 0 0",
            fontWeight: 600,
            borderTop: "1px solid #eee",
            paddingTop: 4,
          }}
        >
          Total: ${Math.round(total).toLocaleString()}/yr
        </p>
      )}
      {nonzero.length === 0 && (
        <p style={{ margin: 0, color: "#888" }}>No benefits at this income</p>
      )}
    </div>
  );
}

export default function BenefitsChart({ rawData, supplemental }: Props) {
  const { points, seriesKeys, refLines } = useMemo(
    () => buildChartData(rawData, supplemental),
    [rawData, supplemental],
  );

  const [range, setRange] = useState<[number, number]>([0, 85000]);
  const visiblePoints = points.filter(
    (p) => p.annualIncome >= range[0] && p.annualIncome <= range[1],
  );

  const actualAnnualIncome = Math.round(rawData.earnedMonthlyIncome * 12);

  return (
    <div style={{ width: "100%", maxWidth: 900, marginTop: 16 }}>
      <Title order={3} mb={4} ta="center">
        Benefits Across Income Levels
      </Title>
      <Text size="sm" c="dimmed" ta="center" mb="md">
        Annual benefit value by annual earned income — all other household
        factors held constant
      </Text>
      <RangeSlider
        min={0}
        max={85000}
        step={1000}
        value={range}
        onChange={setRange}
        label={fmtDollars}
        mb="md"
      />
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart
          data={visiblePoints}
          margin={{ top: 10, right: 30, left: 60, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="annualIncome"
            angle={-45}
            textAnchor="end"
            tickFormatter={fmtDollars}
            label={{
              value: "Annual Earned Income",
              position: "insideBottom",
              offset: -20,
            }}
          />
          <YAxis
            tickFormatter={fmtDollars}
            label={{
              value: "Total Resources",
              angle: -90,
              position: "insideLeft",
              offset: -40,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />

          {seriesKeys.map((key, i) => {
            const color =
              key === AFTER_TAX_KEY
                ? AFTER_TAX_COLOR
                : SERIES_COLORS[(i - 1) % SERIES_COLORS.length];
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={color}
                fill={color}
                fillOpacity={key === AFTER_TAX_KEY ? 0.85 : 0.65}
              />
            );
          })}

          {refLines.map((rl) => (
            <ReferenceLine
              key={rl.label}
              x={rl.x}
              stroke="#555"
              strokeDasharray="5 3"
              label={{
                value: rl.label,
                position: "insideTopLeft",
                fontSize: 10,
                fill: "#555",
              }}
            />
          ))}

          <ReferenceLine
            x={actualAnnualIncome}
            stroke="red"
            strokeDasharray="8 4"
            strokeWidth={2}
            label={{
              value: "Your income",
              position: "insideTopRight",
              fill: "red",
              fontSize: 11,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
