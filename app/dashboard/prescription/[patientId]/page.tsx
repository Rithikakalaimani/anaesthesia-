"use client";

import { use, useCallback, useEffect, useState, KeyboardEvent } from "react";
import DashboardUserBar from "@/components/DashboardUserBar";
import PatientViewActionIcon from "@/components/PatientViewActionIcon";
import { fetchAllPatientsCurrentMonth } from "@/lib/infinitePatients";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type DrugEntry = {
  formType?: string;
  drugName?: string;
  strength?: string;
  timeMorning?: boolean;
  timeAfternoon?: boolean;
  timeNight?: boolean;
  frequency?: string;
  mealAfter?: boolean;
  mealBefore?: boolean;
  startDate?: string;
  endDate?: string;
};

type PrescriptionItem = {
  prescriptionName: string;
  prescriptionId: string;
  date: string;
  status: string;
  fileUrl?: string;
  patientName?: string;
  patientId?: string;
  weight?: string;
  gender?: string;
  height?: string;
  bmi?: string;
  age?: string;
  lmp?: string;
  patientDate?: string;
  issuesSymptoms?: string;
  medicalDiagnosis?: string;
  investigation?: string;
  labFindings?: string;
  drugs?: DrugEntry[];
  precautionNotes?: string;
  specialInstructions?: string;
  followUpConsultation?: string;
  emergencyNotes?: string;
  signedBy?: string;
  signatureImageUrl?: string;
};

type PatientSnapshot = {
  patientName: string;
  patientId: string;
  weight: string;
  height: string;
  bmi: string;
  age: string;
  gender: string;
};

const FORM_TYPES = ["Tablet", "Capsule", "Other"];
const FOLLOW_UP_OPTIONS = [
  "7 days",
  "14 days",
  "20 days",
  "30 days",
  "45 days",
  "60 days",
  "90 days",
];

function normalizeStage(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

/** Matches prescription list page — stage column (PRE OP, etc.). */
function formatStageDisplayLabel(stage: string | undefined): string {
  const s = normalizeStage(stage);
  if (s === "pre-anaesthetic") return "PRE OP";
  if (s === "perioperative") return "PERI OP";
  if (s === "recovery") return "RECOVERY";
  if (s === "post-anaesthesia" || s === "post-operative") return "POST OP";
  return stage?.trim() || "—";
}

function prescriptionStatusBadgeClass(status: string | undefined): string {
  const s = (status ?? "").trim();
  if (s === "Send to patient") {
    return "inline-flex rounded-full bg-[#E8FFF0] px-2.5 py-0.5 text-xs font-semibold font-raleway text-[#166534]";
  }
  if (s === "On draft" ) {
    return "inline-flex rounded-full bg-[#FFF7E8] px-2.5 py-0.5 text-xs font-semibold font-raleway text-[#653416]";
  }
  if(s=== "Completed"){
    return "inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-semibold font-raleway text-[#4B5563]";
  }
  return "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold font-raleway text-slate-700";
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className='flex min-h-[44px] items-center rounded-t-xl px-5 py-3'
      style={{ background: "var(--header-bg)" }}
    >
      <span className='font-semibold text-[var(--header-text)]'>{title}</span>
    </div>
  );
}

type PrescriptionFormModalProps = {
  patientId: string;
  item: PrescriptionItem;
  patientSnapshot: PatientSnapshot;
  onClose: () => void;
  onDraftSaved: () => void;
  onSubmitted: () => void;
};

function PrescriptionFormModal({
  patientId,
  item,
  patientSnapshot,
  onClose,
  onDraftSaved,
  onSubmitted,
}: PrescriptionFormModalProps) {
  const readOnly = item.status === "Send to patient";

  const [patientName, setPatientName] = useState(
    item.patientName ?? patientSnapshot.patientName ?? "",
  );
  const [patientIdVal, setPatientIdVal] = useState(
    item.patientId ?? patientSnapshot.patientId ?? "",
  );
  const [weight, setWeight] = useState(
    item.weight ?? patientSnapshot.weight ?? "",
  );
  const [gender, setGender] = useState(
    item.gender ?? patientSnapshot.gender ?? "",
  );
  const [height, setHeight] = useState(
    item.height ?? patientSnapshot.height ?? "",
  );
  const [bmi, setBmi] = useState(item.bmi ?? patientSnapshot.bmi ?? "");
  const [age, setAge] = useState(item.age ?? patientSnapshot.age ?? "");
  const [lmp, setLmp] = useState(item.lmp ?? "");
  const [patientDate, setPatientDate] = useState(
    item.patientDate ?? item.date ?? "",
  );

  const [issuesSymptoms, setIssuesSymptoms] = useState(
    item.issuesSymptoms ?? "",
  );
  const [medicalDiagnosis, setMedicalDiagnosis] = useState(
    item.medicalDiagnosis ?? "",
  );
  const [investigation, setInvestigation] = useState(item.investigation ?? "");
  const [labFindings, setLabFindings] = useState(item.labFindings ?? "");

  const [drugs, setDrugs] = useState<DrugEntry[]>(
    item.drugs && item.drugs.length > 0 ? item.drugs : [{ formType: "Tablet" }],
  );

  const [precautionNotes, setPrecautionNotes] = useState(
    item.precautionNotes ?? "",
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    item.specialInstructions ?? "",
  );
  const [followUpConsultation, setFollowUpConsultation] = useState(
    item.followUpConsultation ?? "20 days",
  );
  const [emergencyNotes, setEmergencyNotes] = useState(
    item.emergencyNotes ?? "",
  );
  const [signedBy, setSignedBy] = useState(item.signedBy ?? "Raj Ronald");

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "draft" | "completed" | "sent" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPatientName(item.patientName ?? patientSnapshot.patientName ?? "");
    setPatientIdVal(item.patientId ?? patientSnapshot.patientId ?? "");
    setWeight(item.weight ?? patientSnapshot.weight ?? "");
    setGender(item.gender ?? patientSnapshot.gender ?? "");
    setHeight(item.height ?? patientSnapshot.height ?? "");
    setBmi(item.bmi ?? patientSnapshot.bmi ?? "");
    setAge(item.age ?? patientSnapshot.age ?? "");
    setLmp(item.lmp ?? "");
    setPatientDate(item.patientDate ?? item.date ?? "");
    setIssuesSymptoms(item.issuesSymptoms ?? "");
    setMedicalDiagnosis(item.medicalDiagnosis ?? "");
    setInvestigation(item.investigation ?? "");
    setLabFindings(item.labFindings ?? "");
    setDrugs(
      item.drugs && item.drugs.length > 0
        ? item.drugs
        : [{ formType: "Tablet" }],
    );
    setPrecautionNotes(item.precautionNotes ?? "");
    setSpecialInstructions(item.specialInstructions ?? "");
    setFollowUpConsultation(item.followUpConsultation ?? "20 days");
    setEmergencyNotes(item.emergencyNotes ?? "");
    setSignedBy(item.signedBy ?? "Raj Ronald");
  }, [
    item.prescriptionId,
    item.patientName,
    item.patientId,
    item.weight,
    item.gender,
    item.height,
    item.bmi,
    item.age,
    item.lmp,
    item.patientDate,
    item.date,
    item.issuesSymptoms,
    item.medicalDiagnosis,
    item.investigation,
    item.labFindings,
    item.drugs,
    item.precautionNotes,
    item.specialInstructions,
    item.followUpConsultation,
    item.emergencyNotes,
    item.signedBy,
    patientSnapshot,
  ]);

  const updateDrug = (index: number, updates: Partial<DrugEntry>) => {
    setDrugs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const addDrug = () => {
    setDrugs((prev) => [...prev, { formType: "Tablet" }]);
  };

  const removeDrug = (index: number) => {
    if (drugs.length <= 1) return;
    setDrugs((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayload = (
    submitAction: "draft" | "complete" | "sendToPatient",
  ) => ({
    prescriptionName: item.prescriptionName,
    date: patientDate || item.date,
    patientName,
    patientId: patientIdVal,
    weight,
    gender,
    height,
    bmi,
    age,
    lmp,
    patientDate: patientDate || item.date,
    issuesSymptoms,
    medicalDiagnosis,
    investigation,
    labFindings,
    drugs,
    precautionNotes,
    specialInstructions,
    followUpConsultation,
    emergencyNotes,
    signedBy,
    submitAction,
  });

  const putPrescription = async (
    submitAction: "draft" | "complete" | "sendToPatient",
  ) => {
    setSaving(true);
    setSaveStatus("idle");
    setErrorMessage(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/patients/${encodeURIComponent(patientId)}/prescriptions/${encodeURIComponent(item.prescriptionId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(submitAction)),
        },
      );
      if (!res.ok) {
        setSaveStatus("error");
        setErrorMessage(
          submitAction === "draft"
            ? "Failed to save draft."
            : submitAction === "complete"
              ? "Failed to submit."
              : "Failed to send to patient.",
        );
        return;
      }
      if (submitAction === "draft") {
        setSaveStatus("draft");
        onDraftSaved();
      } else if (submitAction === "complete") {
        setSaveStatus("completed");
        onDraftSaved();
      } else {
        setSaveStatus("sent");
        onSubmitted();
      }
    } catch {
      setSaveStatus("error");
      setErrorMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => putPrescription("draft");

  const handleSubmitComplete = () => putPrescription("complete");

  const handleSendToPatient = () => putPrescription("sendToPatient");

  const handlePrint = () => {
    document.body.classList.add("prescription-print-isolate");
    const mq = window.matchMedia("print");
    const onPrintMediaChange = () => {
      if (!mq.matches) {
        document.body.classList.remove("prescription-print-isolate");
        mq.removeEventListener("change", onPrintMediaChange);
      }
    };
    mq.addEventListener("change", onPrintMediaChange);
    window.addEventListener(
      "afterprint",
      () => {
        document.body.classList.remove("prescription-print-isolate");
        mq.removeEventListener("change", onPrintMediaChange);
      },
      { once: true },
    );
    window.print();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className='fixed inset-0 z-50 flex min-h-0 items-center justify-center p-2 sm:p-4'>
      <div
        className='absolute inset-0 bg-black/50'
        aria-hidden
        onClick={onClose}
      />
      <div
        id='prescription-print-root'
        className='relative z-10 flex h-full max-h-[100dvh] min-h-0 w-full max-w-full flex-col overflow-hidden bg-white font-sans'
      >
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6 print:border-b'>
          <div className='flex-1' />
          <h2
            id='prescription-form-title'
            className='flex-1 text-center text-lg font-semibold text-slate-800'
          >
            Prescription form
          </h2>
          <div className='flex flex-1 justify-end print:hidden'>
            <button
              type='button'
              onClick={onClose}
              className='rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              aria-label='Close'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6'>
          {saveStatus === "draft" && (
            <p className='mb-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700'>
              Draft saved.
            </p>
          )}
          {saveStatus === "completed" && (
            <p className='mb-4 rounded-lg bg-[#FFF7E8] px-3 py-2 text-sm text-[#653416]'>
              Prescription status: Completed.
            </p>
          )}
          {saveStatus === "sent" && (
            <p className='mb-4 rounded-lg bg-[#E8FFF0] px-3 py-2 text-sm text-[#166534]'>
              Sent to patient.
            </p>
          )}
          {saveStatus === "error" && errorMessage && (
            <p className='mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
              {errorMessage}
            </p>
          )}

          {/* Hospital details */}
          <section className='mb-6 rounded-xl border border-slate-200 bg-green-50 px-4 py-4 sm:px-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex min-w-0 items-center gap-4'>
                <div className='h-12 w-12 rounded-md border border-slate-300 bg-white flex items-center justify-center overflow-hidden'>
                  <img
                    src='/assets/hospital.png'
                    className='h-full w-full object-contain'
                  />
                </div>
                {/* Hospital Name */}
                <div>
                  <h2 className='text-lg font-semibold text-slate-800'>
                    Parvathy Hospital
                  </h2>
                </div>
              </div>

              {/*Doctor Name */}
              <div className='text-left sm:text-right'>
                <h3 className='text-md font-semibold text-slate-800'>
                  Dr. John Doe
                </h3>
                <p className='text-sm text-slate-600'>MBBS, MD</p>
              </div>
            </div>
            {/* Horizontal Line */}
            <div className='mt-3 border-t border-slate-300' />
            {/* Info Row */}
            <div className='mt-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700'>
              <span>Reg no : 123456</span>
              <span>|</span>
              <span>Chennai - 600028</span>
              <span>|</span>
              <span>Phone : +91 9876543210</span>
            </div>
          </section>

          {/* Patient Information */}
          <section className='mb-6 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
            <SectionHeader title='Patient Information' />

            <div className='grid grid-cols-2 gap-x-4 gap-y-4 p-4 text-sm sm:p-6 sm:gap-x-8 lg:grid-flow-col lg:grid-rows-3 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-6'>
              {/* Patient Name */}
              <div className='flex min-w-0 flex-col gap-1 font-raleway sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px] lg:min-w-[130px]'>
                  Patient Name :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{patientName || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Patient ID */}
              <div className='flex min-w-0 flex-col gap-1 font-sans sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px] lg:min-w-[130px]'>
                  Patient ID :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-all'>{patientIdVal || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={patientIdVal}
                    onChange={(e) => setPatientIdVal(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Weight */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px] lg:min-w-[130px]'>
                  Weight :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{weight || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Gender */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px]'>
                  Gender :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{gender || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Height */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px]'>
                  Height :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{height || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* BMI */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[120px]'>
                  BMI :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{bmi || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Age */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[100px]'>
                  Age :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{age || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* LMP */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[100px]'>
                  LMP :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{lmp || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={lmp}
                    onChange={(e) => setLmp(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='—'
                  />
                )}
              </div>

              {/* Date */}
              <div className='flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 sm:col-span-2 lg:col-span-1'>
                <span className='shrink-0 font-medium text-slate-700 sm:min-w-[100px]'>
                  Date :
                </span>
                {readOnly ? (
                  <span className='min-w-0 break-words'>{patientDate || "—"}</span>
                ) : (
                  <input
                    type='text'
                    value={patientDate}
                    onChange={(e) => setPatientDate(e.target.value)}
                    className='min-w-0 flex-1 bg-transparent outline-none border-none focus:ring-0'
                    placeholder='DD-MM-YYYY'
                  />
                )}
              </div>
            </div>
          </section>

          <div className='mb-6 min-w-0 space-y-5'>
            <div className='grid grid-cols-1 items-start gap-2 min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className={labelClass}>Issues / Symptoms</label>
              <textarea
                value={issuesSymptoms}
                onChange={(e) => setIssuesSymptoms(e.target.value)}
                disabled={readOnly}
                rows={2}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>

            <div className='grid grid-cols-1 items-start gap-2 min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className={labelClass}>Medical diagnosis</label>
              <textarea
                value={medicalDiagnosis}
                onChange={(e) => setMedicalDiagnosis(e.target.value)}
                disabled={readOnly}
                rows={2}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>

            <div className='grid grid-cols-1 items-start gap-2 min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className={labelClass}>Investigation</label>
              <textarea
                value={investigation}
                onChange={(e) => setInvestigation(e.target.value)}
                disabled={readOnly}
                rows={2}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>

            <div className='grid grid-cols-1 items-start gap-2 min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className={labelClass}>Lab findings</label>
              <textarea
                value={labFindings}
                onChange={(e) => setLabFindings(e.target.value)}
                disabled={readOnly}
                rows={2}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>
          </div>

          {/* Drug section */}
          <div className='mb-6'>
            <p className='mb-2 text-5xl font-semibold text-slate-800'>℞</p>

            <div className='grid grid-cols-1 gap-2 items-start min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className='text-sm font-medium text-slate-700 pt-2'>
                Drug
              </label>

              <div className='min-w-0'>
                <div className='overflow-x-auto rounded-xl border border-slate-200'>
                  <table className='w-full min-w-[640px] text-sm'>
                    <thead>
                      <tr className='border-b border-slate-200 bg-slate-50/80'>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Form type
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Select drug
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Strength
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Time
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Frequency
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Meal
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-slate-700'>
                          Start – End date
                        </th>
                        {!readOnly && <th className='w-10 px-2' />}
                      </tr>
                    </thead>

                    <tbody>
                      {drugs.map((drug, idx) => (
                        <tr
                          key={idx}
                          className='border-b border-slate-100 last:border-0'
                        >
                          {/* Form Type */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              drug.formType || ""
                            ) : (
                              <select
                                value={drug.formType ?? ""}
                                onChange={(e) =>
                                  updateDrug(idx, { formType: e.target.value })
                                }
                                className='w-full rounded border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100'
                              >
                                {FORM_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>

                          {/* Drug Name */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              drug.drugName || ""
                            ) : (
                              <input
                                type='text'
                                value={drug.drugName ?? ""}
                                onChange={(e) =>
                                  updateDrug(idx, { drugName: e.target.value })
                                }
                                className='min-w-[120px] rounded border border-slate-300 px-2 py-1.5 text-sm'
                              />
                            )}
                          </td>

                          {/* Strength */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              drug.strength || ""
                            ) : (
                              <input
                                type='text'
                                value={drug.strength ?? ""}
                                onChange={(e) =>
                                  updateDrug(idx, { strength: e.target.value })
                                }
                                className='w-20 rounded border border-slate-300 px-2 py-1.5 text-sm'
                              />
                            )}
                          </td>

                          {/* Time */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              [
                                drug.timeMorning && "Morning",
                                drug.timeAfternoon && "Afternoon",
                                drug.timeNight && "Night",
                              ]
                                .filter(Boolean)
                                .join(", ")
                            ) : (
                              <div className='flex flex-col gap-1 text-xs'>
                                <label className='flex items-center gap-1'>
                                  <input
                                    type='checkbox'
                                    checked={!!drug.timeMorning}
                                    onChange={(e) =>
                                      updateDrug(idx, {
                                        timeMorning: e.target.checked,
                                      })
                                    }
                                  />
                                  Morning
                                </label>

                                <label className='flex items-center gap-1'>
                                  <input
                                    type='checkbox'
                                    checked={!!drug.timeAfternoon}
                                    onChange={(e) =>
                                      updateDrug(idx, {
                                        timeAfternoon: e.target.checked,
                                      })
                                    }
                                  />
                                  Afternoon
                                </label>

                                <label className='flex items-center gap-1'>
                                  <input
                                    type='checkbox'
                                    checked={!!drug.timeNight}
                                    onChange={(e) =>
                                      updateDrug(idx, {
                                        timeNight: e.target.checked,
                                      })
                                    }
                                  />
                                  Night
                                </label>
                              </div>
                            )}
                          </td>

                          {/* Frequency */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              drug.frequency || ""
                            ) : (
                              <input
                                type='text'
                                value={drug.frequency ?? ""}
                                onChange={(e) =>
                                  updateDrug(idx, { frequency: e.target.value })
                                }
                                className='w-24 rounded border border-slate-300 px-2 py-1.5 text-sm'
                              />
                            )}
                          </td>

                          {/* Meal */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              drug.mealAfter ? (
                                "After"
                              ) : drug.mealBefore ? (
                                "Before"
                              ) : (
                                ""
                              )
                            ) : (
                              <div className='flex flex-col gap-1 text-xs'>
                                <label className='flex items-center gap-1'>
                                  <input
                                    type='radio'
                                    name={`meal-${idx}`}
                                    checked={!!drug.mealAfter}
                                    onChange={() =>
                                      updateDrug(idx, {
                                        mealAfter: true,
                                        mealBefore: false,
                                      })
                                    }
                                  />
                                  After
                                </label>

                                <label className='flex items-center gap-1'>
                                  <input
                                    type='radio'
                                    name={`meal-${idx}`}
                                    checked={!!drug.mealBefore}
                                    onChange={() =>
                                      updateDrug(idx, {
                                        mealBefore: true,
                                        mealAfter: false,
                                      })
                                    }
                                  />
                                  Before
                                </label>
                              </div>
                            )}
                          </td>

                          {/* Date Picker */}
                          <td className='px-3 py-2'>
                            {readOnly ? (
                              `${drug.startDate ?? ""} – ${drug.endDate ?? ""}`
                            ) : (
                              <div className='flex gap-1 items-center'>
                                <input
                                  type='date'
                                  value={drug.startDate ?? ""}
                                  onChange={(e) =>
                                    updateDrug(idx, {
                                      startDate: e.target.value,
                                    })
                                  }
                                  className='rounded border border-slate-300 px-2 py-1.5 text-sm'
                                />
                                <span className='text-slate-400'>–</span>
                                <input
                                  type='date'
                                  value={drug.endDate ?? ""}
                                  onChange={(e) =>
                                    updateDrug(idx, { endDate: e.target.value })
                                  }
                                  className='rounded border border-slate-300 px-2 py-1.5 text-sm'
                                />
                              </div>
                            )}
                          </td>

                          {/* Remove */}
                          {!readOnly && (
                            <td className='px-2 py-2'>
                              <button
                                type='button'
                                onClick={() => removeDrug(idx)}
                                className='rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600'
                              >
                                ×
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add More Button */}
                {!readOnly && (
                  <button
                    type='button'
                    onClick={addDrug}
                    className='mt-3 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800'
                  >
                    + Add more
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='mb-6 space-y-5'>
            {/* Precaution Notes */}
            <div className='grid grid-cols-1 gap-2 items-start min-w-0 lg:grid-cols-[220px_1fr] lg:gap-4'>
              <label className={labelClass}>Precaution notes</label>
              <textarea
                value={precautionNotes}
                onChange={(e) => setPrecautionNotes(e.target.value)}
                disabled={readOnly}
                rows={3}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>

            {/* Special Instructions */}
            <div className='grid grid-cols-1 items-start gap-2 min-w-0 lg:grid-cols-[220px_1fr] lg:items-center lg:gap-4'>
              <label className={labelClass}>Special instructions</label>
              <input
                type='text'
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                disabled={readOnly}
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100'
                placeholder=''
              />
            </div>
          </div>

          {/* Follow up — mobile: emergency 3/4 + signature 1/4 same row; md+: 2-col with smaller signature */}
          <section className='mb-6 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
            <div className='p-4 sm:p-6'>
              <div className='grid min-w-0 max-md:grid-cols-4 max-md:gap-3 md:grid-cols-[minmax(0,1fr)_180px] md:gap-6'>
                <div className='max-md:col-span-4'>
                  <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4'>
                    <span className='font-semibold text-slate-800'>
                      Follow up
                    </span>

                    <span className='text-sm text-slate-600'>
                      Next followup consultation
                    </span>

                    {readOnly ? (
                      <span className='text-slate-800'>
                        {followUpConsultation || ""}
                      </span>
                    ) : (
                      <select
                        value={followUpConsultation}
                        onChange={(e) =>
                          setFollowUpConsultation(e.target.value)
                        }
                        className='rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800'
                      >
                        {FOLLOW_UP_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Emergency Notes */}
                <div className='max-md:col-span-3 min-w-0 md:col-start-1 md:row-start-2'>
                  <div className='grid grid-cols-1 items-start gap-2 min-w-0 md:grid-cols-[200px_1fr] md:gap-4'>
                    <label className='text-sm font-medium text-slate-700'>
                      Emergency notes :
                    </label>

                    <textarea
                      value={emergencyNotes}
                      onChange={(e) => setEmergencyNotes(e.target.value)}
                      disabled={readOnly}
                      rows={3}
                      className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100'
                      placeholder=''
                    />
                  </div>
                </div>

                <div className='flex max-md:col-span-1 min-w-0 flex-col items-stretch justify-start md:col-start-2 md:row-start-1 md:row-span-2 md:items-end md:justify-self-end md:self-start'>
                  <div className='flex h-[72px] w-full min-w-0 max-md:max-h-[88px] items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white md:h-[88px] md:w-[180px] md:max-w-[180px]'>
                    {/* Replace with actual image <img> later */}
                    <span className='text-[10px] text-slate-400 md:text-xs'>
                      Signature
                    </span>
                  </div>

                  <span className='mt-1 max-md:text-[10px] text-left text-xs leading-tight text-slate-600 md:mt-2 md:text-right'>
                    Digitally signed by {signedBy}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className='flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
            <p className='min-w-0 text-sm font-medium text-slate-700'>
              Prescription ID:{" "}
              <span className='break-all text-slate-900'>{item.prescriptionId}</span>
            </p>

            {/* Below lg: 2-column grid for all actions (mobile + tablet) */}
            <div className='grid min-w-0 grid-cols-2 gap-2 print:hidden lg:hidden'>
              <button
                type='button'
                onClick={handleSaveDraft}
                disabled={saving || readOnly}
                className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 sm:text-sm'
              >
                Save draft
              </button>
              {!readOnly && (
                <button
                  type='button'
                  onClick={handleSubmitComplete}
                  disabled={saving || item.status === "Completed"}
                  className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 sm:text-sm'
                >
                  Submit
                </button>
              )}
              <button
                type='button'
                onClick={() => {}}
                className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 sm:text-sm'
              >
                Generate PDF
              </button>
              <button
                type='button'
                onClick={handlePrint}
                className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 sm:text-sm'
              >
                Print
              </button>
              <button
                type='button'
                onClick={handleSendToPatient}
                disabled={saving || readOnly}
                className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 sm:text-sm'
              >
                Send to patient
              </button>
              <button
                type='button'
                onClick={() => {}}
                className='rounded-lg bg-slate-700 px-3 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-slate-800 sm:text-sm'
              >
                Send to pharmacy
              </button>
            </div>

            {/* Desktop and larger: original single-row control strip */}
            <div className='hidden flex-wrap gap-2 print:hidden lg:flex'>
              <button
                type='button'
                onClick={handleSaveDraft}
                disabled={saving || readOnly}
                className='rounded-lg bg-slate-700  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60'
              >
                Save draft
              </button>
              {!readOnly && (
                <button
                  type='button'
                  onClick={handleSubmitComplete}
                  disabled={saving || item.status === "Completed"}
                  className='rounded-lg bg-slate-700  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800  disabled:opacity-60'
                >
                  Submit
                </button>
              )}
              <button
                type='button'
                onClick={() => {}}
                className='rounded-lg  bg-slate-700  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 '
              >
                Generate PDF
              </button>
              <button
                type='button'
                onClick={handlePrint}
                className='rounded-lg  bg-slate-700 text-white  px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-800 '
              >
                Print
              </button>
              <button
                type='button'
                onClick={() => {}}
                className='rounded-lg  bg-slate-700  text-white  px-4 py-2 text-sm font-medium  shadow-sm hover:bg-slate-800 '
              >
                Send to pharmacy
              </button>
              <button
                type='button'
                onClick={handleSendToPatient}
                disabled={saving || readOnly}
                className='rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60'
              >
                Send to patient
              </button>
            </div>
          </section>

          {readOnly && (
            <p className='mt-4 text-sm text-slate-500'>
              This prescription has been sent to the patient and cannot be changed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientPrescriptionPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [modalItem, setModalItem] = useState<PrescriptionItem | null>(null);

  const loadPatient = useCallback(async () => {
    const res = await fetch(
      `${API_BASE}/api/patients/${encodeURIComponent(patientId)}`,
    );
    if (res.ok) {
      const d = await res.json();
      setPatientName(d.patientName ?? "");
      setAge(d.age ?? null);
      setGender(d.gender ?? "");
      setWeight(d.weight ?? "");
      setHeight(d.height ?? "");
      setBmi(d.bmi ?? "");
    }
  }, [patientId]);

  const loadPrescriptions = useCallback(async () => {
    const res = await fetch(
      `${API_BASE}/api/patients/${encodeURIComponent(patientId)}/prescriptions`,
    );
    if (res.ok) {
      const d = await res.json();
      const list = Array.isArray(d.items) ? d.items : [];
      setItems(list);
      setModalItem((prev) => {
        if (!prev) return null;
        const next = list.find(
          (x: PrescriptionItem) => x.prescriptionId === prev.prescriptionId,
        );
        return next ?? prev;
      });
      try {
        const patients = await fetchAllPatientsCurrentMonth();
        const p = patients.find((x) => x.patientId === patientId);
        if (p) setCurrentStage(p.currentStage ?? "");
      } catch {
        /* stage badge optional if list fails */
      }
    } else {
      setItems([]);
    }
  }, [patientId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPatient(), loadPrescriptions()]).finally(() =>
      setLoading(false),
    );
  }, [loadPatient, loadPrescriptions]);

  const handleAddPrescription = async () => {
    setAdding(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/patients/${encodeURIComponent(patientId)}/prescriptions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prescriptionName: `Prescription ${items.length + 1}`,
            status: "On draft",
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } finally {
      setAdding(false);
    }
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "P";
  const patientSnapshot: PatientSnapshot = {
    patientName,
    patientId,
    weight: weight ?? "",
    height: height ?? "",
    bmi: bmi ?? "",
    age: age != null ? String(age) : "",
    gender,
  };

  if (loading) {
    return (
      <div className='min-h-full p-6 md:p-8 lg:p-10'>
        <p className='text-slate-500'>Loading…</p>
      </div>
    );
  }

  return (
    <div className='min-h-full p-6 md:p-8 lg:p-10'>
      <header className='mb-6 flex flex-col gap-3 sm:min-h-[44px] sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
        <h1 className='min-w-0 font-raleway text-xl font-bold text-slate-700 md:text-2xl'>
          Prescription
        </h1>
        <DashboardUserBar />
      </header>

      <div className='mb-8 flex w-full max-w-96 flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600'>
            {getInitial(patientName)}
          </div>
          <div className='min-w-0 p-1'>
            <p className='truncate font-raleway text-base font-semibold text-slate-800'>
              {patientName || "—"}
            </p>
            <p className='text-sm text-slate-500'>
              {age != null ? `${age} yrs` : ""}
              {age != null && gender ? ", " : ""}
              {gender ?? ""}
            </p>
          </div>
        </div>

        <div className='text-right font-sans'>
          <p className='text-sm font-semibold text-slate-700'>
            {formatStageDisplayLabel(currentStage)}
          </p>
          <p className='text-sm font-medium' style={{ color: "#A0A3A9" }}>
            {patientId || "—"}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={handleAddPrescription}
            disabled={adding}
            className='font-raleway rounded-lg bg-[#2B333E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60'
          >
            {adding ? "Adding…" : "Add prescription"}
          </button>
        </div>

        <section className='bg-white'>
          {/* Header */}
          <div className='overflow-x-auto'>
            <table className='w-full font-sans text-sm border-separate border-spacing-y-3'>
              <thead>
                <tr className='bg-[#9FBAD8] uppercase text-xs'>
                  <th className='px-5 py-3 text-left font-semibold text-[#6B7280] rounded-l-md'>
                    SNO
                  </th>
                  <th className='px-5 py-3 text-left font-semibold text-[#6B7280]'>
                    Prescription name
                  </th>
                  <th className='px-5 py-3 text-left font-semibold text-[#6B7280]'>
                    Prescription ID
                  </th>
                  <th className='px-5 py-3 text-left font-semibold text-[#6B7280]'>
                    Date
                  </th>
                  <th className='px-5 py-3 text-left font-semibold text-[#6B7280]'>
                    Status
                  </th>
                  <th className='px-5 py-3 text-center font-semibold text-[#6B7280] rounded-r-md'>
                    File
                  </th>
                </tr>
              </thead>

              {/* TBODY */}
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-5 py-12 text-center text-slate-500'
                    >
                      No prescriptions yet. Click &quot;Add prescription&quot;
                      to add one.
                    </td>
                  </tr>
                ) : (
                  items.map((row, index) => (
                    <tr
                      key={row.prescriptionId}
                      className='bg-white shadow-sm hover:shadow-md transition rounded-md'
                    >
                      <td className='px-5 py-6 text-[#111827] font-medium rounded-l-md'>
                        {index + 1}
                      </td>
                      <td className='px-5 py-6 text-[#111827] font-medium'>
                        {row.prescriptionName}
                      </td>
                      <td className='px-5 py-6 text-[#111827] font-medium'>
                        {row.prescriptionId}
                      </td>
                      <td className='px-5 py-6 text-[#374151]'>{row.date}</td>
                      <td className='px-5 py-6'>
                        <span
                          className={prescriptionStatusBadgeClass(row.status)}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className='px-5 py-6 text-center rounded-r-md'>
                        <button
                          type='button'
                          onClick={() => setModalItem(row)}
                          className='inline-flex rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                          aria-label={`View prescription ${row.prescriptionName}`}
                        >
                          <PatientViewActionIcon className='h-5 w-auto max-h-5 shrink-0' />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalItem && (
        <PrescriptionFormModal
          patientId={patientId}
          item={modalItem}
          patientSnapshot={patientSnapshot}
          onClose={() => setModalItem(null)}
          onDraftSaved={() => loadPrescriptions()}
          onSubmitted={() => {
            loadPrescriptions();
            setModalItem(null);
          }}
        />
      )}
    </div>
  );
}
