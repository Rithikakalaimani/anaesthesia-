"use client";

import { useState } from "react";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineCalculator,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";

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

const ALDRETE_ITEMS = [
  { key: "activity", label: "Activity (move limbs)" },
  { key: "respiration", label: "Respiration" },
  { key: "circulation", label: "Circulation" },
  { key: "consciousness", label: "Consciousness" },
  { key: "o2", label: "O2 saturation" },
] as const;

const OXYGEN_OPTIONS = ["Room air", "Nasal cannula", "Face mask", "Non-rebreather", "Other"];
const TRANSFER_OPTIONS = ["Ward", "ICU", "HDU", "Recovery room", "Other"];
const SYSTEMIC_ITEMS = ["Cardiovascular", "Respiratory", "CNS", "GIT", "Renal", "Skin", "Other"];

export default function PostAnaesthesiaForm() {
  const [aldrete, setAldrete] = useState<Record<string, number>>({
    activity: 0,
    respiration: 0,
    circulation: 0,
    consciousness: 0,
    o2: 0,
  });
  const totalScore = Object.values(aldrete).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Row 1: Immediate assessment | Systemic examination */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <section className={cardClass}>
          <SectionHeader
            title="Immediate Assessment"
            icon={<HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />}
          />
          <div className="p-6 space-y-4 text-sm">
            <div>
              <label className="mb-2 block font-medium text-[var(--header-text)]">Consciousness</label>
              <select className={inputBase}>
                <option>Alert</option>
                <option>Drowsy</option>
                <option>Responds to voice</option>
                <option>Unresponsive</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-[var(--header-text)]">Reflexes</label>
              <select className={inputBase}>
                <option>Good</option>
                <option>Medium</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-[var(--header-text)]">Notes</label>
              <textarea rows={2} placeholder="Additional notes..." className={`${inputBase} resize-none`} />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader
            title="Systemic Examination"
            icon={<HiOutlineHeart className={SECTION_ICON_CLASS} />}
          />
          <div className="p-6">
            <div className="grid grid-cols-1 gap-2">
              {SYSTEMIC_ITEMS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition"
                >
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 shrink-0 accent-slate-700" />
                  <span className="text-sm font-medium text-[var(--header-text)]">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Row 2: Oxygen support | Pain assessment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <section className={cardClass}>
          <SectionHeader
            title="Oxygen Support"
            icon={<HiOutlineBeaker className={SECTION_ICON_CLASS} />}
          />
          <div className="p-6">
            <div className="grid grid-cols-1 gap-2">
              {OXYGEN_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition"
                >
                  <input type="radio" name="oxygen" className="h-4 w-4 accent-slate-700" />
                  <span className="text-sm font-medium text-[var(--header-text)]">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionHeader
            title="Pain Assessment"
            icon={<HiOutlineChartBar className={SECTION_ICON_CLASS} />}
          />
          <div className="p-6 space-y-4 text-sm">
            <div>
              <label className="mb-2 block font-medium text-[var(--header-text)]">Pain score (0–10)</label>
              <input type="number" min={0} max={10} placeholder="0" className={inputBase} />
            </div>
            <div>
              <label className="mb-2 block font-medium text-[var(--header-text)]">Notes</label>
              <input type="text" placeholder="Optional notes" className={inputBase} />
            </div>
          </div>
        </section>
      </div>

      {/* Aldrete recovery score + Total score */}
      <section className={cardClass}>
        <SectionHeader
          title="Aldrete Recovery Score"
          icon={<HiOutlineCalculator className={SECTION_ICON_CLASS} />}
        />
        <div className="p-6">
          <p className="mb-4 text-sm text-[var(--accent-muted)]">Score each 0, 1, or 2 as per protocol.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALDRETE_ITEMS.map(({ key, label }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-[var(--header-text)]">{label}</label>
                <select
                  value={aldrete[key]}
                  onChange={(e) => setAldrete((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                  className={inputBase}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-[var(--header-text)]">Total score</span>
            <span className="text-xl font-bold text-slate-700">{totalScore}</span>
            <span className="text-sm text-slate-500">/ 10</span>
          </div>
        </div>
      </section>

      {/* Transfer to */}
      <section className={cardClass}>
        <SectionHeader
          title="Transfer to"
          icon={<HiOutlineTruck className={SECTION_ICON_CLASS} />}
        />
        <div className="p-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TRANSFER_OPTIONS.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition"
              >
                <input type="radio" name="transfer" className="h-4 w-4 accent-slate-700" />
                <span className="text-sm font-medium text-[var(--header-text)]">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* PACU monitoring log */}
      <section className={cardClass}>
        <SectionHeader
          title="PACU Monitoring Log"
          icon={<HiOutlineClock className={SECTION_ICON_CLASS} />}
        />
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="text-left text-[var(--header-text)]">
              <tr className="border-b border-slate-100">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 px-4">HR</th>
                <th className="pb-2 px-4">BP</th>
                <th className="pb-2 px-4">SpO2</th>
                <th className="pb-2 px-4">RR</th>
                <th className="pb-2 pl-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4">
                    <input type="time" className={inputBase} />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="-" className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="-" className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="-" className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm" />
                  </td>
                  <td className="py-3 px-4">
                    <input type="text" placeholder="-" className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm" />
                  </td>
                  <td className="py-3 pl-4">
                    <input type="text" placeholder="-" className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Post operative orders / instructions */}
      <section className={cardClass}>
        <SectionHeader
          title="Post Operative Orders / Instructions"
          icon={<HiOutlineDocumentText className={SECTION_ICON_CLASS} />}
        />
        <div className="p-6">
          <textarea
            rows={5}
            placeholder="Enter post operative orders and instructions..."
            className={`${inputBase} resize-none`}
          />
        </div>
      </section>

      {/* Patients score before transfer */}
      <section className={cardClass}>
        <SectionHeader
          title="Patients Score Before Transfer"
          icon={<HiOutlineUserCircle className={SECTION_ICON_CLASS} />}
        />
        <div className="p-6">
          <div className="max-w-xs">
            <label className="mb-2 block text-sm font-medium text-[var(--header-text)]">Score at transfer</label>
            <input
              type="number"
              min={0}
              max={10}
              value={totalScore}
              readOnly
              className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800"
            />
            <p className="mt-2 text-xs text-[var(--accent-muted)]">Based on Aldrete recovery score above.</p>
          </div>
        </div>
      </section>

      <AuthorizationSection />
    </div>
  );
}
