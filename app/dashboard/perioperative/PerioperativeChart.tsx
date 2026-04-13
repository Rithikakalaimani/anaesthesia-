"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Line } from "react-chartjs-2";
import { svgDataUrlForMetric } from "./PerioperativeMetricIcons";

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

const Y_DEFAULT_MIN = 0;
const Y_DEFAULT_MAX = 220;

/** Time labels for X-axis  */
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

const COLORS: Record<PlotMetric, string> = {
  "Heart Rate": "#b3c8d0",
  Systolic: "#8da9b2",
  Diastolic: "#b88d6e",
  Temp: "#525952",
  ETCO2: "#036490",
  SpO2: "#0e1a20",
};

export type ChartPoint = { time: string; value: number; metric: PlotMetric };

export type PerioperativeChartProps = {
  points: ChartPoint[];
  timeLabels: string[];
  className?: string;
};

export default function PerioperativeChart({
  points,
  timeLabels,
  className = "",
}: PerioperativeChartProps) {
  const [pointImages, setPointImages] = useState<
    Partial<Record<PlotMetric, HTMLImageElement>>
  >({});
  const [showConnectingLines, setShowConnectingLines] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      PLOT_METRICS.map(
        (m) =>
          new Promise<[PlotMetric, HTMLImageElement]>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve([m, img]);
            img.onerror = () =>
              reject(new Error(`perioperative icon failed: ${m}`));
            img.src = svgDataUrlForMetric(m, COLORS[m]);
          }),
      ),
    )
      .then((entries) => {
        if (!cancelled) {
          setPointImages(Object.fromEntries(entries));
        }
      })
      .catch(() => {
        /* keep circle fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byMetric = useMemo(
    () =>
      PLOT_METRICS.reduce<Record<PlotMetric, { x: string; y: number }[]>>(
        (acc, m) => {
          acc[m] = points
            .filter((p) => p.metric === m)
            .map((p) => ({ x: p.time, y: p.value }))
            .sort(
              (a, b) => timeLabels.indexOf(a.x) - timeLabels.indexOf(b.x),
            );
          return acc;
        },
        {} as Record<PlotMetric, { x: string; y: number }[]>,
      ),
    [points, timeLabels],
  );

  const datasets = useMemo(
    () =>
      PLOT_METRICS.filter((m) => byMetric[m].length > 0).map((metric) => {
        const img = pointImages[metric];
        return {
          label: metric,
          data: byMetric[metric],
          showLine: showConnectingLines,
          borderColor: COLORS[metric],
          backgroundColor: `${COLORS[metric]}20`,
          borderWidth: 2,
          pointBackgroundColor: COLORS[metric],
          pointBorderColor: COLORS[metric],
          pointHoverBackgroundColor: COLORS[metric],
          pointHoverBorderColor: COLORS[metric],
          fill: false,
          tension: 0.6,
          pointStyle: img ?? "circle",
          pointRadius: img ? 2 : 2,
          pointHoverRadius: 4,
        };
      }),
    [byMetric, pointImages, showConnectingLines],
  );

  const chartData = useMemo(
    () => ({
      labels: timeLabels,
      datasets,
    }),
    [timeLabels, datasets],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
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
          offset: true,
        },
        y: {
          title: { display: true, text: "Value" },
          grid: { color: "#e2e8f0" },
          ticks: {
            color: "#64748b",
            font: { size: 11 },
          },
          min: Y_DEFAULT_MIN,
          max: Y_DEFAULT_MAX,
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "#64748b",
            font: { size: 9 },
            usePointStyle: true,
            pointStyleWidth: 12,
            pointStyleHeight: 12,
          },
        },
      },
    }),
    [timeLabels],
  );

  return (
    <div className={`flex h-full w-full flex-col ${className}`} style={{ minHeight: 200 }}>
      <div className='mb-2 flex justify-end print:hidden'>
        <button
          type='button'
          role='switch'
          data-chart-lines-toggle
          aria-checked={showConnectingLines}
          aria-label={
            showConnectingLines
              ? "Connecting lines on"
              : "Connecting lines off"
          }
          onClick={() => setShowConnectingLines((v) => !v)}
          className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80A6F0] focus-visible:ring-offset-2 ${
            showConnectingLines ? "bg-[#80A6F0]" : "bg-slate-200"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
              showConnectingLines ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      <div className='min-h-0 flex-1'>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
