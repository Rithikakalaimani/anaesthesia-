"use client";

import { use } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import RecoveryForm from "@/app/dashboard/recovery/RecoveryForm";

export default function PatientRecoveryPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="recovery"
        patientName="Jennifer"
      />
      <RecoveryForm />
    </div>
  );
}
