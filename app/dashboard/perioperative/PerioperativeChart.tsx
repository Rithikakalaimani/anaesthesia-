"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { Chart } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/** Time labels for X-axis (e.g. 00:00 to 04:00 in 15 min steps) */
const TIME_LABELS = (() => {
  const out: string[] = [];
  for (let h = 0; h <= 4; h++) {
    for (let m = 0; m < 60; m += 15) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
})();

export const PLOT_METRICS = [
  "Heart Rate",
  "Systolic",
  "Diastolic",
  "Temp",
  "ETCO2",
  "SpO2",
] as const;
export type PlotMetric = (typeof PLOT_METRICS)[number];

const DEFAULT_VALUE: Record<PlotMetric, number> = {
  "Heart Rate": 72,
  Systolic: 120,
  Diastolic: 80,
  Temp: 36.5,
  ETCO2: 35,
  SpO2: 98,
};

const COLORS: Record<PlotMetric, string> = {
  "Heart Rate": "#475569",
  Systolic: "#64748b",
  Diastolic: "#94a3b8",
  Temp: "#334155",
  ETCO2: "#64748b",
  SpO2: "#475569",
};

export type ChartPoint = { time: string; value: number; metric: PlotMetric };

export type PerioperativeChartProps = {
  selectedMetric: PlotMetric;
  points: ChartPoint[];
  onAddPoint: (time: string, value: number, metric: PlotMetric) => void;
  className?: string;
};

export default function PerioperativeChart({
  selectedMetric,
  points,
  onAddPoint,
  className = "",
}: PerioperativeChartProps) {
  const byMetric = PLOT_METRICS.reduce<
    Record<PlotMetric, { x: string; y: number }[]>
  >(
    (acc, m) => {
      acc[m] = points
        .filter((p) => p.metric === m)
        .map((p) => ({ x: p.time, y: p.value }))
        .sort((a, b) => TIME_LABELS.indexOf(a.x) - TIME_LABELS.indexOf(b.x));
      return acc;
    },
    {} as Record<PlotMetric, { x: string; y: number }[]>,
  );

  const datasets = PLOT_METRICS.filter((m) => byMetric[m].length > 0).map(
    (metric) => ({
      label: metric,
      data: byMetric[metric],
      borderColor: COLORS[metric],
      backgroundColor: `${COLORS[metric]}20`,
      fill: false,
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }),
  );

  const chartData = {
    labels: TIME_LABELS,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    onClick: (
      event: unknown,
      elements: { index?: number }[],
      chart?: Chart,
    ) => {
      let index: number | null = null;
      if (elements.length > 0 && elements[0].index != null) {
        index = elements[0].index;
      } else if (chart?.canvas) {
        const rect = chart.canvas.getBoundingClientRect();
        const ev =
          (event as { nativeEvent?: { clientX?: number }; clientX?: number })
            ?.nativeEvent ?? (event as { clientX?: number });
        const clientX = (ev && "clientX" in ev ? ev.clientX : undefined) ?? 0;
        const x = clientX - rect.left;
        const xScale = chart.scales.x;
        if (xScale) {
          const raw = xScale.getValueForPixel(x);
          index = Math.round(Number(raw));
        }
      }
      if (index == null || index < 0 || index >= TIME_LABELS.length) return;
      const time = TIME_LABELS[index];
      const value = DEFAULT_VALUE[selectedMetric];
      onAddPoint(time, value, selectedMetric);
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        grid: { display: false },
        ticks: {
          maxTicksLimit: 12,
          color: "#64748b",
          font: { size: 11 },
        },
      },
      y: {
        title: { display: true, text: "Value" },
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#64748b", font: { size: 11 } },
      },
    },
  };

  return (
    <div className={`h-full w-full ${className}`} style={{ minHeight: 200 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
