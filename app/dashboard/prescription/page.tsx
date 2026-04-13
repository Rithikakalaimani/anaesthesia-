"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardUserBar from "@/components/DashboardUserBar";
import PatientViewActionIcon from "@/components/PatientViewActionIcon";
import {
  useInfinitePatients,
  type PatientSummary,
} from "@/lib/infinitePatients";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
      />
    </svg>
  );
}

function normalizeStage(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

function formatStageDisplayLabel(stage: string | undefined): string {
  const s = normalizeStage(stage);
  if (s === "pre-anaesthetic") return "PRE OP";
  if (s === "perioperative") return "PERI OP";
  if (s === "recovery") return "RECOVERY";
  if (s === "post-anaesthesia" || s === "post-operative") return "POST OP";
  return stage?.trim() || "—";
}

function matchesSearch(p: PatientSummary, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.trim().toLowerCase();
  const name = (p.patientName ?? "").toLowerCase();
  const id = (p.patientId ?? "").toLowerCase();
  const stage = (p.currentStage ?? "").toLowerCase();
  const status = (p.stageStatus ?? "").toLowerCase();
  const gender = (p.gender ?? "").toLowerCase();
  const ageStr = p.age != null ? String(p.age) : "";
  return (
    name.includes(lower) ||
    id.includes(lower) ||
    stage.includes(lower) ||
    status.includes(lower) ||
    gender.includes(lower) ||
    ageStr.includes(lower)
  );
}

export default function PrescriptionListPage() {
  const {
    patients,
    loading,
    loadingMore,
    error,
    hasNext,
    sentinelRef,
  } = useInfinitePatients();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const clearAll = () => {
    setSearchQuery("");
    setFilters({});
  };

  const filteredPatients = patients.filter((p) =>
    matchesSearch(p, searchQuery),
  );
  const hasActiveSearchOrFilters =
    searchQuery.trim() !== "" || Object.keys(filters).length > 0;

  return (
    <div className='flex min-h-0 flex-col px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
      <header className='mb-6 flex min-h-[44px] items-center justify-between gap-3'>
        <h1 className='min-w-0 truncate font-raleway text-xl font-bold text-slate-700 md:text-2xl'>
          Prescription
        </h1>
        <DashboardUserBar />
      </header>

      <div className='mb-6 flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-2'>
        <button
          type='button'
          onClick={clearAll}
          className='shrink-0 rounded-lg px-3 py-2 font-raleway text-md font-semibold text-slate-700'
          disabled={!hasActiveSearchOrFilters}
        >
          Clear All
        </button>
        <div className='flex w-1/2 min-w-0 max-w-[50%] flex-row items-center gap-2'>
          <div className='flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-1'>
            <SearchIcon className='h-4 w-4 shrink-0 text-slate-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search...'
              className='min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0'
              aria-label='Search patients'
            />
          </div>
        </div>
      </div>

      {error && (
        <p className='mb-4 text-sm text-red-600'>
          {error}. Ensure the backend is running at {API_BASE}.
        </p>
      )}

      <section className='overflow-hidden'>
        {loading ? (
          <div className='px-5 py-12 text-center text-slate-500'>Loading…</div>
        ) : patients.length === 0 ? (
          <div className='px-5 py-12 text-center text-slate-500'>
            No patients for the current month.
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className='px-5 py-12 text-center text-slate-500'>
            No patients match your search.
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                className='relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_80px] lg:items-center lg:gap-4 lg:px-5 lg:py-4'
              >
                {/* Patient — mobile: top block with room for top-right action */}
                <div className='flex min-w-0 items-center gap-3 pr-12 lg:col-span-1 lg:pr-0'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600'>
                    {p.patientName
                      ? p.patientName.charAt(0).toUpperCase()
                      : "P"}
                  </div>

                  <div className='min-w-0 p-1'>
                    <p className='truncate font-raleway text-base font-semibold text-slate-800'>
                      {p.patientName ?? "—"}
                    </p>
                    <p className='text-sm text-slate-500'>
                      {p.age != null ? `${p.age} yrs` : ""}
                      {p.age != null && p.gender ? ", " : ""}
                      {p.gender ?? ""}
                    </p>
                  </div>
                </div>

                {/* ID */}
                <div
                  className='mt-2 text-sm font-sans font-medium lg:mt-0'
                  style={{ color: "#A0A3A9" }}
                >
                  {p.patientId ?? "—"}
                </div>

                {/* Stage */}
                <div className='mt-1 text-sm font-semibold text-slate-700 lg:mt-0'>
                  {formatStageDisplayLabel(p.currentStage)}
                </div>

                {/* Status */}
                <div className='mt-2 lg:mt-0'>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 font-raleway text-xs font-semibold ${
                      p.stageStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : p.stageStatus === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.stageStatus ?? "—"}
                  </span>
                </div>

                {/* Action — mobile/tablet: top-right; desktop: grid column */}
                <div className='absolute right-3 top-3 lg:relative lg:right-auto lg:top-auto lg:flex lg:justify-center'>
                  <Link
                    href={`/dashboard/prescription/${encodeURIComponent(p.patientId)}`}
                    className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:h-auto lg:w-auto lg:p-2'
                    aria-label={`View ${p.patientName}`}
                  >
                    <PatientViewActionIcon className='h-[26px] w-[26px] min-h-[26px] min-w-[26px] shrink-0 sm:h-7 sm:w-7 sm:min-h-[28px] sm:min-w-[28px]' />
                  </Link>
                </div>
              </div>
            ))}
            <div
              ref={sentinelRef}
              className='h-4 w-full shrink-0'
              aria-hidden
            />
            {loadingMore ? (
              <div className='py-6 text-center text-sm text-slate-500'>
                Loading more…
              </div>
            ) : null}
            {!loading && !hasNext && patients.length > 0 ? (
              <p className='py-4 text-center text-xs text-slate-400'>
                End of list for this month
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
