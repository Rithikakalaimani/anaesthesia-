"use client";

import { use, useCallback, useEffect, useState } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import {
  PreAnestheticFormContent,
  type PatientDTO,
} from "@/app/dashboard/pre-anesthetic/page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function loadData(patientId: string) {
  return Promise.all([
    fetch(`${API_BASE}/api/patients/${patientId}`).then((res) => {
      if (!res.ok) throw new Error("Patient not found");
      return res.json();
    }),
    fetch(`${API_BASE}/api/patients/${patientId}/preanaesthetic`).then((res) =>
      res.ok ? res.json() : null,
    ),
  ]);
}

export default function PatientPreAnestheticPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [merged, setMerged] = useState<PatientDTO | null>(null);
  const [preanaesthetic, setPreanaesthetic] = useState<PatientDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "draft" | "error"
  >("idle");

  const refetch = useCallback(() => {
    setLoading(true);
    loadData(patientId)
      .then(([patient, pre]) => {
        const age = patient.age;
        // Patient first, then pre-anaesthetic overwrites so clinical fields (e.g. scheduledTime) are not lost.
        const mergedData: PatientDTO = {
          ...patient,
          ...(pre || {}),
          age: age != null ? String(age) : undefined,
        };
        setMerged(mergedData);
        setPreanaesthetic(pre ?? null);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSave = async (
    payload: Record<string, unknown>,
    submitted: boolean,
  ) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/preanaesthetic`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Save failed");
      }
      setSaveStatus(submitted ? "saved" : "draft");
      refetch();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (e) {
      setSaveStatus("error");
      setError(e instanceof Error ? e.message : "Save failed");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) {
    return (
      <div className='min-h-0 px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
        <p className='text-slate-500'>Loading patient…</p>
      </div>
    );
  }
  if (error && !merged) {
    return (
      <div className='min-h-0 px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }
  if (!merged) {
    return null;
  }

  const readOnly = !!(preanaesthetic && preanaesthetic.submitted);

  return (
    <div className='flex min-h-0 flex-col px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
      <PatientStageHeader
        patientId={patientId}
        currentStage='pre-anesthetic'
        patientName={merged.patientName ?? "Patient"}
      />
      {saveStatus === "saved" && (
        <p className='mb-4 text-sm font-medium text-green-600'>
          Record submitted. Form is now read-only.
        </p>
      )}
      {saveStatus === "draft" && (
        <p className='mb-4 text-sm font-medium text-slate-600'>Draft saved.</p>
      )}
      {saveStatus === "error" && (
        <p className='mb-4 text-sm font-medium text-red-600'>{error}</p>
      )}
      <PreAnestheticFormContent
        key={`${merged.id}-${readOnly}`}
        initialData={merged}
        readOnly={readOnly}
        patientId={patientId}
        onSave={handleSave}
      />
    </div>
  );
}
