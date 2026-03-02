"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/** Colour palette aligned with pre-anaesthetic (slate / grayish-blue) */
const COLORS = {
  hr: "#475569",      // slate-600
  nibp: "#64748b",    // slate-500
  spo2: "#334155",    // slate-700
  rr: "#94a3b8",      // slate-400
} as const;

export type VitalSignsDataPoint = {
  time: string;
  HR?: number;
  NIBP?: number;
  SpO2?: number;
  RR?: number;
};

const defaultData: VitalSignsDataPoint[] = [
  { time: "00:00", HR: 72, NIBP: 120, SpO2: 98, RR: 14 },
  { time: "00:15", HR: 75, NIBP: 118, SpO2: 99, RR: 14 },
  { time: "00:30", HR: 78, NIBP: 122, SpO2: 98, RR: 15 },
  { time: "00:45", HR: 80, NIBP: 115, SpO2: 97, RR: 16 },
  { time: "01:00", HR: 82, NIBP: 110, SpO2: 98, RR: 15 },
  { time: "01:15", HR: 76, NIBP: 112, SpO2: 99, RR: 14 },
  { time: "01:30", HR: 74, NIBP: 118, SpO2: 98, RR: 14 },
];

export default function VitalSignsChart({
  data = defaultData,
  showHR = true,
  showNIBP = true,
  showSpO2 = true,
  showRR = false,
}: {
  data?: VitalSignsDataPoint[];
  showHR?: boolean;
  showNIBP?: boolean;
  showSpO2?: boolean;
  showRR?: boolean;
}) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={{ stroke: "#cbd5e1" }}
            domain={["auto", "auto"]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={{ stroke: "#cbd5e1" }}
            domain={[90, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.96)",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#475569" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value) => <span className="text-slate-600">{value}</span>}
          />
          {showHR && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="HR"
              name="HR"
              stroke={COLORS.hr}
              strokeWidth={2}
              dot={{ r: 2, fill: COLORS.hr }}
              activeDot={{ r: 4 }}
            />
          )}
          {showNIBP && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="NIBP"
              name="NIBP"
              stroke={COLORS.nibp}
              strokeWidth={2}
              dot={{ r: 2, fill: COLORS.nibp }}
              activeDot={{ r: 4 }}
            />
          )}
          {showSpO2 && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="SpO2"
              name="SpO2 %"
              stroke={COLORS.spo2}
              strokeWidth={2}
              dot={{ r: 2, fill: COLORS.spo2 }}
              activeDot={{ r: 4 }}
            />
          )}
          {showRR && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="RR"
              name="RR"
              stroke={COLORS.rr}
              strokeWidth={2}
              dot={{ r: 2, fill: COLORS.rr }}
              activeDot={{ r: 4 }}
            />
          )}
          <ReferenceLine yAxisId="right" y={95} stroke="#f59e0b" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
