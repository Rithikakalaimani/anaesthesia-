"use client";

import { use } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import PostAnaesthesiaForm from "@/app/dashboard/post-anaesthesia/PostAnaesthesiaForm";

export default function PatientPostAnaesthesiaPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <PatientStageHeader
        patientId={patientId}
        currentStage="post-anaesthesia"
        patientName="Jennifer"
      />
      <PostAnaesthesiaForm />
    </div>
  );
}
