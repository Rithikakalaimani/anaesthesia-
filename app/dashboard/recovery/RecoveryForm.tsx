"use client";

import {
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineTruck,
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";
import {useState } from "react";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";
const cardClass =
  "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";
const inputBase =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50";

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-[52px] items-center justify-between rounded-t-xl px-5 py-3"
      style={{ background: "var(--header-bg)" }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="truncate font-semibold text-[var(--header-text)]">
          {title}
        </span>
      </div>
    </div>
  );
}

const ADVERSE_EFFECTS = [
  "Hypoxemia",
  "Arrhythmia",
  "Unanticipated difficult airway",
  "Dental Injury",
  "Nil",
];

const POST_OP_TRANSFER_OPTIONS = [
  "Recovery Room",
  "ICU",
];


export default function RecoveryForm() {
  const [consciousness, setConsciousness] = useState("Awake");
  const [headLift, setHeadLift] = useState("yes");
  const [postOpTransfer, setPostOpTransfer] = useState("");
  return (
    <div className='space-y-8'>
      {/*Immediate assessment | Vitals | Adverse effects */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'>
        {/* Immediate assessment */}
        <section className={cardClass}>
          <SectionHeader
            title='Immediate Assessment'
            icon={
              <HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />
            }
          />

          <div className='p-6 space-y-6 text-sm'>
            {/* Consciousness */}
            <div>
              <label className='mb-3 block font-medium text-[var(--header-text)]'>
                Consciousness
              </label>

              <div className='relative flex rounded-lg border border-slate-200 bg-slate-100 p-1'>
                {/* Sliding Background */}
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
                    className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-300 ${
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

            {/* Reflexes */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Reflexes
              </label>
              <select className={inputBase}>
                <option>Good</option>
                <option>Medium</option>
                <option>None</option>
              </select>
            </div>

            {/* Head Lift */}
            <div>
              <label className='mb-3 block font-medium text-[var(--header-text)]'>
                Head Lift
              </label>

              <div className='flex items-center gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='headLift'
                    value='yes'
                    checked={headLift === "yes"}
                    onChange={() => setHeadLift("yes")}
                    className='accent-slate-700'
                  />
                  Yes
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='headLift'
                    value='no'
                    checked={headLift === "no"}
                    onChange={() => setHeadLift("no")}
                    className='accent-slate-700'
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Vitals */}
        <section className={cardClass}>
          <SectionHeader
            title='Vitals'
            icon={<HiOutlineChartBar className={SECTION_ICON_CLASS} />}
          />
          <div className='p-6'>
            <table className='w-full text-sm border-collapse'>
              <tbody>
                {[
                  { label: "Pulse Rate", unit: "bpm" },
                  { label: "BP", unit: "mmHg" },
                  { label: "Rep Rate", unit: "/min" },
                  { label: "SpO2", unit: "%" },
                ].map(({ label, unit }) => (
                  <tr
                    key={label}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-4 font-medium text-slate-700 w-24'>
                      {label}
                    </td>
                    <td className='py-3 px-2'>
                      <input
                        type='text'
                        placeholder='-'
                        className='w-full rounded border border-slate-200 px-3 py-2 text-sm'
                      />
                    </td>
                    <td className='py-3 pl-1 text-slate-500 text-xs'>{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/*Adverse effects */}
        <section className={cardClass}>
          <SectionHeader
            title='Adverse Effects'
            icon={
              <HiOutlineExclamationTriangle className={SECTION_ICON_CLASS} />
            }
          />
          <div className='p-6'>
            <div className='grid grid-cols-1 gap-2'>
              {ADVERSE_EFFECTS.map((item) => (
                <label
                  key={item}
                  className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition'
                >
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-slate-300 shrink-0'
                  />
                  <span className='text-sm font-medium text-[var(--header-text)]'>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Post operative transfer (checkboxes) */}
      <section className={cardClass}>
        <SectionHeader
          title='Post Operative Transfer'
          icon={<HiOutlineTruck className={SECTION_ICON_CLASS} />}
        />

        <div className='p-6'>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {POST_OP_TRANSFER_OPTIONS.map((item) => {
              const isSelected = postOpTransfer === item;

              return (
                <label
                  key={item}
                  className={`relative flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 w-full
              ${
                isSelected
                  ? "border-slate-700 bg-slate-100"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
                >
                  <input
                    type='radio'
                    name='postOpTransfer'
                    value={item}
                    checked={isSelected}
                    onChange={() => setPostOpTransfer(item)}
                    className='h-4 w-4 accent-slate-700'
                  />

                  <span
                    className={`text-sm font-medium ${
                      isSelected
                        ? "text-slate-900"
                        : "text-[var(--header-text)]"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* Authorization */}
      <AuthorizationSection />
    </div>
  );
}
