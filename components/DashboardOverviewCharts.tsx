"use client";

import { useMemo, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type StagePendingCompleted = {
  stageKey: string;
  stageLabel: string;
  pending: number;
  completed: number;
};

export type AsaSlice = {
  grade: string;
  count: number;
  percent: number;
};

export type AnaesthesiaTypeRow = {
  type: string;
  count: number;
};

export type WeekDayMetric = {
  dateIso: string;
  chartDateLabel: string;
  surgeryCount: number;
  /** Hours; may be null from API when unset */
  avgDurationHours?: number | null;
};

export type DashboardOverviewPayload = {
  stagePendingCompleted: StagePendingCompleted[];
  asaDistribution: AsaSlice[];
  anaesthesiaTypes: AnaesthesiaTypeRow[];
  weekSurgeryTrend?: WeekDayMetric[];
};

/** Chart row with client flag for “today” dot styling (numeric fields normalized) */
type WeekChartPoint = {
  dateIso: string;
  chartDateLabel: string;
  surgeryCount: number;
  avgDurationHours: number;
  isToday: boolean;
};

const PENDING = "#F59E0B";
const COMPLETED = "#10B981";
const BAR_BLUE = "#3B82F6";
const BAR_TRACK = "#F3F4F6";
const SURGERY_LINE = "#2563EB";
const DURATION_STROKE = "#7C3AED";

/** Seven purple shades aligned with ASA I … Emergency from API order */
const ASA_PURPLES = [
  "#4C1D95",
  "#5B21B6",
  "#6D28D9",
  "#7C3AED",
  "#8B5CF6",
  "#A78BFA",
  "#C4B5FD",
];

/** Short X-axis labels for pending vs completed (match backend stageKey) */
const STAGE_SHORT_LABEL: Record<string, string> = {
  preop: "Pre",
  periop: "Peri",
  recovery: "Rec",
  postop: "Post",
};

type Props = {
  data: DashboardOverviewPayload | null;
  loading: boolean;
  error: string | null;
};

function DurationAreaDot(
  props: Readonly<{
    cx?: number;
    cy?: number;
    payload?: { isToday?: boolean };
  }>,
) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const r = 5;
  if (payload?.isToday) {
    return <circle cx={cx} cy={cy} r={r} fill={DURATION_STROKE} />;
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="white"
      stroke={DURATION_STROKE}
      strokeWidth={2}
    />
  );
}

function OverviewCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <h3 className="mb-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function DashboardOverviewCharts({
  data,
  loading,
  error,
}: Props) {
  const stageChartData =
    data?.stagePendingCompleted.map((s) => ({
      label: STAGE_SHORT_LABEL[s.stageKey] ?? s.stageLabel,
      pending: s.pending,
      completed: s.completed,
    })) ?? [];

  const asaSlices = data?.asaDistribution ?? [];
  const asaTotal = asaSlices.reduce((acc, s) => acc + s.count, 0);

  /** Do not use key `percent` — Recharts injects slice ratio as `percent` (0–1); a payload field would break labels. */
  const pieData = asaSlices.map((s, i) => ({
    name: s.grade,
    value: s.count,
    gradePercent: s.percent,
    fill: ASA_PURPLES[i % ASA_PURPLES.length],
  }));

  const anaesthesiaRows = data?.anaesthesiaTypes ?? [];
  const anaesthesiaMax = Math.max(
    1,
    ...anaesthesiaRows.map((r) => r.count),
  );

  const localTodayIso = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const weekChartData = useMemo((): WeekChartPoint[] => {
    const rows = data?.weekSurgeryTrend ?? [];
    return rows.map((r) => ({
      dateIso: r.dateIso,
      chartDateLabel: r.chartDateLabel,
      surgeryCount: Number(r.surgeryCount ?? 0),
      avgDurationHours: Number(r.avgDurationHours ?? 0),
      isToday: r.dateIso === localTodayIso,
    }));
  }, [data?.weekSurgeryTrend, localTodayIso]);

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((k) => (
            <OverviewCard key={k} title=" ">
              <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
                Loading charts…
              </div>
            </OverviewCard>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <OverviewCard title=" " className="lg:col-span-2">
            <div className="flex h-[240px] items-center justify-center text-sm text-slate-400">
              Loading charts…
            </div>
          </OverviewCard>
          <OverviewCard title=" ">
            <div className="flex h-[240px] items-center justify-center text-sm text-slate-400">
              Loading charts…
            </div>
          </OverviewCard>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* 1) Pending vs Completed */}
        <OverviewCard title='Pending vs Completed'>
          <div className='h-[280px] w-full min-w-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={stageChartData}
                margin={{ top: 8, right: 8, left: -8, bottom: 56 }}
                barGap={0}
                barCategoryGap='28%'
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#E5E7EB'
                />

                <XAxis
                  dataKey='label'
                  interval={0}
                  angle={0}
                  textAnchor='end'
                  height={20}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  tickMargin={30}
                />

                <YAxis
                  allowDecimals={false}
                  width={32}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                />

                {/* Tooltip */}
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const n =
                      name === "pending"
                        ? "Pending"
                        : name === "completed"
                          ? "Completed"
                          : String(name);
                    return [value ?? 0, n];
                  }}
                />

                {/* Bars  */}
                <Bar
                  dataKey='pending'
                  name='pending'
                  fill={PENDING}
                  radius={[0, 0, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey='completed'
                  name='completed'
                  fill={COMPLETED}
                  radius={[0, 0, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className='mt-2 flex flex-wrap items-center justify-center gap-6 text-xs'>
            <span className='inline-flex items-center gap-1.5 text-[#6B7280] font-medium'>
              <span
                className='h-2 w-2 shrink-0 rounded-full'
                style={{ backgroundColor: PENDING }}
              />
              Pending
            </span>

            <span className='inline-flex items-center gap-1.5 text-[#6B7280] font-medium'>
              <span
                className='h-2 w-2 shrink-0 rounded-full'
                style={{ backgroundColor: COMPLETED }}
              />
              Completed
            </span>
          </div>
        </OverviewCard>

        {/* 2) ASA Distribution */}
        <OverviewCard title='ASA Distribution'>
          {asaTotal === 0 ? (
            <div className='flex h-[220px] items-center justify-center text-sm text-slate-500'>
              No ASA data yet
            </div>
          ) : (
            <>
              <div className='h-[240px] w-full min-w-0'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
                    <Pie
                      data={pieData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      innerRadius={44}
                      outerRadius={68}
                      paddingAngle={1}
                      labelLine={false}
                      label={(props) => {
                        const { cx, cy, midAngle, outerRadius, percent } =
                          props;
                        if (
                          cx == null ||
                          cy == null ||
                          midAngle == null ||
                          outerRadius == null ||
                          percent == null
                        ) {
                          return null;
                        }
                        /* Recharts `percent` is the slice share in 0–1 (do not put a `percent` field on pie data). */
                        if (percent < 0.055) return null;
                        const RAD = Math.PI / 180;
                        const labelR = Number(outerRadius) + 16;
                        const mx = cx + labelR * Math.cos(-midAngle * RAD);
                        const my = cy + labelR * Math.sin(-midAngle * RAD);
                        return (
                          <text
                            x={mx}
                            y={my}
                            fill='#374151'
                            textAnchor={mx > cx ? "start" : "end"}
                            dominantBaseline='central'
                            className='text-[10px] font-semibold'
                          >
                            {`${Math.round(percent * 100)}%`}
                          </text>
                        );
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => {
                        const v = typeof value === "number" ? value : 0;
                        const p = item?.payload as {
                          gradePercent?: number;
                        };
                        const pct =
                          p?.gradePercent != null ? `${p.gradePercent}%` : "";
                        return [`${v}${pct ? ` (${pct})` : ""}`, "Patients"];
                      }}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className='mt-1 max-h-[72px] space-y-1 overflow-y-auto text-[10px] text-slate-600'>
                {asaSlices.map((s, i) => (
                  <li
                    key={s.grade}
                    className='flex items-center justify-between gap-2'
                  >
                    <span className='flex min-w-0 items-center gap-1.5'>
                      <span
                        className='h-2 w-2 shrink-0 rounded-sm'
                        style={{
                          backgroundColor: ASA_PURPLES[i % ASA_PURPLES.length],
                        }}
                      />
                      <span className='truncate'>{s.grade}</span>
                    </span>
                    <span className='shrink-0 font-medium tabular-nums text-slate-800'>
                      {s.percent}%
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </OverviewCard>

        {/* 3) Anaesthesia type */}
        <OverviewCard title='Anaesthesia Type'>
          <div className='space-y-4 pt-1'>
            {anaesthesiaRows.length === 0 ? (
              <p className='text-center text-sm text-slate-500 py-8'>
                No anaesthesia type data
              </p>
            ) : (
              anaesthesiaRows.map((row) => (
                <div key={row.type}>
                  <div className='mb-1 flex items-baseline justify-between gap-2 text-sm text-slate-800'>
                    <span className='font-medium text-slate-700 text-xs'>
                      {row.type}
                    </span>
                    <span className='shrink-0 tabular-nums font-semibold text-slate-900 text-xs'>
                      {row.count}
                    </span>
                  </div>
                  <div
                    className='mt-4 h-[10px] w-full overflow-hidden rounded-full'
                    style={{ backgroundColor: BAR_TRACK }}
                  >
                    <div
                      className='h-full rounded-full transition-[width] duration-300'
                      style={{
                        width: `${(row.count / anaesthesiaMax) * 100}%`,
                        backgroundColor: BAR_BLUE,
                        minWidth: row.count > 0 ? 4 : 0,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </OverviewCard>
      </div>

      {/* Surgeries Count */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <OverviewCard title='Surgeries Count' className='lg:col-span-2'>
          {weekChartData.length === 0 ? (
            <div className='flex h-[260px] items-center justify-center text-sm text-slate-500'>
              No weekly surgery trend data.
            </div>
          ) : (
            <div className='h-[260px] w-full min-w-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={weekChartData}
                  margin={{ top: 8, right: 12, left: 4, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#E5E7EB'
                  />
                  <XAxis
                    dataKey='chartDateLabel'
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    tickMargin={10}
                    interval={0}
                    padding={{ left: 10, right: 20 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={40}
                    domain={[0, "auto"]}
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                      offset: 4,
                      style: { fill: "#9CA3AF", fontSize: 10 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0].payload as WeekChartPoint;
                      return (
                        <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm'>
                          <div className='font-medium text-slate-700'>
                            {p.chartDateLabel}
                          </div>
                          <div className='mt-1 text-slate-600'>
                            Surgeries:{" "}
                            <span className='font-semibold tabular-nums text-slate-900'>
                              {p.surgeryCount}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='surgeryCount'
                    name='Surgeries'
                    stroke={SURGERY_LINE}
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: SURGERY_LINE,
                      stroke: SURGERY_LINE,
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: SURGERY_LINE,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </OverviewCard>

        <OverviewCard title='Avg Surgery Duration'>
          {weekChartData.length === 0 ? (
            <div className='flex h-[260px] items-center justify-center text-sm text-slate-500'>
              No weekly surgery trend data.
            </div>
          ) : (
            <div className='h-[260px] w-full min-w-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={weekChartData}
                  margin={{ top: 8, right: 8, left: 4, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id='avgDurationAreaFill'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='0%'
                        stopColor={DURATION_STROKE}
                        stopOpacity={0.18}
                      />
                      <stop
                        offset='100%'
                        stopColor={DURATION_STROKE}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#E5E7EB'
                  />
                  {/* <XAxis
                    dataKey="chartDateLabel"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    tickMargin={10}
                    interval={0}
                  /> */}
                  <XAxis
                    dataKey='chartDateLabel'
                    interval={0}
                    angle={-90}
                    textAnchor='end'
                    height={30}
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    tickMargin={20}
                  />
                  <YAxis
                    width={44}
                    domain={[0, "auto"]}
                    allowDecimals
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    tickFormatter={(v) =>
                      typeof v === "number" && Number.isFinite(v)
                        ? v.toFixed(1)
                        : String(v)
                    }
                    label={{
                      value: "hrs",
                      angle: -90,
                      position: "insideLeft",
                      offset: 4,
                      style: { fill: "#9CA3AF", fontSize: 10 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0].payload as WeekChartPoint;
                      const hrs = Number.isFinite(p.avgDurationHours)
                        ? p.avgDurationHours.toFixed(2)
                        : "0.00";
                      return (
                        <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm'>
                          <div className='font-medium text-slate-700'>
                            {p.chartDateLabel}
                          </div>
                          <div className='mt-1 text-slate-600'>
                            Avg duration:{" "}
                            <span className='font-semibold tabular-nums text-slate-900'>
                              {hrs} hrs
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='avgDurationHours'
                    name='Avg duration'
                    stroke={DURATION_STROKE}
                    strokeWidth={2}
                    fill='url(#avgDurationAreaFill)'
                    dot={(dotProps) => (
                      <DurationAreaDot
                        cx={dotProps.cx}
                        cy={dotProps.cy}
                        payload={dotProps.payload as WeekChartPoint}
                      />
                    )}
                    activeDot={{
                      r: 6,
                      fill: DURATION_STROKE,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </OverviewCard>
      </div>
    </div>
  );
}
