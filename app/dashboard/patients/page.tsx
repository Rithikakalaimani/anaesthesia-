"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type PatientSummary = {
  id: string;
  patientName: string;
  patientId: string;
};

export default function PatientsListPage() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/patients`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load patients");
        return res.json();
      })
      .then((data: PatientSummary[]) => setPatients(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Error loading patients"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='min-h-full p-6 md:p-8 lg:p-10'>
      <header className='mb-8'>
        <h1 className='text-xl font-bold text-slate-700 md:text-2xl'>
          Patients
        </h1>
      </header>

      {error && (
        <p className='mb-4 text-sm text-red-600'>
          {error}. Ensure the backend is running at {API_BASE}.
        </p>
      )}

      <section className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80'>
                <th className='px-5 py-3 text-left font-semibold text-[var(--header-text)]'>
                  Patient Name
                </th>
                <th className='px-5 py-3 text-left font-semibold text-[var(--header-text)]'>
                  Patient ID
                </th>
                <th className='px-5 py-3 text-right font-semibold text-[var(--header-text)]'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className='px-5 py-12 text-center text-slate-500'>
                    Loading…
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className='px-5 py-12 text-center text-slate-500'
                  >
                    No patients yet. Add one via POST /api/patients or the pre-anaesthetic flow.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className='border-b border-slate-100 last:border-0 hover:bg-slate-50/50'
                  >
                    <td className='px-5 py-3 font-medium text-slate-700'>
                      {p.patientName ?? "-"}
                    </td>
                    <td className='px-5 py-3 text-slate-600'>
                      {p.patientId ?? "-"}
                    </td>
                    <td className='px-5 py-3 text-right'>
                      <Link
                        href={`/dashboard/patients/${p.id}`}
                        className='rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700'
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
