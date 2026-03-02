"use client";

import { use } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import { PreAnestheticFormContent } from "@/app/dashboard/pre-anesthetic/page";

export default function PatientPreAnestheticPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="pre-anesthetic"
        patientName="Jennifer"
      />
      <PreAnestheticFormContent />
    </div>
  );
}
