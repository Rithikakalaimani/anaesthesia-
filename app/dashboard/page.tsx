"use client";

import Link from "next/link";

export default function DashboardHomePage() {
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-slate-700 md:text-2xl">
          Home
        </h1>
        <p className="mt-1 text-sm text-[var(--accent-muted)]">
          Welcome to XO Labs Anaesthesia dashboard.
        </p>
      </header>

      {/* <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[var(--header-text)] mb-2">
            Quick links
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Use the sidebar to navigate, or go directly to:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/patients"
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Patients
            </Link>
            <Link
              href="/dashboard/calendar"
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Calendar
            </Link>
            <Link
              href="/dashboard/prescription"
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Prescription
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
}
