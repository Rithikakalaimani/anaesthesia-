"use client";

import { use, useCallback, useEffect, useState } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import RecoveryForm, { type RecoveryDTO } from "@/app/dashboard/recovery/RecoveryForm";
import { scrollDashboardMainToTop } from "@/lib/scrollDashboard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function loadData(patientId: string) {
  return Promise.all([
    fetch(`${API_BASE}/api/patients/${patientId}`).then((r) =>
      r.ok ? r.json() : null
    ),
    fetch(`${API_BASE}/api/patients/${patientId}/recovery`).then((r) =>
      r.ok ? r.json() : null
    ),
  ]);
}

export default function PatientRecoveryPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [patientName, setPatientName] = useState<string>("Patient");
  const [recovery, setRecovery] = useState<RecoveryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "draft" | "error">("idle");

  const refetch = useCallback(() => {
    setLoading(true);
    loadData(patientId)
      .then(([patientRes, recoveryRes]) => {
        if (patientRes?.patientName) setPatientName(patientRes.patientName);
        setRecovery(recoveryRes ?? null);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSave = async (payload: RecoveryDTO, submitted: boolean) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`${API_BASE}/api/patients/${patientId}/recovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Save failed");
      }
      const data = await res.json();
      setSaveStatus(submitted ? "saved" : "draft");
      setRecovery(data);
      setTimeout(() => scrollDashboardMainToTop(), 0);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (e) {
      setSaveStatus("error");
      setError(e instanceof Error ? e.message : "Save failed");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }
  if (error && !recovery) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const readOnly = !!(recovery && recovery.submitted);

  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="recovery"
        patientName={patientName}
      />
      {saveStatus === "saved" && (
        <p className="mb-4 text-sm font-medium text-green-600">
          Record submitted. Form is now read-only.
        </p>
      )}
      {saveStatus === "draft" && (
        <p className="mb-4 text-sm font-medium text-slate-600">Draft saved.</p>
      )}
      {saveStatus === "error" && (
        <p className="mb-4 text-sm font-medium text-red-600">{error}</p>
      )}
      <RecoveryForm
        key={`${recovery?.id ?? "new"}-${readOnly}`}
        initialData={recovery}
        readOnly={readOnly}
        patientId={patientId}
        onSave={handleSave}
        saving={saveStatus === "saving"}
      />
    </div>
  );
}
