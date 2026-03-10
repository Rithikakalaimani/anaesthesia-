"use client";

import { useState } from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMicrophone
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";

/* Figma-inspired: section bg #f6f8fb, border #e5e7eb, header rgba(246,248,251,0.5) border-b, labels #9ca3af 12px uppercase */
const cardClass =
  "overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f6f8fb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";
const headerClass =
  "flex items-center gap-2 border-b border-[#e5e7eb] bg-[rgba(246,248,251,0.5)] px-5 py-3";
const headerTitleClass =
  "text-sm font-semibold uppercase tracking-[0.24px] text-[#1f2937]";
const labelClass =
  "block text-xs font-medium uppercase tracking-[0.24px] text-[#9ca3af]";
const inputBase =
  "w-full rounded-md border border-[#e5e7eb] bg-[#f6f8fb] px-3 py-2.5 text-sm text-[#1f2937] placeholder-[#757575] focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50";

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
      {icon ? <span className="h-4 w-4 shrink-0 text-[#1f2937]">{icon}</span> : null}
      <span className={headerTitleClass}>{title}</span>
    </div>
  );
}


const ALDRETE_ITEMS = [
  { key: "activity", label: "Activity (move limbs)" },
  { key: "respiration", label: "Respiration" },
  { key: "circulation", label: "Circulation" },
  { key: "consciousness", label: "Consciousness" },
  { key: "o2", label: "O2 saturation" },
] as const;

const OXYGEN_OPTIONS = [
  "Room air",
  "Nasal cannula",
  "Face mask",
  "Non-rebreather",
  "Other",
];
const TRANSFER_OPTIONS = ["Ward", "ICU", "HDU", "Recovery room", "Other"];

export default function PostAnaesthesiaForm() {
  const [consciousness, setConsciousness] = useState("Awake");
  const [painScore, setPainScore] = useState(2);
  const [aldrete, setAldrete] = useState<Record<string, number>>({
    activity: 0,
    respiration: 0,
    circulation: 0,
    consciousness: 0,
    o2: 0,
  });
  const totalScore = Object.values(aldrete).reduce((a, b) => a + b, 0);
  const handleScoreSelect = (section: string, value: number) => {
    setAldrete((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const [entries, setEntries] = useState([
    {
      time: "10:00",
      consciousness: "Awake",
      rr: "16",
      pulse: "82",
      bp: "120/80",
      spo2: "99%",
      score: "9",
    },
    {
      time: "10:15",
      consciousness: "Drowsy",
      rr: "18",
      pulse: "88",
      bp: "118/78",
      spo2: "98%",
      score: "8",
    },
    {
      time: "10:30",
      consciousness: "Alert",
      rr: "17",
      pulse: "80",
      bp: "122/82",
      spo2: "99%",
      score: "10",
    },
  ]);
  const handleAddEntry = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry = {
      time,
      consciousness: "-",
      rr: "-",
      pulse: "-",
      bp: "-",
      spo2: "-",
      score: "-",
    };

    setEntries((prev) => [...prev, newEntry]);
  };
  
  const [ponv, setPonv] = useState<"Yes" | "No">("No");

  return (
    <div className='space-y-8'>
      {/* Immediate Assessment| Aldrete Recovery Score */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch'>
        {/* -------------------- COLUMN 1 -------------------- */}
        <div className='lg:col-span-3 flex flex-col gap-5'>
          {/* Patient Details */}
          <div className='flex items-start gap-4'>
            <div className='h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold'>
              P
            </div>

            <div className='text-sm flex-1'>
              {/* Name + Surgery (same row) */}
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-semibold text-slate-800'>Louis Zen</p>
                  <p className='text-xs text-slate-500'>35 yrs • Male</p>
                </div>

                <div className='text-right'>
                  <p className='font-semibold text-slate-800'>Surgery</p>
                  <p className='text-xs text-slate-500'>ID: 23456789</p>
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Assessment */}
          <section className={`${cardClass} flex-1`}>
            <SectionHeader
              title='Immediate Assessment'
              icon={
                <HiOutlineClipboardDocumentList
                  className={SECTION_ICON_CLASS}
                />
              }
            />

            <div className='p-4 space-y-4 text-sm'>
              {/* Consciousness */}
              <div>
                <label className='mb-2 block font-medium text-[var(--header-text)]'>
                  Consciousness
                </label>

                <div className='relative flex rounded-lg border border-slate-200 bg-slate-100 p-1'>
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md bg-white shadow-sm transition-transform duration-300 ${
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
                      onClick={() => setConsciousness(item)}
                      className={`relative z-10 flex-1 py-2 text-xs font-medium ${
                        consciousness === item
                          ? "text-slate-900"
                          : "text-slate-500"
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
                  <label className='flex items-center gap-2 text-xs font-medium text-[var(--header-text)]'>
                    PULSE
                    <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                      BPM
                    </span>
                  </label>
                  <input type='text' className={inputBase} />
                </div>

                <div>
                  <label className='flex items-center gap-2 text-xs font-medium text-[var(--header-text)]'>
                    BP
                    <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                      MMHG
                    </span>
                  </label>

                  <div className='flex items-center gap-2'>
                    <input type='text' className={`${inputBase} text-center`} />
                    <span className='text-slate-400'>/</span>
                    <input type='text' className={`${inputBase} text-center`} />
                  </div>
                </div>

                {/* BP with 2 boxes */}
                <div>
                  <label className='flex items-center gap-2 text-xs font-medium text-[var(--header-text)]'>
                    RESP
                    <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                      /MIN
                    </span>
                  </label>
                  <input type='text' className={inputBase} />
                </div>

                <div>
                  <label className='flex items-center gap-2 text-xs font-medium text-[var(--header-text)]'>
                    SPO₂
                    <span className='text-[10px] uppercase text-emerald-600 font-semibold'>
                      %
                    </span>
                  </label>
                  <input type='text' className={inputBase} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* -------------------- COLUMN 2 -------------------- */}
        <section className={`${cardClass} lg:col-span-7 flex flex-col`}>
          <div className='p-4 border-b border-slate-200'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Aldrete Recovery Score
            </h3>
          </div>

          <div className='flex-1 p-4 text-sm space-y-3'>
            {[
              {
                key: "respiration",
                title: "Respiration",
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
                title: "Consciousness",
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
                title: "Activity",
                descriptions: [
                  "Does not move to pain",
                  "Moves limbs to pain",
                  "Moves all extremities",
                ],
              },
            ].map((item) => (
              <div key={item.key} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium text-slate-700 w-[22%]'>
                    {item.title}
                  </p>

                  <div className='grid grid-cols-3 gap-2 w-[78%]'>
                    {[0, 1, 2].map((score) => {
                      const selected = aldrete[item.key] === score;

                      return (
                        <label key={score} className='cursor-pointer'>
                          <input
                            type='radio'
                            name={item.key}
                            className='hidden'
                            checked={selected}
                            onChange={() => handleScoreSelect(item.key, score)}
                          />

                          <div
                            className={`
                      h-14 rounded-md border px-3
                      flex flex-col justify-center items-start
                      transition-all duration-200
                      ${
                        selected
                          ? "border-slate-800 bg-slate-50 ring-2 ring-slate-300"
                          : "border-slate-300 hover:bg-slate-50"
                      }
                    `}
                          >
                            <span className='text-base font-semibold'>
                              {score}
                            </span>

                            <p className='text-[10px] text-slate-500 leading-tight mt-0.5'>
                              {item.descriptions[score]}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className='h-px bg-slate-100' />
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- COLUMN 3 -------------------- */}
        <div className='lg:col-span-2 flex flex-col gap-5'>
          <section
            className={`${cardClass} flex-1 flex items-center justify-center`}
          >
            <div className='w-full h-full flex flex-col items-center justify-center p-8 space-y-4 text-center'>
              <p className='text-xs uppercase tracking-wide text-slate-500 font-medium'>
                Total Score
              </p>

              <p className='p-2 text-5xl font-bold text-slate-800 leading-none'>
                {totalScore}/10
              </p>

              <span className='px-4 py-1 text-[8px] rounded-md bg-amber-100 text-amber-700 font-semibold uppercase tracking-wide'>
                Monitor Patient
              </span>

              <p className='text-[10px] text-slate-400 max-w-[180px] leading-snug'>
                Patient ready for discharge when score reaches 10
              </p>
            </div>
          </section>

          {/* Transfer */}
          <section className={`${cardClass} mt-4`}>
            <div className='p-4 space-y-3'>
              <p className='text-xs font-semibold uppercase text-slate-600'>
                Transfer To
              </p>

              {["Recovery Room", "ICU"].map((place) => (
                <label
                  key={place}
                  className='flex items-center gap-3 border border-slate-300 rounded-md px-3 py-2 cursor-pointer hover:bg-slate-50'
                >
                  <input
                    type='radio'
                    name='transfer'
                    className='accent-slate-700'
                  />
                  <span className='text-sm'>{place}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Systemic Examination | PACU Monitoring Log */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* ---------------- Systemic Examination ---------------- */}
        <section className='lg:col-span-3'>
          <h3 className='text-sm font-semibold text-slate-800 mb-4'>
            Systemic Examination at PACU Transfer
          </h3>

          {/* Two Column Layout */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Column 1 */}
            <div className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1'>
                  CVS
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1'>
                  PA
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400'
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1'>
                  RS
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-slate-600 mb-1'>
                  CNS
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400'
                />
              </div>
            </div>
          </div>

          {/* Full Width Drug Field */}
          <div className='mt-4'>
            <label className='block text-xs font-medium text-slate-600 mb-1'>
              Drugs Given in Recovery
            </label>
            <input
              type='text'
              placeholder='e.g. Ondansetron 4mg'
              className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400'
            />
          </div>
        </section>

        {/* ---------------- PACU Monitoring Log ---------------- */}
        <section className={`${cardClass} lg:col-span-9`}>
          <div className={`${headerClass} flex justify-between items-center`}>
            <span className={headerTitleClass}>PACU Monitoring Log</span>

            <button
              type='button'
              onClick={handleAddEntry}
              className='rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900 transition'
            >
              + Add Entry
            </button>
          </div>

          {/* Scroll Container */}
          <div className='p-5 max-h-[220px] overflow-y-auto'>
            <table className='w-full border-collapse text-sm'>
              <thead>
                <tr className='bg-slate-50'>
                  {[
                    "Time",
                    "Consciousness",
                    "Resp Rate",
                    "Pulse",
                    "BP",
                    "SpO₂",
                    "Score",
                  ].map((head) => (
                    <th
                      key={head}
                      className='px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 border-b border-slate-200'
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {entries.map((row, i) => (
                  <tr key={i}>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.time}
                    </td>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.consciousness}
                    </td>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.rr}
                    </td>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.pulse}
                    </td>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.bp}
                    </td>
                    <td className='px-4 py-3 border-b border-slate-200'>
                      {row.spo2}
                    </td>
                    <td className='px-4 py-3 font-semibold border-b border-slate-200'>
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/*Oxygen support | Post op orders | Patient score */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start'>
        <section className='lg:col-span-3'>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Oxygen Support
            </h3>
          </div>

          <div className='h-px bg-slate-200 mb-3' />

          <div className='space-y-2 text-sm'>
            {["O₂ Mask", "ETT Spontaneous", "ETT Ventilator"].map((item) => (
              <label key={item} className='flex items-center gap-2'>
                <input type='checkbox' className='h-4 w-4 accent-slate-700' />
                <span className='text-slate-700'>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className='lg:col-span-5'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Post-operative Orders / Instructions
            </h3>

            <button
              type='button'
              className='p-1.5 rounded-md hover:bg-slate-100 transition'
            >
              <HiOutlineMicrophone className='h-4 w-4 text-slate-600' />
            </button>
          </div>

          <div className='h-px bg-slate-200 mb-3' />

          <textarea
            rows={6}
            placeholder='Enter post-operative instructions...'
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none'
          />
        </section>

        <section className='lg:col-span-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Patient's Score Before Transfer
            </h3>

            <input
              type='text'
              className='w-16 rounded-md border border-slate-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-slate-400'
            />
          </div>

          <p className='text-xs text-slate-600 mb-2'>
            Resolution of Sensory & Motor Block
            <span className='block text-[10px] text-slate-400'>
              (For Regional Anaesthesia)
            </span>
          </p>

          <div className='space-y-2 text-sm'>
            {["Yes", "No"].map((item) => (
              <label key={item} className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='blockResolution'
                  className='h-4 w-4 accent-slate-700'
                />
                <span className='text-slate-700'>{item}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Pain assessment | Authorization */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <section className='lg:col-span-3 flex flex-col'>
          <h3 className='text-sm font-semibold text-slate-800'>
            Pain Assessment
          </h3>
          <hr className='my-3 border-slate-200' />

          <div className='flex-1 space-y-5'>
            {/* -------- Pain Score Box -------- */}
            <div className='rounded-xl border border-slate-200 p-5 bg-white space-y-4'>
              {/* Label + Score */}
              <div className='flex justify-between items-center'>
                <label className='text-xs font-medium text-slate-600'>VA</label>
                <span className='text-sm font-semibold text-slate-800'>
                  {painScore}/10
                </span>
              </div>

              {/* Slider */}
              <div>
                <input
                  type='range'
                  min='0'
                  max='10'
                  value={painScore}
                  onChange={(e) => setPainScore(Number(e.target.value))}
                  className='w-full accent-slate-800'
                />

                {/* Slider Labels */}
                <div className='flex justify-between text-[11px] text-slate-500 mt-1'>
                  <span>No Pain</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            {/* -------- Post Operative Nausea / Vomiting -------- */}
            <div className='space-y-2'>
              <label className='block text-xs font-medium text-slate-600'>
                Post Operative Nausea / Vomiting
              </label>

              <div className='flex items-center gap-6'>
                <label className='flex items-center gap-2 text-sm text-slate-700'>
                  <input
                    type='radio'
                    name='ponv'
                    value='yes'
                    className='accent-slate-800'
                  />
                  Yes
                </label>

                <label className='flex items-center gap-2 text-sm text-slate-700'>
                  <input
                    type='radio'
                    name='ponv'
                    value='no'
                    className='accent-slate-800'
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className='lg:col-span-9 flex flex-col'>
          <AuthorizationSection />
        </section>
      </div>

    </div>
  );
}
