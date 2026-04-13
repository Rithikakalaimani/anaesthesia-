"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardUserBar from "@/components/DashboardUserBar";
import {
  PerioperativeSummaryIcon,
  PostoperativeSummaryIcon,
  PreanaestheticSummaryIcon,
} from "@/components/DailySummaryIcons";
import PatientViewActionIcon from "@/components/PatientViewActionIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type DailyRow = {
  time: string;
  patientName: string;
  age: number | null;
  gender: string;
  patientId: string;
  admissionType: string;
  attendingSurgeon: string;
  status: string;
};

type DailyPayload = {
  date: string;
  rows: DailyRow[];
  summary: {
    preanaestheticCount: number;
    perioperativeCount: number;
    postoperativeCount: number;
  };
  fitness: {
    provisionalFitOutOf100: number;
    fitForSurgeryOutOf100: number;
    notFitOutOf100: number;
  };
};

function statusBadgeClass(status: string) {
  const s = status?.toLowerCase() ?? "";
  if (s === "completed") return "bg-[#E5E7EB] text-[#4B5563]";
  if (s.includes("surgery")) return "bg-[#D1FAE5] text-[#047857]";
  if (s === "scheduled") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#DBEAFE] text-[#1D4ED8]";
}

function FitnessSlider({ label, value }: { label: string; value: number }) {
  const v = Math.min(100, Math.max(0, value));
  const getColor = () => {
    if (label === "Provisional fit") return "#2F80ED";
    if (label === "Fit for surgery") return "#27AE60";
    if (label === "Not fit for surgery") return "#EB5757";
  };

  const color = getColor();

  return (
    <div>
      {/* Label */}
      <div className='mb-1 flex items-center justify-between text-xs'>
        <span className='font-medium text-slate-700'>{label}</span>
        <span className='text-slate-600' style={{ color }}>
          {v}/100
        </span>
      </div>

      {/* Custom Line Slider */}
      <input
        type='range'
        min={0}
        max={100}
        value={v}
        readOnly
        className='w-full appearance-none bg-transparent cursor-default'
        style={{
          background: `linear-gradient(to right, ${color} ${v}%, #e5e7eb ${v}%)`,
          height: "6px",
          borderRadius: "999px",
        }}
      />

      {/* Hide thumb completely */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
        }
        input[type="range"]::-moz-range-thumb {
          width: 0;
          height: 0;
          border: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
        }
        input[type="range"]::-moz-range-track {
          height: 6px;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

export default function DashboardHomePage() {
  /** Always the current calendar day in local TZ (no date picker — API uses today). */
  const date = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);
  const [data, setData] = useState<DailyPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/dashboard/daily?date=${encodeURIComponent(date)}`,
      );
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = (await res.json()) as DailyPayload;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className='flex min-h-0 flex-col px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
      <header className='mb-6 flex min-h-[44px] items-center justify-between gap-3'>
        <h1 className='min-w-0 truncate font-raleway text-xl font-bold text-slate-700 md:text-2xl'>
          Home
        </h1>
        <DashboardUserBar />
      </header>

      {error && (
        <p className='mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
          {error}
        </p>
      )}

      <div className='flex min-h-0 flex-col gap-6 pb-4 lg:flex-row lg:items-start lg:pb-6'>
        <div className='min-w-0 flex-1'>
          <div className='w-full max-w-full overflow-x-auto overscroll-x-contain'>
            <div className='min-w-[720px]'>
              {/* HEADER */}
              <div className='grid grid-cols-[100px_2fr_1fr_1.5fr_1fr_80px] border-b border-slate-200 px-3 sm:px-4'>
                <div className='py-3 text-left font-semibold text-[#6B7280] text-xs'>
                  TIME
                </div>
                <div className='py-3 text-left font-semibold text-[#6B7280] text-xs'>
                  PATIENT DETAILS
                </div>
                <div className='py-3 text-left font-semibold text-[#6B7280] text-xs'>
                  TYPE
                </div>
                <div className='py-3 text-left font-semibold text-[#6B7280] text-xs'>
                  SURGEON
                </div>
                <div className='py-3 text-left font-semibold text-[#6B7280] text-xs'>
                  STATUS
                </div>
                <div className='py-3 text-center font-semibold text-[#6B7280] text-xs'>
                  ACTION
                </div>
              </div>

              {/* CARDS */}
              <div className='mt-4 flex flex-col gap-4'>
            {loading ? (
              <div className='text-center text-slate-500 py-10'>Loading…</div>
            ) : !data || data.rows.length === 0 ? (
              <div className='text-center text-slate-500 py-10'>
                No scheduled cases for this date with available information.
              </div>
            ) : (
              data.rows.map((row, idx) => (
                <div
                  key={`${row.patientId}-${row.time}-${idx}`}
                  className='grid grid-cols-[100px_2fr_1fr_1.5fr_1fr_80px] items-center rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:shadow-md sm:px-4'
                >
                  {/* TIME */}
                  <div className='text-slate-700 whitespace-nowrap text-xs font-medium'>
                    {row.time}
                  </div>

                  {/* PATIENT DETAILS */}
                  <div className='min-w-0 flex flex-col justify-start'>
                    <p className='font-semibold text-slate-800 text-xs leading-tight truncate'>
                      {row.patientName}
                    </p>

                    {/* AGE + ID */}
                    <div className='flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap'>
                      {row.age != null && <span>{row.age} yrs</span>}
                      <span className='text-slate-400'>•</span>
                      <span className='text-slate-600 font-medium'>
                        ID: {row.patientId}
                      </span>
                    </div>
                  </div>

                  {/* TYPE */}
                  <div className='text-slate-700 text-xs pl-2'>
                    {row.admissionType}
                  </div>

                  {/* SURGEON */}
                  <div className='text-slate-700 text-xs truncate pl-2'>
                    {row.attendingSurgeon}
                  </div>

                  {/* STATUS */}
                  <div className='pl-2'>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                        row.status,
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  {/* ACTION */}
                  <div className='text-center'>
                    <Link
                      href={`/dashboard/patients/${encodeURIComponent(
                        row.patientId,
                      )}/pre-anesthetic`}
                      className='inline-flex rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      aria-label={`View ${row.patientName}`}
                    >
                      <PatientViewActionIcon className='h-5 w-auto max-h-5 shrink-0' />
                    </Link>
                  </div>
                </div>
              ))
            )}
              </div>
            </div>
          </div>
        </div>

        <aside className='relative w-full shrink-0 lg:max-w-[260px]'>
          <div className='absolute bottom-0 left-0 top-0 hidden w-px bg-slate-200 lg:block' />

          <div className='space-y-6 pt-2 lg:pt-0 lg:pl-4'>
            {/* DAILY SUMMARY */}
            <div>
              <h2 className='mb-3 text-xs font-semibold text-[#6B7280]'>
                DAILY SUMMARY
              </h2>

              <div className='space-y-3'>
                <div className='flex items-center justify-between gap-3 rounded-lg bg-[#F6F8FB] px-5 py-5'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <PreanaestheticSummaryIcon className='h-8 w-8 shrink-0' />
                    <p className='text-sm font-medium text-[#374151]'>
                      Preanaesthetic
                    </p>
                  </div>
                  <p className='shrink-0 text-sm font-semibold text-slate-800'>
                    {loading ? "—" : (data?.summary.preanaestheticCount ?? 0)}
                  </p>
                </div>

                <div className='flex items-center justify-between gap-3 rounded-lg bg-[#F0FDF4] px-5 py-5'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <PerioperativeSummaryIcon className='h-8 w-8 shrink-0' />
                    <p className='text-sm font-medium text-[#374151]'>
                      Perioperative
                    </p>
                  </div>
                  <p className='shrink-0 text-sm font-semibold text-[#047857]'>
                    {loading ? "—" : (data?.summary.perioperativeCount ?? 0)}
                  </p>
                </div>

                <div className='flex items-center justify-between gap-3 rounded-lg bg-[#FFF7ED] px-5 py-5'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <PostoperativeSummaryIcon className='h-8 w-8 shrink-0' />
                    <p className='text-sm font-medium text-[#374151]'>
                      Postoperative
                    </p>
                  </div>
                  <p className='shrink-0 text-sm font-semibold text-[#C2410C]'>
                    {loading ? "—" : (data?.summary.postoperativeCount ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* HORIZONTAL DIVIDER */}
            <div className='border-t border-slate-200 lg:-ml-4' />

            {/* SURGERY FITNESS */}
            <div>
              <h2 className='mb-3 text-xs font-semibold text-[#6B7280]'>
                SURGERY FITNESS
              </h2>

              <div className='space-y-4'>
                <FitnessSlider
                  label='Provisional fit'
                  value={data?.fitness.provisionalFitOutOf100 ?? 0}
                />
                <FitnessSlider
                  label='Fit for surgery'
                  value={data?.fitness.fitForSurgeryOutOf100 ?? 0}
                />
                <FitnessSlider
                  label='Not fit for surgery'
                  value={data?.fitness.notFitOutOf100 ?? 0}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
