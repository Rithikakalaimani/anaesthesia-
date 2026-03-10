"use client";

import { use, useEffect, useState } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import {
  PreAnestheticFormContent,
  type PatientDTO,
} from "@/app/dashboard/pre-anesthetic/page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PatientPreAnestheticPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [merged, setMerged] = useState<PatientDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/patients/${patientId}`).then((res) => {
        if (!res.ok) throw new Error("Patient not found");
        return res.json();
      }),
      fetch(`${API_BASE}/api/patients/${patientId}/preanaesthetic`).then((res) =>
        res.ok ? res.json() : null
      ),
    ])
      .then(([patient, preanaesthetic]) => {
        const age = patient.age;
        const mergedData: PatientDTO = {
          ...(preanaesthetic || {}),
          ...patient,
          age: age != null ? String(age) : undefined,
        };
        setMerged(mergedData);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-slate-500">Loading patient…</p>
      </div>
    );
  }
  if (error || !merged) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-red-600">{error ?? "Patient not found."}</p>
      </div>
    );
  }

  return (
    <div className='min-h-full p-6 md:p-8 lg:p-10'>
      <PatientStageHeader
        patientId={patientId}
        currentStage='pre-anesthetic'
        patientName={merged.patientName ?? "Patient"}
      />
      <PreAnestheticFormContent key={merged.id} initialData={merged} />
    </div>
  );
}
