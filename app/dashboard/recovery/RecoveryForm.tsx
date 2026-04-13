"use client";

import {
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineTruck,
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";
import { useState, useEffect } from "react";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-white";
const cardClass =
  "overflow-hidden rounded-sm border border-slate-200 shadow-sm";
const inputBase =
  "w-full  border border-slate-200  px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50";

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3"
      style={{ background: "var(--header-bg)" }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0 text-white">{icon}</span> : null}
        <span className="truncate font-semibold text-[var(--header-text)] text-sm text-white">
          {title}
        </span>
      </div>
    </div>
  );
}


function ImmediateAssessmentSectionIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.91699 8.74992H3.73016C4.18866 8.74992 4.41849 8.74992 4.61158 8.85317C4.80524 8.957 4.93241 9.14775 5.18674 9.52925L5.28008 9.66925C5.52624 10.0385 5.64933 10.2234 5.81674 10.2135C5.98358 10.2036 6.08449 10.0058 6.28516 9.60917L7.43199 7.34759C7.64141 6.93575 7.74583 6.72925 7.91674 6.72284C8.08766 6.71584 8.20841 6.913 8.44991 7.30675L8.82149 7.91342C9.07233 8.32234 9.19716 8.5265 9.39608 8.6385C9.59558 8.74934 9.83474 8.74934 10.3137 8.74934H11.0837'
        stroke='#2F80ED'
        strokeWidth={0.875}
        strokeLinecap='round'
      />
      <path
        d='M1.16699 7.00033C1.16699 4.25049 1.16699 2.87558 2.02099 2.02099C2.87616 1.16699 4.25049 1.16699 7.00033 1.16699C9.75016 1.16699 11.1251 1.16699 11.9791 2.02099C12.8337 2.87616 12.8337 4.25049 12.8337 7.00033C12.8337 9.75016 12.8337 11.1251 11.9791 11.9791C11.1257 12.8337 9.75016 12.8337 7.00033 12.8337C4.25049 12.8337 2.87558 12.8337 2.02099 11.9791C1.16699 11.1257 1.16699 9.75016 1.16699 7.00033V7.00033'
        stroke='#2F80ED'
        strokeWidth={0.875}
      />
    </svg>
  );
}

function AdverseEffectsIcon(){
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M3.09864 6.27783C4.80081 3.25908 5.65189 1.75 6.99998 1.75C8.34806 1.75 9.19914 3.25908 10.9013 6.27783L11.1136 6.6535C12.5282 9.16183 13.2358 10.416 12.5965 11.333C11.9571 12.25 10.3751 12.25 7.21231 12.25H6.78764C3.62481 12.25 2.04281 12.25 1.40348 11.333C0.764144 10.416 1.47173 9.16183 2.88631 6.6535L3.09864 6.27783'
        stroke='#F2994A'
        stroke-width='0.875'
      />
      <path
        d='M7 4.66699V7.58366'
        stroke='#F2994A'
        stroke-width='0.875'
        stroke-linecap='round'
      />
      <path
        d='M6.4165 9.33333C6.4165 9.65528 6.67789 9.91667 6.99984 9.91667C7.32179 9.91667 7.58317 9.65528 7.58317 9.33333C7.58317 9.01138 7.32179 8.75 6.99984 8.75C6.67789 8.75 6.4165 9.01138 6.4165 9.33333Z'
        fill='#F2994A'
      />
    </svg>
  );
}
const ADVERSE_EFFECTS = [
  "Hypoxemia",
  "Arrhythmia",
  "Unanticipated difficult airway",
  "Dental Injury",
  "Nil",
];

const POST_OP_TRANSFER_OPTIONS = ["Recovery Room", "ICU"];

export type RecoveryDTO = {
  id?: string;
  patientId?: string;
  consciousness?: string;
  reflexes?: string;
  headLift?: string;
  pulseRate?: string;
  bpSys?: string;
  bpDia?: string;
  respRate?: string;
  spo2?: string;
  adverseEffects?: string[];
  postOperativeTransfer?: string;
  anaesthesiologistName?: string;
  signed?: string;
  submitted?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function RecoveryForm({
  initialData = null,
  readOnly = false,
  patientId,
  onSave,
  saving = false,
}: {
  initialData?: RecoveryDTO | null;
  readOnly?: boolean;
  patientId?: string;
  onSave?: (payload: RecoveryDTO, submitted: boolean) => void;
  saving?: boolean;
} = {}) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [consciousness, setConsciousness] = useState(
    () => initialData?.consciousness ?? "Awake"
  );
  const [reflexes, setReflexes] = useState(
    () => initialData?.reflexes ?? "Good"
  );
  const [headLift, setHeadLift] = useState(
    () => initialData?.headLift ?? "yes"
  );
  const [pulseRate, setPulseRate] = useState(
    () => initialData?.pulseRate ?? ""
  );
  const [bpSys, setBpSys] = useState(() => initialData?.bpSys ?? "");
  const [bpDia, setBpDia] = useState(() => initialData?.bpDia ?? "");
  const [respRate, setRespRate] = useState(() => initialData?.respRate ?? "");
  const [spo2, setSpo2] = useState(() => initialData?.spo2 ?? "");
  const [adverseEffects, setAdverseEffects] = useState<Set<string>>(
    () => new Set(initialData?.adverseEffects ?? [])
  );
  const [postOpTransfer, setPostOpTransfer] = useState(
    () => initialData?.postOperativeTransfer ?? ""
  );
  const [anaesthesiologistName, setAnaesthesiologistName] = useState(
    () => initialData?.anaesthesiologistName ?? ""
  );
  const [signed, setSigned] = useState(() => initialData?.signed ?? "");

  useEffect(() => {
    if (!initialData) return;
    setConsciousness(initialData.consciousness ?? "Awake");
    setReflexes(initialData.reflexes ?? "Good");
    setHeadLift(initialData.headLift ?? "yes");
    setPulseRate(initialData.pulseRate ?? "");
    setBpSys(initialData.bpSys ?? "");
    setBpDia(initialData.bpDia ?? "");
    setRespRate(initialData.respRate ?? "");
    setSpo2(initialData.spo2 ?? "");
    setAdverseEffects(new Set(initialData.adverseEffects ?? []));
    setPostOpTransfer(initialData.postOperativeTransfer ?? "");
    setAnaesthesiologistName(initialData.anaesthesiologistName ?? "");
    setSigned(initialData.signed ?? "");
  }, [initialData]);

  const buildPayload = (submitted: boolean): RecoveryDTO => ({
    consciousness,
    reflexes,
    headLift,
    pulseRate,
    bpSys,
    bpDia,
    respRate,
    spo2,
    adverseEffects: Array.from(adverseEffects),
    postOperativeTransfer: postOpTransfer || undefined,
    anaesthesiologistName: anaesthesiologistName || undefined,
    signed: signed || anaesthesiologistName || "—",
    submitted,
  });

  const toggleAdverse = (item: string) => {
    if (readOnly) return;
    setAdverseEffects((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleSave = (submitted: boolean) => {
    if (!patientId || !onSave) return;
    setSaveError(null);
    onSave(buildPayload(submitted), submitted);
  };

  return (
    <fieldset
      disabled={readOnly}
      className={`font-sans ${readOnly ? "cursor-not-allowed opacity-95 [&_input]:cursor-not-allowed [&_button]:cursor-not-allowed [&_select]:cursor-not-allowed" : ""}`}
    >
      {saveError && <p className='mb-4 text-sm text-red-600'>{saveError}</p>}
      <div className='space-y-8'>
        <div className='grid grid-cols-1 gap-6 min-[1366px]:grid-cols-3 min-[1366px]:gap-8'>
          {/* Immediate assessment */}
          <section className={`${cardClass} bg-[#F6F8FB]`}>
            <div className='px-5 py-3 border-b border-slate-200'>
              <div className='flex items-center gap-2'>
                <ImmediateAssessmentSectionIcon />
                <span className='text-sm font-semibold text-[#334155]'>
                  Immediate Assessment
                </span>
              </div>
            </div>

            <div className='p-6 space-y-6 text-sm'>
              {/* Consciousness */}
              <div>
                <label className='mb-3 block font-medium text-[#9CA3AF]'>
                  CONSCIOUSNESS
                </label>

                <div className='relative flex rounded-lg border border-slate-200 bg-[#F3F4F6] p-1'>
                  {/* Sliding indicator */}
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md bg-[#F6F8FB] shadow-sm transition-transform duration-300 ${
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
                      className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-300 ${
                        consciousness === item
                          ? "text-[#2F80ED]"
                          : "text-[#9CA3AF]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                {/* Reflexes */}
                <div>
                  <label className='mb-2 block font-medium text-[#9CA3AF]'>
                    REFLEXES
                  </label>
                  <select
                    value={reflexes}
                    disabled={readOnly}
                    onChange={(e) => setReflexes(e.target.value)}
                    className={`${inputBase} bg-[#F8FAFC] rounded-lg`}
                  >
                    <option value='Good'>Good</option>
                    <option value='Medium'>Medium</option>
                    <option value='None'>None</option>
                  </select>
                </div>

                {/* Head Lift */}
                <div>
                  <label className='mb-2 block font-medium text-[#9CA3AF]'>
                    Head Lift
                  </label>

                  <div className='flex items-center gap-6 mt-2'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='headLift'
                        value='yes'
                        disabled={readOnly}
                        checked={headLift === "yes"}
                        onChange={() => setHeadLift("yes")}
                        className='accent-[#2F80ED]'
                      />
                      <span className='text-[#334155]'>Yes</span>
                    </label>

                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='headLift'
                        value='no'
                        disabled={readOnly}
                        checked={headLift === "no"}
                        onChange={() => setHeadLift("no")}
                        className='accent-[#2F80ED]'
                      />
                      <span className='text-[#334155]'>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

           {/* Vitals */}
          <section>
            <div className='flex items-center gap-2 px-1 py-2'>
              <span className='text-sm font-semibold text-[#334155]'>
                Vitals
              </span>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-6 text-sm'>
              <div className='space-y-6'>
                {/* Pulse Rate */}
                <div>
                  <label className='flex justify-between text-[#9CA3AF] text-sm'>
                    <span>Pulse Rate</span>
                    <span className='text-[#27AE60] text-xs font-medium'>
                      BPM
                    </span>
                  </label>

                  <input
                    type='text'
                    placeholder=''
                    disabled={readOnly}
                    value={pulseRate}
                    onChange={(e) => setPulseRate(e.target.value)}
                    className='mt-2 w-full rounded-md bg-[#F6F8FB] border border-slate-200 px-3 py-2 text-black focus:outline-none'
                  />
                </div>

                {/* Resp Rate */}
                <div>
                  <label className='flex justify-between text-[#9CA3AF] text-sm'>
                    <span>Resp Rate</span>
                    <span className='text-[#27AE60] text-xs font-medium'>
                      MIN
                    </span>
                  </label>

                  <input
                    type='text'
                    placeholder=''
                    disabled={readOnly}
                    value={respRate}
                    onChange={(e) => setRespRate(e.target.value)}
                    className='mt-2 w-full rounded-md bg-[#F6F8FB] border border-slate-200 px-3 py-2 text-black focus:outline-none'
                  />
                </div>
              </div>

              <div className='space-y-6'>
                {/* BP */}
                <div>
                  <label className='flex justify-between text-[#9CA3AF] text-sm'>
                    <span>BP</span>
                    <span className='text-[#27AE60] text-xs font-medium'>
                      MMHG
                    </span>
                  </label>

                  <div className='mt-2 flex items-center gap-2'>
                    <input
                      type='text'
                      placeholder=''
                      disabled={readOnly}
                      value={bpSys}
                      onChange={(e) => setBpSys(e.target.value)}
                      className='min-w-0 flex-1 rounded-md bg-[#F6F8FB] border border-slate-200 px-3 py-2 text-center text-black focus:outline-none'
                    />
                    <span className='shrink-0 text-slate-400 text-sm'>/</span>
                    <input
                      type='text'
                      placeholder=''
                      disabled={readOnly}
                      value={bpDia}
                      onChange={(e) => setBpDia(e.target.value)}
                      className='min-w-0 flex-1 rounded-md bg-[#F6F8FB] border border-slate-200 px-3 py-2 text-center text-black focus:outline-none'
                    />
                  </div>
                </div>

                {/* SpO2 */}
                <div>
                  <label className='flex justify-between text-[#9CA3AF] text-sm'>
                    <span>SpO₂</span>
                    <span className='text-[#27AE60] text-xs font-medium'>
                      %
                    </span>
                  </label>

                  <input
                    type='text'
                    placeholder=''
                    disabled={readOnly}
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className='mt-2 w-full rounded-md bg-[#F6F8FB] border border-slate-200 px-3 py-2 text-black focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </section>

            {/* Adverse Effects */}
          <section className='mx-5'>
            <div className='flex items-center gap-2 px-1 py-2'>
              <AdverseEffectsIcon />
              <span className='text-sm font-semibold text-[#334155]'>
                Adverse Effects
              </span>
            </div>

            <div className='mt-4'>
              <div className='grid grid-cols-1 gap-3'>
                {ADVERSE_EFFECTS.map((item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      disabled={readOnly}
                      checked={adverseEffects.has(item)}
                      onChange={() => toggleAdverse(item)}
                      className='h-4 w-4 cursor-pointer'
                    />

                    <span className='text-sm text-[#9CA3AF]'>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section>
          <div className='flex items-center gap-2 px-1 py-2'>
            <span className='text-sm font-medium text-[#334155]'>
              POST OPERATIVE TRANSFER
            </span>
          </div>

          <div className='mt-4'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {POST_OP_TRANSFER_OPTIONS.map((item) => {
                const isSelected = postOpTransfer === item;

                return (
                  <label
                    key={item}
                    className={`relative flex items-center justify-between cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 w-full ${
                      isSelected
                        ? "border-[#80A6F0] bg-[#80A6F0]/10"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-[#80A6F0]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {item}
                    </span>

                    <input
                      type='radio'
                      name='postOpTransfer'
                      value={item}
                      disabled={readOnly}
                      checked={isSelected}
                      onChange={() => setPostOpTransfer(item)}
                      className={`h-4 w-4 rounded-full border-2 transition-all duration-200
    ${isSelected ? "border-4 border-[#80A6F0] bg-white" : "border-[1px] border-slate-300 bg-white "}
    appearance-none cursor-pointer
  `}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </section>

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
      </div>
    </fieldset>
  );
}
