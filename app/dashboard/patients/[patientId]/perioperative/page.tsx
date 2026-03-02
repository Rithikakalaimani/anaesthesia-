"use client";

import { use } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import PerioperativeForm from "@/app/dashboard/perioperative/PerioperativeForm";

export default function PatientPerioperativePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="perioperative"
        patientName="Jennifer"
      />
      <PerioperativeForm defaultAnaesthesiaType="General" />
    </div>
  );
}
