"use client";

import Link from "next/link";

// Placeholder: replace with real data when available
const patients: { id: string; name: string; patientId?: string }[] = [
  { id: "1", name: "Jennifer", patientId: "OPD-102398" },
];

export default function PatientsListPage() {
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-slate-700 md:text-2xl">
          Patients
        </h1>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-5 py-3 text-left font-semibold text-[var(--header-text)]">
                  Patient Name
                </th>
                <th className="px-5 py-3 text-left font-semibold text-[var(--header-text)]">
                  Patient ID
                </th>
                <th className="px-5 py-3 text-right font-semibold text-[var(--header-text)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-slate-500">
                    No patients yet. Data will appear here once available.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-3 font-medium text-slate-700">
                      {p.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.patientId ?? "-"}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/dashboard/patients/${p.id}`}
                        className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
