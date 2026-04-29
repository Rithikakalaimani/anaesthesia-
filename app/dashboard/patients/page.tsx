"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DashboardUserBar from "@/components/DashboardUserBar";
import PatientViewActionIcon from "@/components/PatientViewActionIcon";
import {
  useInfinitePatients,
  type PatientSummary,
} from "@/lib/infinitePatients";

const SEARCH_DEBOUNCE_MS = 150;

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

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        d='M13.79 2.61564C14.3029 1.9591 13.8351 1 13.002 1H3.00186C2.16871 1 1.70091 1.9591 2.21383 2.61564L7.03983 8.72867C7.1772 8.90449 7.25181 9.1212 7.25181 9.34432V14.7961C7.25181 14.9743 7.46724 15.0635 7.59323 14.9375L8.60536 13.9254C8.69913 13.8316 8.75181 13.7044 8.75181 13.5718V9.34432C8.75181 9.1212 8.82643 8.90449 8.96379 8.72867L13.79 2.61564Z'
        fill='#464F60'
      />
    </svg>
  );
}

type StageFilterId =
  | "pre-pending"
  | "pre-completed"
  | "peri-pending"
  | "recovery-pending"
  | "post-pending"
  | "post-completed";

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

function patientStageFilterId(p: PatientSummary): StageFilterId | null {
  const stage = normalizeStage(p.currentStage);
  const status = normalizeStage(p.stageStatus);

  if (stage === "pre-anaesthetic") {
    if (status === "pending") return "pre-pending";
    if (status === "completed") return "pre-completed";
    return null;
  }
  if (stage === "perioperative" && status === "pending") return "peri-pending";
  if (stage === "recovery" && status === "pending") return "recovery-pending";
  if (stage === "post-anaesthesia") {
    if (status === "pending") return "post-pending";
    if (status === "completed") return "post-completed";
    return null;
  }
  return null;
}

function matchesStageFilters(
  p: PatientSummary,
  selected: ReadonlySet<StageFilterId>,
): boolean {
  if (selected.size === 0) return true;
  const id = patientStageFilterId(p);
  return id != null && selected.has(id);
}

const STAGE_FILTER_GROUPS: {
  title: string;
  options: { id: StageFilterId; label: string }[];
}[] = [
  {
    title: "PRE-ANAESTHETIC",
    options: [
      { id: "pre-pending", label: "PENDING" },
      { id: "pre-completed", label: "COMPLETED" },
    ],
  },
  {
    title: "PERIOPERATIVE",
    options: [{ id: "peri-pending", label: "PENDING" }],
  },
  {
    title: "RECOVERY",
    options: [{ id: "recovery-pending", label: "PENDING" }],
  },
  {
    title: "POST-OPERATIVE",
    options: [
      { id: "post-pending", label: "PENDING" },
      { id: "post-completed", label: "COMPLETED" },
    ],
  },
];

export default function PatientsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [listScrollEl, setListScrollEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const {
    patients,
    loading,
    loadingMore,
    error,
    hasNext,
    sentinelRef,
  } = useInfinitePatients({
    search: debouncedSearch,
    scrollRoot: listScrollEl,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [stageFilters, setStageFilters] = useState<Set<StageFilterId>>(
    () => new Set(),
  );
  const filterWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = filterWrapRef.current;
      if (el && !el.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const toggleStageFilter = (id: StageFilterId) => {
    setStageFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setSearchQuery("");
    setStageFilters(new Set());
    setFilterOpen(false);
  };

  const filteredPatients = patients.filter((p) =>
    matchesStageFilters(p, stageFilters),
  );

  const hasActiveSearchOrFilters =
    searchQuery.trim() !== "" || stageFilters.size > 0;

  return (
    <div className='flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
      <header className='mb-6 flex min-h-[44px] items-center justify-between gap-3'>
        <h1 className='min-w-0 truncate font-raleway text-xl font-bold text-slate-700 md:text-2xl'>
          Patients List
        </h1>
        <DashboardUserBar />
      </header>

      {/* Search & filter: Clear All + (search + filter) at half page width — desktop unchanged intent */}
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
          <div className='relative shrink-0' ref={filterWrapRef}>
            <button
              type='button'
              onClick={() => setFilterOpen((o) => !o)}
              className={`relative rounded-lg border bg-white p-2 transition hover:bg-slate-50 hover:text-slate-700 ${
                stageFilters.size > 0
                  ? "border-slate-400 text-slate-800 ring-1 ring-slate-300"
                  : "border-slate-200 text-slate-500"
              }`}
              aria-expanded={filterOpen}
              aria-haspopup='dialog'
              aria-label='Filter by stage and status'
              title='Filter by stage'
            >
              <FilterIcon className='h-4 w-4' />
              {stageFilters.size > 0 ? (
                <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-700 px-1 text-[10px] font-semibold text-white'>
                  {stageFilters.size}
                </span>
              ) : null}
            </button>
            {filterOpen ? (
              <div
                role='dialog'
                aria-label='Stage and status filters'
                className='absolute right-0 z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg'
              >
                <p className='mb-3 text-xs font-medium uppercase tracking-wide text-slate-500'>
                  Show patients in any of:
                </p>
                <div className='max-h-[min(70vh,22rem)] space-y-4 overflow-y-auto pr-1'>
                  {STAGE_FILTER_GROUPS.map((group) => (
                    <div key={group.title}>
                      <p className='mb-2 text-sm font-semibold text-slate-800'>
                        {group.title}
                      </p>
                      <ul className='space-y-2'>
                        {group.options.map((opt) => (
                          <li key={opt.id}>
                            <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
                              <input
                                type='checkbox'
                                checked={stageFilters.has(opt.id)}
                                onChange={() => toggleStageFilter(opt.id)}
                                className='h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-400'
                              />
                              {opt.label}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error && (
        <p className='mb-4 shrink-0 text-sm text-red-600'>
          {error}. Ensure the backend is running at {API_BASE}.
        </p>
      )}

      <section className='flex min-h-0 min-w-0 flex-1 flex-col'>
        <div
          ref={setListScrollEl}
          className='min-h-0 flex-1 overflow-y-auto overscroll-y-contain'
        >
          {loading ? (
            <div className='px-5 py-12 text-center text-slate-500'>Loading…</div>
          ) : patients.length === 0 ? (
            <div className='px-5 py-12 text-center text-slate-500'>
              No patients for the current month.
            </div>
          ) : (
            <>
              {filteredPatients.length === 0 ? (
                <div className='px-5 py-12 text-center text-slate-500'>
                  No patients match your search or stage filters.
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
                          href={`/dashboard/patients/${encodeURIComponent(p.patientId)}`}
                          className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:h-auto lg:w-auto lg:p-2'
                          aria-label={`View ${p.patientName}`}
                        >
                          <PatientViewActionIcon className='h-[26px] w-[26px] min-h-[26px] min-w-[26px] shrink-0 sm:h-7 sm:w-7 sm:min-h-[28px] sm:min-w-[28px]' />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && hasNext ? (
                <div
                  ref={sentinelRef}
                  className='h-4 w-full shrink-0'
                  aria-hidden
                />
              ) : null}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
