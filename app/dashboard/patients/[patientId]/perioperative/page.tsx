"use client";

import { use, useEffect, useState } from "react";
import PatientStageHeader from "../../PatientStageHeader";
import PerioperativeForm from "@/app/dashboard/perioperative/PerioperativeForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PatientPerioperativePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [patientName, setPatientName] = useState<string>("Patient");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/patients/${patientId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch patient");
      })
      .then((data) => {
        if (data?.patientName) setPatientName(data.patientName);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patient:", error);
        setLoading(false);
      });
  }, [patientId]);

  return (
    <div className='min-h-full min-w-0 max-w-full overflow-x-hidden p-6 md:p-8 lg:p-10'>
      <PatientStageHeader
        patientId={patientId}
        currentStage='perioperative'
        patientName={patientName}
      />
      <PerioperativeForm
        defaultAnaesthesiaType='General'
        patientId={patientId}
      />
    </div>
  );
}
