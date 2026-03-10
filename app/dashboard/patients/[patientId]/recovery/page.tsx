"use client";

import { use, useEffect, useState } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import RecoveryForm, { type RecoveryDTO } from "@/app/dashboard/recovery/RecoveryForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/patients/${patientId}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`${API_BASE}/api/patients/${patientId}/recovery`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([patientRes, recoveryRes]) => {
        if (patientRes?.patientName) setPatientName(patientRes.patientName);
        setRecovery(recoveryRes ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-full p-6 md:p-8 lg:p-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="recovery"
        patientName={patientName}
      />
      <RecoveryForm
        key={recovery?.id ?? "new"}
        initialData={recovery}
        readOnly={!!recovery}
        patientId={patientId}
      />
    </div>
  );
}
