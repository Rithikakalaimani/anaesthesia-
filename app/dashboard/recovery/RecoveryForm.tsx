"use client";

import {
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineTruck,
} from "react-icons/hi2";
import AuthorizationSection from "@/components/AuthorizationSection";
import { useState } from "react";

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

const POST_OP_TRANSFER_OPTIONS = ["Recovery Room", "ICU"];

export type RecoveryDTO = {
  id?: string;
  patientId?: string;
  consciousness?: string;
  reflexes?: string;
  headLift?: string;
  pulseRate?: string;
  bp?: string;
  respRate?: string;
  spo2?: string;
  adverseEffects?: string[];
  postOperativeTransfer?: string;
  anaesthesiologistName?: string;
  signed?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function RecoveryForm({
  initialData = null,
  readOnly = false,
  patientId,
}: {
  initialData?: RecoveryDTO | null;
  readOnly?: boolean;
  patientId?: string;
} = {}) {
  const [saving, setSaving] = useState(false);
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
  const [bp, setBp] = useState(() => initialData?.bp ?? "");
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

  const toggleAdverse = (item: string) => {
    if (readOnly) return;
    setAdverseEffects((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleSave = async () => {
    if (!patientId) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/api/patients/${patientId}/recovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consciousness,
          reflexes,
          headLift,
          pulseRate,
          bp,
          respRate,
          spo2,
          adverseEffects: Array.from(adverseEffects),
          postOperativeTransfer: postOpTransfer || undefined,
          anaesthesiologistName: anaesthesiologistName || undefined,
          signed: signed || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      window.location.reload();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <fieldset
      disabled={readOnly}
      className={readOnly ? "cursor-not-allowed opacity-95" : ""}
    >
      {saveError && (
        <p className="mb-4 text-sm text-red-600">{saveError}</p>
      )}
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <section className={cardClass}>
            <SectionHeader
              title="Immediate Assessment"
              icon={
                <HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />
              }
            />
            <div className="p-6 space-y-6 text-sm">
              <div>
                <label className="mb-3 block font-medium text-[var(--header-text)]">
                  Consciousness
                </label>
                <div className="relative flex rounded-lg border border-slate-200 bg-slate-100 p-1">
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
                      type="button"
                      onClick={() => !readOnly && setConsciousness(item)}
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
              <div>
                <label className="mb-2 block font-medium text-[var(--header-text)]">
                  Reflexes
                </label>
                <select
                  value={reflexes}
                  onChange={(e) => setReflexes(e.target.value)}
                  className={inputBase}
                >
                  <option value="Good">Good</option>
                  <option value="Medium">Medium</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div>
                <label className="mb-3 block font-medium text-[var(--header-text)]">
                  Head Lift
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="headLift"
                      value="yes"
                      checked={headLift === "yes"}
                      onChange={() => setHeadLift("yes")}
                      className="accent-slate-700"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="headLift"
                      value="no"
                      checked={headLift === "no"}
                      onChange={() => setHeadLift("no")}
                      className="accent-slate-700"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <SectionHeader
              title="Vitals"
              icon={<HiOutlineChartBar className={SECTION_ICON_CLASS} />}
            />
            <div className="p-6">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-700 w-24">
                      Pulse Rate
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        placeholder="-"
                        value={pulseRate}
                        onChange={(e) => setPulseRate(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="py-3 pl-1 text-slate-500 text-xs">bpm</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-700 w-24">
                      BP
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        placeholder="-"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="py-3 pl-1 text-slate-500 text-xs">mmHg</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-700 w-24">
                      Rep Rate
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        placeholder="-"
                        value={respRate}
                        onChange={(e) => setRespRate(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="py-3 pl-1 text-slate-500 text-xs">/min</td>
                  </tr>
                  <tr className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-700 w-24">
                      SpO2
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        placeholder="-"
                        value={spo2}
                        onChange={(e) => setSpo2(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="py-3 pl-1 text-slate-500 text-xs">%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={cardClass}>
            <SectionHeader
              title="Adverse Effects"
              icon={
                <HiOutlineExclamationTriangle className={SECTION_ICON_CLASS} />
              }
            />
            <div className="p-6">
              <div className="grid grid-cols-1 gap-2">
                {ADVERSE_EFFECTS.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 shrink-0"
                      checked={adverseEffects.has(item)}
                      onChange={() => toggleAdverse(item)}
                    />
                    <span className="text-sm font-medium text-[var(--header-text)]">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className={cardClass}>
          <SectionHeader
            title="Post Operative Transfer"
            icon={<HiOutlineTruck className={SECTION_ICON_CLASS} />}
          />
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {POST_OP_TRANSFER_OPTIONS.map((item) => {
                const isSelected = postOpTransfer === item;
                return (
                  <label
                    key={item}
                    className={`relative flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-all duration-200 w-full ${
                      isSelected
                        ? "border-slate-700 bg-slate-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="postOpTransfer"
                      value={item}
                      checked={isSelected}
                      onChange={() => setPostOpTransfer(item)}
                      className="h-4 w-4 accent-slate-700"
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

        <AuthorizationSection
          anaesthesiologistName={anaesthesiologistName}
          onAnaesthesiologistNameChange={setAnaesthesiologistName}
          signed={signed}
          readOnly={readOnly}
        />
      </div>
      {!readOnly && patientId && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Recovery Record"}
          </button>
        </div>
      )}
    </fieldset>
  );
}
