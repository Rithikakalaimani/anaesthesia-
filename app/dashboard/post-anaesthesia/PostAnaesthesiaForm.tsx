"use client";

import { useState, useEffect, useId } from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMicrophone,
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";
import {
  PostOpRecordSymbolAsset,
  PostOpVoiceRecordLabel,
} from "./PostOpTextareaDecor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const cardClass =
  "overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f6f8fb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";
const headerClass =
  "flex items-center gap-2 border-b border-[#e5e7eb] bg-[rgba(246,248,251,0.5)] px-5 py-3";
const headerTitleClass =
  "text-sm font-semibold tracking-[0.24px] text-[#1f2937]";
const inputBase =
  "w-full rounded-md border border-[#e5e7eb] bg-[#f6f8fb] px-3 py-2.5 text-sm text-[#1f2937] placeholder-[#757575] focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50 disabled:cursor-not-allowed disabled:opacity-70";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={headerClass}>
      {icon ? (
        <span className='h-4 w-4 shrink-0 text-[#1f2937]'>{icon}</span>
      ) : null}
      <span className={headerTitleClass}>{title}</span>
    </div>
  );
}

function ImmediateAssessmentIcon(){
  return (
    <svg
      width='13'
      height='13'
      viewBox='0 0 13 13'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.1875 8.02336H3.00067C3.45917 8.02336 3.689 8.02336 3.88208 8.12661C4.07575 8.23044 4.20292 8.42119 4.45725 8.80269L4.55058 8.94269C4.79675 9.31194 4.91983 9.49686 5.08725 9.48694C5.25408 9.47702 5.355 9.27927 5.55567 8.88261L6.7025 6.62102C6.91192 6.20919 7.01633 6.00269 7.18725 5.99627C7.35817 5.98927 7.47892 6.18644 7.72042 6.58019L8.092 7.18686C8.34283 7.59577 8.46767 7.79994 8.66658 7.91194C8.86608 8.02277 9.10525 8.02277 9.58417 8.02277H10.3542'
        stroke='#80A6F0'
        strokeWidth={0.875}
        strokeLinecap='round'
      />
      <path
        d='M0.4375 6.27083C0.4375 3.521 0.4375 2.14608 1.2915 1.2915C2.14667 0.4375 3.521 0.4375 6.27083 0.4375C9.02067 0.4375 10.3956 0.4375 11.2496 1.2915C12.1042 2.14667 12.1042 3.521 12.1042 6.27083C12.1042 9.02067 12.1042 10.3956 11.2496 11.2496C10.3962 12.1042 9.02067 12.1042 6.27083 12.1042C3.521 12.1042 2.14608 12.1042 1.2915 11.2496C0.4375 10.3962 0.4375 9.02067 0.4375 6.27083V6.27083'
        stroke='#80A6F0'
        strokeWidth={0.875}
      />
    </svg>
  );
}

function MonitorPatientIcon() {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        d='M1 6C1 8.75958 3.24042 11 6 11C8.75958 11 11 8.75958 11 6C11 3.24042 8.75958 1 6 1C3.24042 1 1 3.24042 1 6V6'
        stroke='#F2994A'
        strokeWidth={0.75}
      />
      <path
        d='M6 8.5V5.5'
        stroke='#F2994A'
        strokeWidth={0.75}
        strokeLinecap='round'
      />
      <path
        d='M5.5 4C5.5 3.72404 5.72404 3.5 6 3.5C6.27596 3.5 6.5 3.72404 6.5 4C6.5 4.27596 6.27596 4.5 6 4.5C5.72404 4.5 5.5 4.27596 5.5 4Z'
        fill='#F2994A'
      />
    </svg>
  );
}

function PacuAddEntryPlusIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        d='M1.3335 8.0026C1.3335 11.682 4.32073 14.6693 8.00016 14.6693C11.6796 14.6693 14.6668 11.682 14.6668 8.0026C14.6668 4.32317 11.6796 1.33594 8.00016 1.33594C4.32073 1.33594 1.3335 4.32317 1.3335 8.0026V8.0026'
        stroke='#F6F8FB'
        strokeWidth={1}
      />
      <path
        d='M10 8H8M8 8H6M8 8V6M8 8V10'
        stroke='#F6F8FB'
        strokeLinecap='round'
      />
    </svg>
  );
}

function OxygenSupportIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      className='shrink-0'
    >
      <path
        d='M2.25 6H7.125C8.15984 6 9 5.15984 9 4.125C9 3.09016 8.15984 2.25 7.125 2.25C6.09016 2.25 5.25 3.09016 5.25 4.125V4.39275M3 10.5H13.875C15.3238 10.5 16.5 11.6762 16.5 13.125C16.5 14.5738 15.3238 15.75 13.875 15.75C12.4262 15.75 11.25 14.5738 11.25 13.125V12.75'
        stroke='#80A6F0'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
      <path
        d='M1.5 8.25H13.875C15.3238 8.25 16.5 7.07378 16.5 5.625C16.5 4.17622 15.3238 3 13.875 3C12.4262 3 11.25 4.17622 11.25 5.625V6'
        stroke='#80A6F0'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
    </svg>
  );
}

function PostOpInstructionsIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      className='shrink-0'
    >
      <path
        d='M12 3C13.6313 3.009 14.5147 3.08175 15.0907 3.65775C15.75 4.317 15.75 5.3775 15.75 7.4985V11.9985C15.75 14.1202 15.75 15.1808 15.0907 15.84C14.4322 16.4985 13.371 16.4985 11.25 16.4985H6.75C4.629 16.4985 3.56775 16.4985 2.90925 15.84C2.25 15.18 2.25 14.1202 2.25 11.9985V7.4985C2.25 5.3775 2.25 4.317 2.90925 3.65775C3.48525 3.08175 4.36875 3.009 6 3'
        stroke='#2F80ED'
        strokeWidth={1.125}
      />
      <path
        d='M7.875 10.5H12.75M5.25 10.5H5.625M5.25 7.875H5.625M5.25 13.125H5.625M7.875 7.875H12.75M7.875 13.125H12.75'
        stroke='#2F80ED'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
      <path
        d='M6 2.625C6 2.0041 6.5041 1.5 7.125 1.5H10.875C11.4959 1.5 12 2.0041 12 2.625V3.375C12 3.9959 11.4959 4.5 10.875 4.5H7.125C6.5041 4.5 6 3.9959 6 3.375V2.625'
        stroke='#2F80ED'
        strokeWidth={1.125}
      />
    </svg>
  );
}

function PainAssessmentIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      className='shrink-0'
    >
      <path
        d='M6.75 12C7.3875 12.4725 8.16375 12.75 9 12.75C9.83625 12.75 10.6125 12.4725 11.25 12'
        stroke='#9FBAD8'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
      <path
        d='M10.5 7.875C10.5 8.4959 10.8361 9 11.25 9C11.6639 9 12 8.4959 12 7.875C12 7.2541 11.6639 6.75 11.25 6.75C10.8361 6.75 10.5 7.2541 10.5 7.875Z'
        fill='#9FBAD8'
      />
      <path
        d='M6 7.875C6 8.4959 6.33606 9 6.75 9C7.16394 9 7.5 8.4959 7.5 7.875C7.5 7.2541 7.16394 6.75 6.75 6.75C6.33606 6.75 6 7.2541 6 7.875Z'
        fill='#9FBAD8'
      />
      <path
        d='M1.6499 7.49844C2.25264 4.55299 4.55445 2.25117 7.4999 1.64844M1.6499 10.4984C2.25264 13.4439 4.55445 15.7457 7.4999 16.3484M16.3499 7.49844C15.7472 4.55299 13.4454 2.25117 10.4999 1.64844M16.3499 10.4984C15.7472 13.4439 13.4454 15.7457 10.4999 16.3484'
        stroke='#9FBAD8'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
    </svg>
  );
}

export interface MonitoringEntry {
  dateTime: string;
  consciousness: string;
  rr: string;
  pulse: string;
  bp: string;
  spo2: string;
  score: string;
}

export interface PostAnaesthesiaDTO {
  id?: string;
  patientId?: string;
  consciousness?: string;
  pulse?: string;
  bpSystolic?: string;
  bpDiastolic?: string;
  respRate?: string;
  spo2?: string;
  aldrete?: Record<string, number>;
  monitoringEntries?: MonitoringEntry[];
  transferTo?: string;
  cvs?: string;
  rs?: string;
  pa?: string;
  cns?: string;
  drugsGivenInRecovery?: string;
  oxygenSupport?: string[];
  postOpInstructions?: string;
  scoreBeforeTransfer?: string;
  blockResolution?: string;
  painScore?: number;
  ponv?: string;
  anaesthesiologistName?: string;
  signed?: string;
  submitted?: boolean;
}

interface Props {
  patientId?: string;
  initialData?: PostAnaesthesiaDTO | null;
  readOnly?: boolean;
  onSave?: (payload: PostAnaesthesiaDTO, submitted: boolean) => void;
  saving?: boolean;
}

const ALDRETE_ROWS = [
  {
    key: "respiration",
    title: "RESPIRATION",
    descriptions: [
      "Apnea or obstruction",
      "Shallow but adequate exchange",
      "Can breathe deeply & cough",
    ],
  },
  {
    key: "circulation",
    title: "BP",
    descriptions: [
      "SBP + 50% of baseline",
      "SBP ± 20–50% of baseline",
      "SBP ± 20% of baseline",
    ],
  },
  {
    key: "consciousness",
    title: "CONSCIOUSNESS",
    descriptions: [
      "No response to verbal commands",
      "Arousable but drifts back",
      "Awake, alert & oriented",
    ],
  },
  {
    key: "o2",
    title: "SpO₂",
    descriptions: ["Cyanotic", "Pale or Dusky", "Pink"],
  },
  {
    key: "activity",
    title: "ACTIVITY",
    descriptions: [
      "Does not move to pain",
      "Moves limbs to pain",
      "Moves all extremities",
    ],
  },
];

export default function PostAnaesthesiaForm({
  patientId,
  initialData,
  readOnly = false,
  onSave,
  saving = false,
}: Props) {
  const postOpTextareaDecorId = useId().replace(/:/g, "");

  /* ─── patient info  ─── */
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [surgeryId, setSurgeryId] = useState("");

  useEffect(() => {
    if (!patientId) return;
    fetch(`${API_BASE}/api/patients/${patientId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setPatientName(d.patientName || "");
        setAge(d.age != null ? String(d.age) : "");
        setGender(d.gender || "");
        setSurgeryId(d.surgeryId || "");
      })
      .catch(() => {});
  }, [patientId]);

  /* ─── immediate assessment ─── */
  const [consciousness, setConsciousness] = useState("Awake");
  const [pulse, setPulse] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [respRate, setRespRate] = useState("");
  const [spo2, setSpo2] = useState("");

  /* ─── aldrete ─── */
  const [aldrete, setAldrete] = useState<Record<string, number>>({
    activity: 0,
    respiration: 0,
    circulation: 0,
    consciousness: 0,
    o2: 0,
  });
  const totalScore = Object.values(aldrete).reduce((a, b) => a + b, 0);
  const handleScoreSelect = (key: string, val: number) => {
    if (readOnly) return;
    setAldrete((prev) => ({ ...prev, [key]: val }));
  };

  /* ─── PACU monitoring entries ─── */
  const [entries, setEntries] = useState<MonitoringEntry[]>([]);

  const handleAddEntry = () => {
    if (readOnly) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setEntries((prev) => [
      ...prev,
      {
        dateTime: `${dateStr}, ${timeStr}`,
        consciousness,
        rr: respRate,
        pulse,
        bp: `${bpSystolic}/${bpDiastolic}`,
        spo2,
        score: String(totalScore),
      },
    ]);
  };

  /* ─── transfer ─── */
  const [transferTo, setTransferTo] = useState("");

  /* ─── systemic exam ─── */
  const [cvs, setCvs] = useState("");
  const [rs, setRs] = useState("");
  const [pa, setPa] = useState("");
  const [cns, setCns] = useState("");
  const [drugsGivenInRecovery, setDrugsGivenInRecovery] = useState("");

  /* ─── oxygen support ─── */
  const [oxygenSupport, setOxygenSupport] = useState<string[]>([]);
  const toggleOxygen = (item: string) => {
    if (readOnly) return;
    setOxygenSupport((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  /* ─── post-op ─── */
  const [postOpInstructions, setPostOpInstructions] = useState("");

  /* ─── score before transfer ─── */
  const [scoreBeforeTransfer, setScoreBeforeTransfer] = useState("");
  const [blockResolution, setBlockResolution] = useState("");

  /* ─── pain assessment ─── */
  const [painScore, setPainScore] = useState(0);
  const [ponv, setPonv] = useState("");

  /* ─── authorization ─── */
  const [anaesthesiologistName, setAnaesthesiologistName] = useState("");
  const [signed, setSigned] = useState("");

  /* ───initialData ─── */
  useEffect(() => {
    if (!initialData) return;
    setConsciousness(initialData.consciousness || "Awake");
    setPulse(initialData.pulse || "");
    setBpSystolic(initialData.bpSystolic || "");
    setBpDiastolic(initialData.bpDiastolic || "");
    setRespRate(initialData.respRate || "");
    setSpo2(initialData.spo2 || "");
    if (initialData.aldrete) setAldrete(initialData.aldrete);
    if (initialData.monitoringEntries)
      setEntries(initialData.monitoringEntries);
    setTransferTo(initialData.transferTo || "");
    setCvs(initialData.cvs || "");
    setRs(initialData.rs || "");
    setPa(initialData.pa || "");
    setCns(initialData.cns || "");
    setDrugsGivenInRecovery(initialData.drugsGivenInRecovery || "");
    if (initialData.oxygenSupport) setOxygenSupport(initialData.oxygenSupport);
    setPostOpInstructions(initialData.postOpInstructions || "");
    setScoreBeforeTransfer(initialData.scoreBeforeTransfer || "");
    setBlockResolution(initialData.blockResolution || "");
    setPainScore(initialData.painScore ?? 0);
    setPonv(initialData.ponv || "");
    setAnaesthesiologistName(initialData.anaesthesiologistName || "");
    setSigned(initialData.signed || "");
  }, [initialData]);

  /* ─── payload + save ─── */
  const buildPayload = (submittedFlag: boolean): PostAnaesthesiaDTO => ({
    consciousness,
    pulse,
    bpSystolic,
    bpDiastolic,
    respRate,
    spo2,
    aldrete,
    monitoringEntries: entries,
    transferTo,
    cvs,
    rs,
    pa,
    cns,
    drugsGivenInRecovery,
    oxygenSupport,
    postOpInstructions,
    scoreBeforeTransfer,
    blockResolution,
    painScore,
    ponv,
    anaesthesiologistName,
    signed,
    submitted: submittedFlag,
  });

  const handleSave = (submitted: boolean) => {
    if (!patientId || !onSave) return;
    onSave(buildPayload(submitted), submitted);
  };

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "P";

  return (
    <fieldset
      disabled={readOnly}
      className={`font-sans ${
        readOnly
          ? "cursor-not-allowed opacity-95 [&_input]:cursor-not-allowed [&_button]:cursor-not-allowed [&_select]:cursor-not-allowed [&_textarea]:cursor-not-allowed"
          : ""
      }`}
    >
      <div className='min-w-0 max-w-full space-y-8 overflow-x-hidden'>
        {/* ════ Immediate Assessment | Aldrete Score | Total + Transfer ════ */}
        <div className='grid grid-cols-1 gap-6 items-stretch min-[1366px]:grid-cols-12'>
          <div className='flex min-w-0 flex-col gap-5 min-[1366px]:col-span-3'>
            {/* Patient Details */}
            <div className='flex items-start gap-4'>
              <div className='h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center  text-slate-500 font-semibold'>
                {getInitial(patientName)}
              </div>
              <div className='text-sm flex-1'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-semibold font-raleway text-lg text-slate-800'>
                      {patientName || "—"}
                    </p>
                    <p className='text-xs font-medium text-slate-800'>
                      {age && `${age} yrs`} {gender && `, ${gender}`}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='py-1 font-semibold text-slate-800 text-xs'>
                      Surgery
                    </p>
                    <p className='break-all text-xs text-[#222222]'>
                      {surgeryId || patientId || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate Assessment */}
            <section className={`${cardClass} flex-1`}>
              <SectionHeader
                title='Immediate Assessment'
                icon={<ImmediateAssessmentIcon />}
              />
              <div className='p-4 space-y-4 text-sm'>
                {/* Consciousness toggle */}
                <div>
                  <label className='mb-2 block text-xs font-medium uppercase text-[#9CA3AF]'>
                    Consciousness
                  </label>
                  <div className='relative flex rounded-lg border border-slate-200 bg-[#F3F4F6] p-1'>
                    <div
                      className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md bg-[#80A6F0] shadow-sm transition-transform duration-300 ${
                        consciousness === "Awake"
                          ? "translate-x-0"
                          : consciousness === "Drowsy"
                            ? "translate-x-full"
                            : "translate-x-[200%]"
                      }`}
                    />
                    {["Awake", "Drowsy", "Unresp"].map((item) => (
                      <button
                        key={item}
                        type='button'
                        disabled={readOnly}
                        onClick={() => !readOnly && setConsciousness(item)}
                        className={`relative z-10 flex-1 py-2 text-xs font-medium ${
                          consciousness === item
                            ? "text-white"
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vitals */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='flex items-center gap-2 text-xs font-medium text-[#9CA3AF]'>
                      PULSE
                      <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                        BPM
                      </span>
                    </label>
                    <input
                      type='text'
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      disabled={readOnly}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className='flex items-center gap-2 text-xs font-medium text-[#9CA3AF]'>
                      BP
                      <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                        MMHG
                      </span>
                    </label>
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={bpSystolic}
                        onChange={(e) => setBpSystolic(e.target.value)}
                        disabled={readOnly}
                        className={`${inputBase} text-center`}
                      />
                      <span className='text-slate-400'>/</span>
                      <input
                        type='text'
                        value={bpDiastolic}
                        onChange={(e) => setBpDiastolic(e.target.value)}
                        disabled={readOnly}
                        className={`${inputBase} text-center`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className='flex items-center gap-2 text-xs font-medium text-[#9CA3AF]'>
                      RESP
                      <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                        /MIN
                      </span>
                    </label>
                    <input
                      type='text'
                      value={respRate}
                      onChange={(e) => setRespRate(e.target.value)}
                      disabled={readOnly}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className='flex items-center gap-2 text-xs font-medium text-[#9CA3AF]'>
                      SPO₂
                      <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                        %
                      </span>
                    </label>
                    <input
                      type='text'
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      disabled={readOnly}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ──── Aldrete Score ──── */}
          <section
            className={`${cardClass} flex min-w-0 flex-col min-[1366px]:col-span-7`}
          >
            <div className='p-4 border-b border-slate-200'>
              <h3 className='text-sm font-semibold text-slate-800'>
                Aldrete Recovery Score
              </h3>
            </div>

            <div className='flex-1 p-4 text-sm space-y-3'>
              {ALDRETE_ROWS.map((item) => (
                <div key={item.key} className='border-b border-slate-200 pb-2'>
                  <div className='flex min-w-0 flex-col gap-3 min-[1366px]:flex-row min-[1366px]:items-center min-[1366px]:justify-between'>
                    <p className='w-full shrink-0 text-xs font-semibold text-slate-700 min-[1366px]:w-[22%]'>
                      {item.title}
                    </p>

                    <div className='grid w-full min-w-0 grid-cols-3 items-stretch gap-2 min-[1366px]:w-[78%]'>
                      {[0, 1, 2].map((score) => {
                        const selected = aldrete[item.key] === score;

                        return (
                          <label
                            key={score}
                            className={`flex h-full min-h-0 min-w-0 ${
                              readOnly ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                          >
                            <input
                              type='radio'
                              name={`aldrete-${item.key}`}
                              className='hidden'
                              disabled={readOnly}
                              checked={selected}
                              onChange={() =>
                                handleScoreSelect(item.key, score)
                              }
                            />

                            <div
                              className={`flex w-full flex-col items-start gap-1 rounded-md border transition-all duration-200 max-[1365px]:h-full max-[1365px]:justify-start max-[1365px]:p-2.5 min-[1366px]:h-14 min-[1366px]:justify-center min-[1366px]:px-3 min-[1366px]:py-0 ${
                                selected
                                  ? "border-[#80A6F0] bg-[#3B82F61A]"
                                  : "border-[#E5E7EB] hover:bg-slate-50"
                              }`}
                            >
                              {/* Score */}
                              <span
                                className={`shrink-0 text-base font-semibold leading-none ${
                                  selected ? "text-[#80A6F0]" : "text-[#9CA3AF]"
                                }`}
                              >
                                {score}
                              </span>

                              {/* Description */}
                              <p
                                className={`text-[10px] leading-snug max-[1365px]:min-h-0 ${
                                  selected ? "text-[#80A6F0]" : "text-[#9CA3AF]"
                                }`}
                              >
                                {item.descriptions[score]}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total Score + Transfer */}
          <div className='flex min-w-0 flex-col gap-5 min-[1366px]:col-span-2'>
            <section className={`${cardClass} flex-1 overflow-hidden`}>
              {/* Top strip */}
              <div className='h-2 w-full bg-[#F2994A]' />

              <div className='w-full h-full flex flex-col items-center justify-center p-8 space-y-4 text-center'>
                {/* Total Score Label */}
                <p className='text-xs uppercase tracking-wide text-[#9CA3AF] font-medium'>
                  Total Score
                </p>

                {/* Score */}
                <div className='flex items-end gap-1'>
                  <span className='text-5xl font-bold text-slate-800 leading-none'>
                    {totalScore}
                  </span>
                  <span className='text-lg font-medium text-[#9CA3AF] mb-1'>
                    /10
                  </span>
                </div>

                {/* Status */}
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1 text-xs rounded-md font-semibold tracking-wide ${
                    totalScore >= 10
                      ? "bg-green-100 text-green-700"
                      : "bg-[#F2994A1A] text-[#F2994A]"
                  }`}
                >
                  {totalScore < 10 ? <MonitorPatientIcon /> : null}
                  {totalScore >= 10 ? "Ready for Discharge" : "Monitor Patient"}
                </span>

                {/* Description */}
                <p className='text-[10px] text-[#9CA3AF] max-w-[180px] leading-snug'>
                  Patient ready for discharge when score reaches 10
                </p>
              </div>
            </section>

            <section className={`${cardClass} mt-4`}>
              <div className='p-4 space-y-3'>
                <p className='text-xs font-semibold uppercase text-[#3F4145]'>
                  Transfer To
                </p>

                {["Recovery Room", "ICU"].map((place) => {
                  const selected = transferTo === place;

                  return (
                    <label
                      key={place}
                      className={`flex items-center justify-between rounded-md px-3 py-2 cursor-pointer border transition-all ${
                        selected
                          ? "border-[#80A6F0] bg-[#80A6F01A]"
                          : "border-[#E5E7EB] hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          selected ? "text-[#80A6F0]" : "text-[#9CA3AF]"
                        }`}
                      >
                        {place}
                      </span>

                      <input
                        type='radio'
                        name='transfer'
                        disabled={readOnly}
                        checked={selected}
                        onChange={() => setTransferTo(place)}
                        className={`h-4 w-4 rounded-full border-2 transition-all duration-200
    ${selected ? "border-4 border-[#80A6F0] bg-white" : "border-2 border-[#9CA3AF] bg-white "}
    appearance-none cursor-pointer
  `}
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 min-[1366px]:grid-cols-12'>
          {/* Systemic Examination — below PACU when stacked for Total Score → PACU adjacency */}
          <section className='min-w-0 min-[1366px]:col-span-3 max-[1365px]:order-2'>
            <h3 className='text-sm font-semibold text-slate-800 mb-4'>
              Systemic Examination at PACU Transfer
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <div>
                  <label className='block text-xs font-medium text-[#9CA3AF] mb-1'>
                    CVS
                  </label>
                  <input
                    type='text'
                    value={cvs}
                    onChange={(e) => setCvs(e.target.value)}
                    disabled={readOnly}
                    className='w-full rounded-md bg-[#F6F8FB] border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-[#9CA3AF] mb-1'>
                    PA
                  </label>
                  <input
                    type='text'
                    value={pa}
                    onChange={(e) => setPa(e.target.value)}
                    disabled={readOnly}
                    className='w-full rounded-md bg-[#F6F8FB] border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
                  />
                </div>
              </div>
              <div className='space-y-3'>
                <div>
                  <label className='block text-xs font-medium text-[#9CA3AF] mb-1'>
                    RS
                  </label>
                  <input
                    type='text'
                    value={rs}
                    onChange={(e) => setRs(e.target.value)}
                    disabled={readOnly}
                    className='w-full rounded-md bg-[#F6F8FB] border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-[#9CA3AF] mb-1'>
                    CNS
                  </label>
                  <input
                    type='text'
                    value={cns}
                    onChange={(e) => setCns(e.target.value)}
                    disabled={readOnly}
                    className='w-full rounded-md bg-[#F6F8FB] border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
                  />
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <label className='block text-xs font-medium text-[#9CA3AF] uppercase mb-1'>
                Drugs Given in Recovery
              </label>
              <input
                type='text'
                placeholder='e.g. Ondansetron 4mg'
                value={drugsGivenInRecovery}
                onChange={(e) => setDrugsGivenInRecovery(e.target.value)}
                disabled={readOnly}
                className='w-full rounded-md bg-[#F6F8FB] border border-[#E5E7EB] text-[#757575] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
              />
            </div>
          </section>

          {/* PACU Monitoring Log */}
          <section
            className={`${cardClass} min-w-0 min-[1366px]:col-span-9 max-[1365px]:order-1`}
          >
            <div className={`${headerClass} flex justify-between items-center`}>
              <span className={headerTitleClass}>PACU Monitoring Log</span>
              {!readOnly && (
                <button
                  type='button'
                  onClick={handleAddEntry}
                  disabled={readOnly}
                  className='inline-flex items-center gap-1.5 rounded-md bg-[#1F2937] px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900 transition disabled:opacity-60'
                >
                  <PacuAddEntryPlusIcon />
                  Add Entry
                </button>
              )}
            </div>
            <div className='max-h-[280px] min-w-0 overflow-y-auto overflow-x-auto p-5'>
              {entries.length === 0 ? (
                <p className='py-8 text-center text-sm text-[#9CA3AF]'>
                  No entries yet. Fill the Immediate Assessment &amp; Aldrete
                  Score, then click Add Entry.
                </p>
              ) : (
                <table className='w-full min-w-[640px] border-collapse text-sm'>
                  <thead>
                    <tr className='bg-slate-50'>
                      {[
                        "Date & Time",
                        "Consciousness",
                        "Resp Rate",
                        "Pulse",
                        "BP",
                        "SpO₂",
                        "Score",
                      ].map((head) => (
                        <th
                          key={head}
                          className='border-b border-slate-200 px-2 py-2 text-left text-[10px] font-semibold uppercase text-[#9CA3AF] sm:px-3 sm:py-3 sm:text-xs'
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((row, i) => (
                      <tr key={i}>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs font-medium whitespace-nowrap text-[#1F2937] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.dateTime}
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs text-[#9CA3AF] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.consciousness}
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs text-[#9CA3AF] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.rr}
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs text-[#9CA3AF] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.pulse}
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs text-[#9CA3AF] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.bp}
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs text-[#9CA3AF] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.spo2}%
                        </td>
                        <td className='border-b border-slate-200 px-2 py-2 text-xs font-semibold text-[#1F2937] sm:px-4 sm:py-3 sm:text-sm'>
                          {row.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* Oxygen Support | Post-op Orders | Score Before Transfer */}
        <div className='mt-6 grid grid-cols-1 items-start gap-6 min-[1366px]:grid-cols-12'>
          {/* Oxygen Support */}
          <section className='min-w-0 min-[1366px]:col-span-3'>
            <div className='flex items-center gap-2 mb-3'>
              <OxygenSupportIcon />
              <h3 className='text-sm font-semibold uppercase text-slate-800'>
                Oxygen Support
              </h3>
            </div>
            <div className='mt-5 h-px bg-[#D1D5DB] mb-3' />
            <div className='space-y-2 text-sm'>
              {["O₂ Mask", "ETT Spontaneous", "ETT Ventilator"].map((item) => (
                <label key={item} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    disabled={readOnly}
                    checked={oxygenSupport.includes(item)}
                    onChange={() => toggleOxygen(item)}
                    className='h-4 w-4'
                  />
                  <span className='text-slate-700'>{item}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Post-operative Orders */}
          <section className='min-w-0 min-[1366px]:col-span-5'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2 min-w-0'>
                <PostOpInstructionsIcon />
                <h3 className='text-sm font-semibold text-slate-800 uppercase'>
                  Post-operative Orders / Instructions
                </h3>
              </div>
              <button
                type='button'
                disabled={readOnly}
                className='p-1.5 rounded-md hover:bg-slate-100 transition disabled:opacity-60'
              ></button>
            </div>
            <div className='mt-5 h-px bg-[#D1D5DB] mb-3' />
            <div className='relative'>
              <textarea
                rows={6}
                placeholder=''
                value={postOpInstructions}
                onChange={(e) => setPostOpInstructions(e.target.value)}
                disabled={readOnly}
                className='w-full rounded-md bg-[#F6F8FB] border border-[#D1D5DB] pl-3 pr-[154px] pt-2 pb-9 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none disabled:cursor-not-allowed disabled:opacity-70'
              />

              <div
                className='p-2 pointer-events-none absolute bottom-2 right-2.5 flex items-center gap-1 sm:gap-3'
                aria-hidden
              >
                <PostOpRecordSymbolAsset idSuffix={postOpTextareaDecorId} />
                <PostOpVoiceRecordLabel />
              </div>
            </div>
          </section>

          {/* Score Before Transfer */}
          <section className='min-w-0 min-[1366px]:col-span-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-slate-800 uppercase'>
                Patient&apos;s Score Before Transfer
              </h3>
              <input
                type='text'
                value={scoreBeforeTransfer}
                onChange={(e) => setScoreBeforeTransfer(e.target.value)}
                disabled={readOnly}
                className='w-16 rounded-md bg-[#D9D9D9] px-2 py-1 text-sm text-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-70'
              />
            </div>
            <p className='text-xs mb-2 text-[#9CA3AF] uppercase'>
              Resolution of Sensory &amp; Motor Block
              <span className='block text-[10px] text-[#9CA3AF] uppercase'>
                (For Regional Anaesthesia)
              </span>
            </p>
            <div className='flex items-center gap-6 text-sm'>
              {["Yes", "No"].map((item) => {
                const selected = blockResolution === item;

                return (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='blockResolution'
                      disabled={readOnly}
                      checked={selected}
                      onChange={() => setBlockResolution(item)}
                      className='h-4 w-4'
                    />

                    <span
                      className={`${
                        selected ? "text-black" : "text-[#9CA3AF]"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <div className='grid grid-cols-1 gap-6 min-[1366px]:grid-cols-12'>
          {/* Pain Assessment */}
          <section className='flex min-w-0 flex-col min-[1366px]:col-span-3'>
            <div className='flex items-center gap-2'>
              <PainAssessmentIcon />
              <h3 className='text-sm font-semibold text-slate-800 uppercase'>
                Pain Assessment
              </h3>
            </div>
            <hr className='my-3 border-[#D1D5DB]' />
            <div className='flex-1 space-y-5'>
              <div className='rounded-xl border border-[#D1D5DB] p-5 bg-[#F6F8FB] space-y-4'>
                <div className='flex justify-between items-center'>
                  <label className='text-xs font-medium text-[#1F2937]'>
                    VAS Score
                  </label>
                  <span className='text-sm text-[#9FBAD8]'>{painScore}/10</span>
                </div>
                <div>
                  <input
                    type='range'
                    min='0'
                    max='10'
                    value={painScore}
                    onChange={(e) => setPainScore(Number(e.target.value))}
                    disabled={readOnly}
                    className='w-full custom-slider'
                  />
                  <div className='flex justify-between text-[11px] text-[#6B7280] uppercase mt-1'>
                    <span>No Pain</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='block text-xs font-medium text-[#9CA3AF] uppercase'>
                  Post Operative Nausea / Vomiting
                </label>
                <div className='flex items-center gap-6'>
                  {["Yes", "No"].map((val) => (
                    <label
                      key={val}
                      className='flex items-center gap-2 text-sm text-slate-700'
                    >
                      <input
                        type='radio'
                        name='ponv'
                        disabled={readOnly}
                        checked={ponv === val}
                        onChange={() => setPonv(val)}
                        className='h-4 w-4'
                      />
                      {/* {val} */}
                      <span
                        className={`${
                          ponv === val ? "text-black" : "text-[#9CA3AF]"
                        }`}
                      >
                        {val}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Authorization */}
          <section className='flex min-w-0 flex-col min-[1366px]:col-span-9'>
            <AuthorizationSection
              anaesthesiologistName={anaesthesiologistName}
              onAnaesthesiologistNameChange={setAnaesthesiologistName}
              signed={signed}
              onSignedChange={setSigned}
              readOnly={readOnly}
              actions={
                !readOnly && onSave && patientId ? (
                  <>
                    <button
                      type='button'
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className='rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60'
                    >
                      {saving ? "Saving…" : "Save draft"}
                    </button>
                    <button
                      type='button'
                      onClick={() => handleSave(true)}
                      disabled={saving}
                      className='rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60'
                    >
                      {saving ? "Saving…" : "Submit"}
                    </button>
                  </>
                ) : undefined
              }
            />
          </section>
        </div>
      </div>
    </fieldset>
  );
}
