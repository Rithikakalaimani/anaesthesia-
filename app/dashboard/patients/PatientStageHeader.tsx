"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

type StageSlug = "pre-anesthetic" | "perioperative" | "recovery" | "post-anaesthesia";

const STAGES: { value: StageSlug; label: string }[] = [
  { value: "pre-anesthetic", label: "Pre-Anaesthetic Assessment / Pre-Operative Checkup" },
  { value: "perioperative", label: "Perioperative" },
  { value: "recovery", label: "Recovery (Immediate Post-op / Procedure)" },
  { value: "post-anaesthesia", label: "Post anaesthesia monitoring care record" },
];

type Props = {
  patientId: string;
  currentStage: StageSlug;
  patientName?: string;
};

export default function PatientStageHeader({
  patientId,
  currentStage,
  patientName = "Patient",
}: Props) {
  const router = useRouter();

  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <select
          value={currentStage}
          onChange={(e) => {
            const v = e.target.value as StageSlug;
            router.push(`/dashboard/patients/${patientId}/${v}`);
          }}
          className="min-w-3xl rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/patients"
          className="text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          Back to list
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--accent-muted)] hover:bg-white/80"
          aria-label="Audio support"
        >
          <HiOutlineSpeakerWave className="h-4 w-4" />
        </button>
        <span className="rounded-xl bg-slate-600 px-5 py-2.5 text-sm font-medium text-white">
          {patientName}
        </span>
      </div>
    </header>
  );
}
