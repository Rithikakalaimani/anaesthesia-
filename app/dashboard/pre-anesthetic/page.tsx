"use client";

import { useRef, useState } from "react";
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineBeaker,
  HiOutlineCpuChip,
  HiOutlineEye,
  HiOutlineMagnifyingGlass,
  HiOutlineGlobeAlt,
  HiOutlineFlag,
  HiOutlineDocumentDuplicate,
  HiOutlineShieldCheck,
  HiOutlinePhoto,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
  HiOutlineCalendarDays,
  HiOutlineFolder,
  HiOutlineTrash,
  HiOutlineViewColumns,
  HiOutlineSpeakerWave,
  HiOutlineMicrophone,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { MdOutlineScience, MdOutlineBloodtype } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ANAESTHESIA_PLAN_OPTIONS } from "@/lib/anaesthesia";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";

const MEDICAL_CONDITIONS = [
  "Hypertension",
  "Bronchial Asthma",
  "Ischemic Heart Disease",
  "Liver Disease",
  "Diabetes Mellitus",
  "Thyroid Disorder",
  "Chronic Kidney Disease",
  "Tuberculosis",
];

function SectionHeader({
  title,
  icon,
  rightAction,
}: {
  title: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div
      className='flex min-h-[52px] items-center justify-between rounded-t-xl px-5 py-3'
      style={{ background: "var(--header-bg)" }}
    >
      <div className='flex min-w-0 items-center gap-2'>
        {icon ? <span className='shrink-0'>{icon}</span> : null}
        <span className='truncate font-semibold text-[var(--header-text)]'>{title}</span>
      </div>
      {rightAction ? <span className='shrink-0'>{rightAction}</span> : null}
    </div>
  );
}

function PreAnestheticFormContent() {
  const [anaesthesiaPlan, setAnaesthesiaPlan] = useState<string>("General");
  const [medicalSearch, setMedicalSearch] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(
    new Set(["Hypertension", "Thyroid Disorder"]),
  );
  const [othersText, setOthersText] = useState("");
  const [admissionType, setAdmissionType] = useState("Elective");
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState("");
  const [proposedSurgery, setProposedSurgery] = useState("");
  const [scheduledDate, setScheduledDate] = useState("2023-11-25");
  const [preanaestheticConcern, setPreanaestheticConcern] = useState("");
  const scheduledDateInputRef = useRef<HTMLInputElement>(null);
  const surgeryListScrollRef = useRef<HTMLDivElement>(null);
  const [isPreviousSurgeryOpen, setIsPreviousSurgeryOpen] = useState(true);


  type Surgery = {
    type: string;
    year: string;
    complications: string;
  };
  const [surgeries, setSurgeries] = useState<Surgery[]>([
     { type: "", year: "", complications: "" },
   ]);

   const addSurgery = () => {
     setSurgeries((prev) => [
       ...prev,
       { type: "", year: "", complications: "" },
     ]);
     setTimeout(() => {
       surgeryListScrollRef.current?.scrollTo({
         top: surgeryListScrollRef.current.scrollHeight,
         behavior: "smooth",
       });
     }, 50);
   };

   const removeSurgery = (index: number) => {
     if (surgeries.length <= 1) return;
     setSurgeries((prev) => prev.filter((_, i) => i !== index));
   };

   const updateSurgery = (
     index: number,
     field: keyof Surgery,
     value: string,
   ) => {
     setSurgeries((prev) => {
       const updated = [...prev];
       updated[index][field] = value;
       return updated;
     });
   };

  const [generalExam, setGeneralExam] = useState({
    icterus: false,
    pallor: false,
    cyanosis: false,
    clubbing: false,
  });

  const [serology, setSerology] = useState({
    hbsag: false,
    hiv: false,
  });
  const [mallampatiGrade, setMallampatiGrade] = useState<string | null>(null);
  const [asaStatus, setAsaStatus] = useState<string | null>(null);

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) => {
      const next = new Set(prev);
      if (next.has(condition)) next.delete(condition);
      else next.add(condition);
      return next;
    });
  };

  const filteredConditions = MEDICAL_CONDITIONS.filter((c) =>
    c.toLowerCase().includes(medicalSearch.toLowerCase()),
  );

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50";
  const inputCompact =
    "w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50";

  const cardClass =
    "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";

  return (
    <>
      {/* Patient Information */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader
          title='Patient Information'
          icon={<HiOutlineUser className={SECTION_ICON_CLASS} />}
        />
        <div className='grid grid-cols-3 gap-x-12 gap-y-4 p-6 text-sm'>
          <InfoRow label='Patient Name' value='Patient Name' />
          <InfoRow label='Gender' value='Male' />
          <InfoRow label='Age' value='42' />
          <InfoRow label='Patient ID' value='OPD-102398' />
          <InfoRow label='Height' value='158 cm' />
          <InfoRow label='IP NO' value='Nil' />
          <InfoRow label='Weight' value='78 kg' />
          <InfoRow label='BMI' value='22.7' />
          <InfoRow label='Date' value='22-10-25' />
        </div>
      </section>

      {/* Admission Information */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader
          title='Admission Information'
          icon={<HiOutlineCalendar className={SECTION_ICON_CLASS} />}
        />

        <div className='grid grid-cols-2 gap-x-12 gap-y-4 p-6 text-sm'>
          {/* Column 1 */}
          <div className='space-y-4'>
            <InfoRow label='Admission Date' value='23 Nov 2023, 08:30 AM' />
            <InfoRow label='Ward' value='Surgical Ward A2' />
          </div>

          {/* Column 2 */}
          <div className='space-y-4'>
            <InfoRow label='Attending Surgeon' value='Dr. David Smith' />
            <InfoRow
              label='Assigned Anaesthesiologist'
              value='Dr. Sarah Jenkins'
            />
          </div>

          {/* Type Dropdown */}
          <div className='col-span-2'>
            <label className='mb-2 block text-sm text-[var(--header-text)]'>
              Type
            </label>
            <select
              value={admissionType}
              onChange={(e) => setAdmissionType(e.target.value)}
              className={inputBase}
            >
              <option value='Elective'>Elective</option>
              <option value='Emergency'>Emergency</option>
              <option value='Urgent'>Urgent</option>
            </select>
          </div>
        </div>
      </section>

      {/* Relevant Medical History | Clinical Information*/}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
        <section className={cardClass}>
          <SectionHeader
            title='Relevant Medical History'
            icon={<HiOutlineClock className={SECTION_ICON_CLASS} />}
          />
          <div className='p-6'>
            <p className='mb-4 text-sm text-[var(--accent-muted)]'>
              Select all that apply
            </p>
            <div className='relative mb-5'>
              <input
                type='search'
                placeholder='Start typing to search'
                value={medicalSearch}
                onChange={(e) => setMedicalSearch(e.target.value)}
                className={`${inputBase} pr-10`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
                <HiOutlineMagnifyingGlass className='h-3.5 w-3.5 text-slate-400' />
              </span>
            </div>
            <ul className='mb-5 flex flex-col gap-2'>
              {filteredConditions.map((condition) => (
                <li key={condition}>
                  <label className='flex cursor-pointer items-center gap-2.5 text-sm text-slate-700'>
                    <input
                      type='checkbox'
                      checked={selectedConditions.has(condition)}
                      onChange={() => toggleCondition(condition)}
                      className='h-3.5 w-3.5 rounded border-slate-300 text-slate-500 focus:ring-slate-400'
                    />
                    {condition}
                  </label>
                </li>
              ))}
            </ul>
            <div>
              <label className='mb-2 block text-sm text-[var(--header-text)]'>
                Specify if Others
              </label>
              <input
                type='text'
                value={othersText}
                onChange={(e) => setOthersText(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader
            title='Clinical Information'
            icon={<HiOutlineChartBar className={SECTION_ICON_CLASS} />}
            rightAction={
              <div className='flex items-center gap-1.5' title='Voice record'>
                <HiOutlineMicrophone className='h-3.5 w-3.5 text-[var(--accent-muted)]' />
                <span className='text-xs font-medium text-[var(--accent-muted)]'>
                  Voice Record
                </span>
              </div>
            }
          />
          <div className='flex flex-col gap-6 p-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-[var(--header-text)]'>
                Clinical Diagonosis
              </label>
              <textarea
                value={clinicalDiagnosis}
                onChange={(e) => setClinicalDiagnosis(e.target.value)}
                rows={3}
                className={`${inputBase} resize-none`}
                placeholder='Enter clinical diagnosis...'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-[var(--header-text)]'>
                Proposed surgery / Procedure
              </label>
              <textarea
                value={proposedSurgery}
                onChange={(e) => setProposedSurgery(e.target.value)}
                rows={3}
                className={`${inputBase} resize-none`}
                placeholder='Enter proposed surgery or procedure...'
              />
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-[var(--header-text)]'>
                  Scheduled Date
                </label>
                <div className='relative'>
                  <input
                    ref={scheduledDateInputRef}
                    type='date'
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className={`${inputBase} pr-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:opacity-0`}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      scheduledDateInputRef.current?.showPicker?.()
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                    aria-label='Open calendar'
                  >
                    <HiOutlineCalendarDays className='h-3.5 w-3.5' />
                  </button>
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-[var(--header-text)]'>
                  Preanaesthetic Concern
                </label>
                <input
                  type='text'
                  value={preanaestheticConcern}
                  onChange={(e) => setPreanaestheticConcern(e.target.value)}
                  placeholder='Text Here...'
                  className={inputBase}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* current medication */}
      <section className={`mb-6 mt-8 ${cardClass} overflow-hidden`}>
        <SectionHeader
          title='Current Medication'
          icon={<HiOutlineDocumentText className={SECTION_ICON_CLASS} />}
        />

        {/* Single table: header row with no gap under title (colored), padded body, Medicine column wider */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse table-fixed'>
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
            </colgroup>
            <thead>
              <tr className='text-left text-[var(--header-text)] border-b border-slate-200 bg-gray-50'>
                <th className='py-3 pl-6 pr-2 font-medium'>Medicine</th>
                <th className='py-3 px-2 font-medium'>Strength</th>
                <th className='py-3 px-2 font-medium'>Dosage</th>
                <th className='py-3 px-2 font-medium'>Frequency</th>
                <th className='py-3 px-2 font-medium'>Duration</th>
                <th className='py-3 pl-2 pr-6 font-medium'>Instruction</th>
              </tr>
            </thead>
            <tbody className='text-slate-700'>
              <tr className='border-b border-slate-100'>
                <td className='py-4 pl-6 pr-2 font-medium'>Metformin</td>
                <td className='py-4 px-2'>500 mg</td>
                <td className='py-4 px-2'>1</td>
                <td className='py-4 px-2'>Twice daily</td>
                <td className='py-4 px-2'>30 days</td>
                <td className='py-4 pl-2 pr-6'>After meals</td>
              </tr>
              <tr className='border-b border-slate-100'>
                <td className='py-4 pl-6 pr-2 font-medium'>Amlodipine</td>
                <td className='py-4 px-2'>5 mg</td>
                <td className='py-4 px-2'>1/2</td>
                <td className='py-4 px-2'>Once daily</td>
                <td className='py-4 px-2'>30 days</td>
                <td className='py-4 pl-2 pr-6'>Morning</td>
              </tr>
              <tr className='border-b border-slate-100'>
                <td className='py-4 pl-6 pr-2 font-medium'>Atorvastatin</td>
                <td className='py-4 px-2'>10 mg</td>
                <td className='py-4 px-2'>1 tablet</td>
                <td className='py-4 px-2'>Once daily</td>
                <td className='py-4 px-2'>30 days</td>
                <td className='py-4 pl-2 pr-6'>Morning</td>
              </tr>
              <tr>
                <td className='py-4 pl-6 pr-2 font-medium'>Pantoprazole</td>
                <td className='py-4 px-2'>10 mg</td>
                <td className='py-4 px-2'>1</td>
                <td className='py-4 px-2'>Once daily</td>
                <td className='py-4 px-2'>15 days</td>
                <td className='py-4 pl-2 pr-6'>Before Breakfast</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* previous Surgery | physical examination */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
        {/* Previous Surgery — toggle (default on), scrollable list, add/remove surgery */}
        <section
          className={`${cardClass} flex h-[420px] min-h-[420px] flex-col`}
        >
          <SectionHeader
            title='Previous Surgery'
            icon={
              <HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />
            }
            rightAction={
              <button
                type='button'
                onClick={() => setIsPreviousSurgeryOpen((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPreviousSurgeryOpen ? "bg-slate-700" : "bg-slate-300"
                }`}
                aria-label={
                  isPreviousSurgeryOpen
                    ? "Hide previous surgery"
                    : "Show previous surgery"
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPreviousSurgeryOpen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            }
          />

          {isPreviousSurgeryOpen && (
            <div className='flex min-h-0 flex-1 flex-col p-6'>
              <div
                ref={surgeryListScrollRef}
                className='min-h-0 flex-1 overflow-y-auto'
              >
                {surgeries.map((surgery, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-1 gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0'
                  >
                    <div className='flex items-center justify-end gap-2'>
                      {surgeries.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeSurgery(index)}
                          className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                          aria-label='Remove surgery'
                        >
                          <HiOutlineMinus className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                    <input
                      type='text'
                      placeholder='Type of Surgery'
                      value={surgery.type}
                      onChange={(e) =>
                        updateSurgery(index, "type", e.target.value)
                      }
                      className={inputBase}
                    />

                    <input
                      type='text'
                      placeholder='Year'
                      value={surgery.year}
                      onChange={(e) =>
                        updateSurgery(index, "year", e.target.value)
                      }
                      className={inputBase}
                    />

                    <input
                      type='text'
                      placeholder='Anaesthesia Complications'
                      value={surgery.complications}
                      onChange={(e) =>
                        updateSurgery(index, "complications", e.target.value)
                      }
                      className={inputBase}
                    />
                  </div>
                ))}
              </div>

              <button
                type='button'
                onClick={addSurgery}
                className='mt-4 flex shrink-0 items-center gap-2 text-sm text-slate-600 hover:text-slate-800'
              >
                <HiOutlinePlus className='h-4 w-4' />
                Add new surgery
              </button>
            </div>
          )}
        </section>

        {/* Physical Examination — compact fields, no scroll */}
        <section
          className={`${cardClass} flex h-[420px] min-h-[420px] flex-col`}
        >
          <SectionHeader
            title='Physical Examination'
            icon={<HiOutlineHeart className={SECTION_ICON_CLASS} />}
          />

          <div className='grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-sm'>
            {/* Pulse Rate */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                Pulse Rate
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-9`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  bpm
                </span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                Temp
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-8`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  °C
                </span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                Weight
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-8`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  kg
                </span>
              </div>
            </div>

            {/* Resp Rate */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                Resp Rate
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-10`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  /min
                </span>
              </div>
            </div>

            {/* BP Sys / Dia */}
            <div className='col-span-2'>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                BP
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  placeholder='Sys'
                  className={`${inputCompact} text-center`}
                />
                <span className='text-slate-400 text-sm'>/</span>
                <input
                  type='text'
                  placeholder='Dia'
                  className={`${inputCompact} text-center`}
                />
              </div>
            </div>

            {/* SpO2 */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                SpO₂
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-6`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  %
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[var(--header-text)]'>
                Height
              </label>
              <div className='relative'>
                <input type='text' className={`${inputCompact} pr-8`} />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
                  cm
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Systemic Examination */}
      <section className={`mb-6 mt-8 ${cardClass}`}>
        <SectionHeader
          title='Systemic Examination'
          icon={<HiOutlineBeaker className={SECTION_ICON_CLASS} />}
        />

        <div className='grid grid-cols-2 gap-x-12 gap-y-6 p-6 text-sm'>
          <div className='space-y-6'>
            {/* Respiratory System */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[var(--header-text)]'>
                  Respiratory System (RS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    Clear
                  </span>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    B/L AE+
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                className={inputBase}
              />
            </div>

            {/* CNS */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[var(--header-text)]'>
                  Central Nervous System (CNS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    Conscious
                  </span>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    Oriented
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                className={inputBase}
              />
            </div>
          </div>

          <div className='space-y-6'>
            {/* CVS */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[var(--header-text)]'>
                  Cardiovascular (CVS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    S1 S2 Normal
                  </span>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    No Murmurs
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                className={inputBase}
              />
            </div>

            {/* Per Abdomen */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[var(--header-text)]'>
                  Per Abdomen (P/A)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    Soft
                  </span>
                  <span className='rounded-md border border-slate-300 px-2 py-0.5 text-xs text-slate-600'>
                    Non-Tender
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                className={inputBase}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Functional Capacity | General Examination */}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8'>
        <section className={`lg:col-span-3 ${cardClass}`}>
          <SectionHeader
            title='Functional Capacity'
            icon={<HiOutlineCpuChip className={SECTION_ICON_CLASS} />}
          />
          <div className='flex flex-col gap-6 p-6 text-sm'>
            {/* Breath Holding Time */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Breath Holding Time / Effective Tolerance
              </label>
              <input type='text' placeholder='Time' className={inputBase} />
            </div>

            {/* Other Findings */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Other Relevant Findings
              </label>
              <input
                type='text'
                placeholder='Enter findings'
                className={inputBase}
              />
            </div>
          </div>
        </section>

        <section className={`lg:col-span-2 ${cardClass}`}>
          <SectionHeader
            title='General Examination'
            icon={<HiOutlineEye className={SECTION_ICON_CLASS} />}
          />

          <div className='flex flex-col gap-6 p-6 text-sm'>
            {[
              { label: "Icterus", key: "icterus" },
              { label: "Pallor", key: "pallor" },
              { label: "Cyanosis", key: "cyanosis" },
              { label: "Clubbing", key: "clubbing" },
            ].map((item) => {
              const isActive =
                generalExam[item.key as keyof typeof generalExam];

              return (
                <div
                  key={item.key}
                  className='flex items-center justify-between'
                >
                  <label className='font-medium text-[var(--header-text)]'>
                    {item.label}
                  </label>

                  <button
                    type='button'
                    onClick={() =>
                      setGeneralExam((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isActive ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Investigations | Airway assessment | ASA status*/}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8'>
        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Investigation'
            icon={<HiOutlineMagnifyingGlass className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 text-sm space-y-6'>
            {/* Box Wrapped Field */}
            <div className='space-y-2'>
              <label className='block font-medium text-[var(--header-text)]'>
                Enter Findings
              </label>
              <input type='text' placeholder='Values' className={inputBase} />
            </div>

            {/* Side by Side Fields (NOT boxed separately) */}
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Dentition
                </label>
                <input type='text' className={inputBase} />
              </div>

              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Thyroid
                </label>
                <input type='text' className={inputBase} />
              </div>

              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Spine
                </label>
                <input type='text' className={inputBase} />
              </div>
            </div>
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Airway Assessment'
            icon={<HiOutlineGlobeAlt className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 text-sm space-y-6'>
            {/* First Row - 3 side by side */}
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Mouth Opening
                </label>
                <select className={inputBase}>
                  <option>3 Fingers</option>
                  <option>&gt; 3 Fingers</option>
                </select>
              </div>

              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Mento Hyoid Distance
                </label>
                <select className={inputBase}>
                  <option>&lt; 4 cm</option>
                  <option>&gt; 4 cm</option>
                </select>
              </div>

              <div>
                <label className='block mb-2 font-medium text-[var(--header-text)]'>
                  Neck Movement
                </label>
                <select className={inputBase}>
                  <option>Adequate</option>
                  <option>Restricted</option>
                </select>
              </div>
            </div>

            {/* Mallampati Grade - centered, selectable */}
            <div>
              <label className='block mb-3 font-medium text-[var(--header-text)]'>
                Mallampati Grade
              </label>
              <div className='flex justify-center gap-3'>
                {["I", "II", "III", "IV"].map((grade) => (
                  <button
                    key={grade}
                    type='button'
                    onClick={() =>
                      setMallampatiGrade(
                        mallampatiGrade === grade ? null : grade,
                      )
                    }
                    className={`min-w-[3rem] px-4 py-2.5 rounded-xl border transition ${
                      mallampatiGrade === grade
                        ? "bg-slate-700 text-white border-slate-700"
                        : "hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox */}
            <div className='flex items-center gap-3'>
              <input type='checkbox' className='h-4 w-4' />
              <label className='text-sm'>
                Patient has loose tooth / Artificial dentures
              </label>
            </div>
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass} flex flex-col`}>
          <SectionHeader
            title='ASA Status'
            icon={<HiOutlineFlag className={SECTION_ICON_CLASS} />}
          />

          <div className='flex flex-1 min-h-[140px] items-center justify-center p-6 text-sm'>
            <div className='grid grid-cols-4 sm:grid-cols-7 gap-2 w-full max-w-full'>
              {["I", "II", "III", "IV", "V", "VI", "E"].map((asa) => (
                <button
                  key={asa}
                  type='button'
                  onClick={() => setAsaStatus(asaStatus === asa ? null : asa)}
                  className={`flex items-center justify-center min-h-[2.75rem] py-2.5 rounded-lg border transition ${
                    asaStatus === asa
                      ? "bg-slate-700 text-white border-slate-700"
                      : "hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {asa}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/*Haematology | Serum electrolytes | Bio Chemistry */}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8'>
        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Haematology'
            icon={<MdOutlineBloodtype className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <thead className='text-left text-[var(--header-text)]'>
                <tr className='border-b border-slate-100'>
                  <th className='pb-2 pr-6'>Test</th>
                  <th className='pb-2 px-4'>Value</th>
                  <th className='pb-2 pl-1'>Unit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: "Hb", unit: "g/dL" },
                  { test: "Total Count", unit: "cells/mm³" },
                  { test: "Differential Count (DC)", unit: "%" },
                  { test: "Platelet Count", unit: "cells/mm³" },
                ].map((item) => (
                  <tr
                    key={item.test}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-6 font-medium'>{item.test}</td>
                    <td className='py-3 px-4'>
                      <input type='text' className={inputBase} />
                    </td>
                    <td className='py-3 pl-1 text-gray-500'>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Serum Electrolytes'
            icon={<MdOutlineScience className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <thead className='text-left text-[var(--header-text)]'>
                <tr className='border-b border-slate-100'>
                  <th className='pb-2 pr-6'>Test</th>
                  <th className='pb-2 px-4'>Value</th>
                  <th className='pb-2 pl-1'>Unit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: "Sodium", unit: "g/dL" },
                  { test: "Potassium", unit: "cells/mm³" },
                  { test: "Chloride", unit: "%" },
                  { test: "Bicarbonate", unit: "cells/mm³" },
                ].map((item) => (
                  <tr
                    key={item.test}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-6 font-medium'>{item.test}</td>
                    <td className='py-3 px-4'>
                      <input type='text' className={inputBase} />
                    </td>
                    <td className='py-3 pl-1 text-gray-500'>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Bio Chemistry'
            icon={<HiOutlineBeaker className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <thead className='text-left text-[var(--header-text)]'>
                <tr className='border-b border-slate-100'>
                  <th className='pb-2 pr-6'>Test</th>
                  <th className='pb-2 px-4'>Value</th>
                  <th className='pb-2 pl-1'>Unit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: "Blood Sugar", unit: "g/dL" },
                  { test: "Blood Urea", unit: "g/dL" },
                  { test: "Serum Creatinine", unit: "g/dL" },
                ].map((item) => (
                  <tr
                    key={item.test}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-6 font-medium'>{item.test}</td>
                    <td className='py-3 px-4'>
                      <input type='text' className={inputBase} />
                    </td>
                    <td className='py-3 pl-1 text-gray-500'>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Coagulation profile | Serology | Blood & Urine */}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8'>
        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Coagulation Profile'
            icon={<HiOutlineDocumentDuplicate className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <thead className='text-left text-[var(--header-text)]'>
                <tr className='border-b border-slate-100'>
                  <th className='pb-2 pr-6'>Test</th>
                  <th className='pb-2 px-4'>Value</th>
                  <th className='pb-2 pl-1'>Unit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: "Prothrombin Type", unit: "g/dL" },
                  { test: "INR", unit: "cells/mm³" },
                  { test: "Platelete Count (Coagulation)", unit: "%" },
                ].map((item) => (
                  <tr
                    key={item.test}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-6 font-medium'>{item.test}</td>
                    <td className='py-3 px-4'>
                      <input type='number' className={`${inputBase} w-24`} />
                    </td>
                    <td className='py-3 pl-1 text-gray-500'>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Serology'
            icon={<HiOutlineShieldCheck className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 space-y-6 text-sm'>
            {[
              { label: "HBsAg", key: "hbsag" },
              { label: "HIV", key: "hiv" },
            ].map((item) => {
              const key = item.key as keyof typeof serology;
              const isActive = serology[key];

              return (
                <div
                  key={item.key}
                  className='flex items-center justify-between'
                >
                  <label className='font-medium text-[var(--header-text)]'>
                    {item.label}
                  </label>

                  <button
                    type='button'
                    onClick={() =>
                      setSerology((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isActive ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`lg:col-span-4 ${cardClass}`}>
          <SectionHeader
            title='Blood & Urine'
            icon={<MdOutlineBloodtype className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <thead className='text-left text-[var(--header-text)]'>
                <tr className='border-b border-slate-100'>
                  <th className='pb-2 pr-6'>Test</th>
                  <th className='pb-2 pl-4'>Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { test: "Blood Grouping" },
                  { test: "Urine Examination" },
                  { test: "Bleeding Time" },
                  { test: "Clotting Time" },
                ].map((item) => (
                  <tr
                    key={item.test}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-6 font-medium'>{item.test}</td>
                    <td className='py-3 pl-4'>
                      <input type='text' className={inputBase} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Imaging & Cardiac */}
      <section className={`mb-6 mt-8 ${cardClass}`}>
        <SectionHeader
          title='Imaging and Cardiac Evaluation'
          icon={<HiOutlinePhoto className={SECTION_ICON_CLASS} />}
        />

        <div className='p-6'>
          <table className='w-full text-sm border-collapse'>
            <thead className='text-left text-[var(--header-text)]'>
              <tr className='border-b border-slate-100'>
                <th className='pb-3'>File Name</th>
                <th className='pb-3'>File Size</th>
                <th className='pb-3'>Date</th>
                <th className='pb-3 text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "ECG_Report_Nov2023.pdf",
                  size: "1.2 MB",
                  date: "23 Nov 2023",
                },
                {
                  name: "Chest_Xray.png",
                  size: "2.8 MB",
                  date: "22 Nov 2023",
                },
                {
                  name: "Echo_Report.pdf",
                  size: "950 KB",
                  date: "21 Nov 2023",
                },
              ].map((file, index) => (
                <tr
                  key={index}
                  className='border-b border-slate-100 last:border-0 hover:bg-slate-50 transition'
                >
                  <td className='py-4 font-medium'>{file.name}</td>
                  <td className='py-4 text-gray-500'>
                    <span className='flex items-center gap-2'>
                      <HiOutlineFolder className='h-4 w-4 shrink-0 text-slate-400' />
                      {file.size}
                    </span>
                  </td>
                  <td className='py-4 text-gray-500'>
                    <span className='flex items-center gap-2'>
                      <HiOutlineCalendarDays className='h-4 w-4 shrink-0 text-slate-400' />
                      {file.date}
                    </span>
                  </td>

                  <td className='py-4'>
                    <div className='flex items-center justify-center gap-3'>
                      <button
                        type='button'
                        className='p-1.5 text-slate-600 hover:text-blue-600 transition rounded'
                        aria-label='View'
                      >
                        <HiOutlineEye className='h-5 w-5' />
                      </button>
                      <button
                        type='button'
                        className='p-1.5 text-slate-600 hover:text-red-600 transition rounded'
                        aria-label='Delete'
                      >
                        <HiOutlineTrash className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Other Evaluation */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader
          title='Other Specification Investigation'
          icon={<HiOutlineMagnifyingGlass className={SECTION_ICON_CLASS} />}
        />

        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
            <div className='lg:col-span-3 flex items-center gap-3 text-[var(--header-text)]'>
              <HiOutlineMicrophone className='text-xl text-slate-600 shrink-0' />
              <span className='font-medium'>Voice Record</span>
            </div>
            <div className='lg:col-span-9'>
              <input
                type='text'
                placeholder='Enter findings...'
                className='w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plans & Alerts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
        <section className={cardClass}>
          <SectionHeader
            title='Plan & Alerts'
            icon={<HiOutlineViewColumns className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 space-y-6 text-sm'>
            {/* Anaesthesia Plan */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Anaesthesia Plan
              </label>
              <select
                value={anaesthesiaPlan}
                onChange={(e) => setAnaesthesiaPlan(e.target.value)}
                className={inputBase}
              >
                {ANAESTHESIA_PLAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Post-Operative Analgesia Planned */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Post-Operative Analgesia Planned
              </label>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {["Oral", "IV", "IM", "Epidural", "Block"].map((item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader
            title='Plan & Alerts'
            icon={<HiOutlineViewColumns className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 space-y-6 text-sm'>
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Anticipated Post-Anaesthesia Care
              </label>
              <div className='flex flex-col gap-2'>
                {["Elective", "Transfer to Ward", "ICU"].map((item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition w-full'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Preprocedure Instructions | Fit for operations*/}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
        <section className={cardClass}>
          <SectionHeader
            title='Pre-Operative / Pre-Procedure Instructions'
            icon={<HiOutlineDocumentText className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 space-y-6 text-sm'>
            {/* Voice Record Label */}
            <div className='flex items-center gap-3 text-[var(--header-text)]'>
              <HiOutlineMicrophone className='text-lg text-slate-600' />
              <span className='font-medium'>Voice Record</span>
            </div>

            {/* Findings Text Area */}
            <textarea
              rows={5}
              placeholder='Enter findings...'
              className='w-full rounded-lg border border-slate-300 p-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-slate-600
                   focus:border-slate-600 transition'
            />
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader
            title='Fit for Operations'
            icon={<HiOutlineCheckCircle className={SECTION_ICON_CLASS} />}
          />

          <div className='p-6 text-sm'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {["Fit for Surgery", "Provisional Fit", "Not Fit", "Others"].map(
                (item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                    />
                    <span className='font-medium text-[var(--header-text)]'>
                      {item}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>
        </section>
      </div>

      {/* E-signature */}
      <section className={`mb-6 mt-8 ${cardClass}`}>
        <SectionHeader
          title='Authorization'
          icon={<HiOutlinePencilSquare className={SECTION_ICON_CLASS} />}
        />

        <div className='p-6 space-y-6 text-sm'>
          <div>
            <label className='block mb-2 text-[var(--header-text)]'>
              Anaesthesiologist Name
            </label>
            <div className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
              Dr.
            </div>
          </div>

          <div>
            <label className='block mb-2 text-[var(--header-text)]'>
              Digital Signature
            </label>
            <div className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between'>
              <span className='font-semibold tracking-wide'>Dr.</span>
              <span className='text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium'>
                Signed
              </span>
            </div>
          </div>

          {/* Info Note */}
          <div className='flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800'>
            <HiOutlineInformationCircle className='h-5 w-5 shrink-0 mt-0.5 text-amber-600' />
            <p>
              By finalizing this record, you certify that the information
              provided is accurate. This document will be locked and archived as
              a permanent medico-legal record.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export { PreAnestheticFormContent };

export default function PreAnestheticPage() {
  const router = useRouter();
  return (
    <div className='min-h-full p-6 md:p-8 lg:p-10'>
      <header className='mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          <label className='text-sm font-medium text-[var(--header-text)]'>Stage</label>
          <select
            value='pre'
            onChange={(e) => {
              const v = e.target.value;
              if (v === "peri") router.push("/dashboard/perioperative");
              if (v === "recovery") router.push("/dashboard/recovery");
              if (v === "post-anaesthesia") router.push("/dashboard/post-anaesthesia");
            }}
            className='min-w-[320px] rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
          >
            <option value='pre'>Pre-Anaesthetic Assessment / Pre-Operative Checkup</option>
            <option value='peri'>Perioperative</option>
            <option value='recovery'>Recovery (Immediate Post-op / Procedure)</option>
            <option value='post-anaesthesia'>Post anaesthesia monitoring care record</option>
          </select>
        </div>
        <div className='flex items-center gap-4'>
          <button
            type='button'
            className='rounded-lg p-2 text-[var(--accent-muted)] hover:bg-white/80'
            aria-label='Audio support'
          >
            <HiOutlineSpeakerWave className='h-4 w-4' />
          </button>
          <span className='rounded-xl bg-slate-600 px-5 py-2.5 text-sm font-medium text-white'>
            Jennifer
          </span>
        </div>
      </header>
      <PreAnestheticFormContent />
    </div>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[140px_1fr] items-start ${className}`}>
      <span className='text-[var(--accent-muted)]'>{label}</span>
      <span className='font-medium text-slate-700'>{value}</span>
    </div>
  );
}


