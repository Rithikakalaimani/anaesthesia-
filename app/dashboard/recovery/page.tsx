"use client";

import { useRouter } from "next/navigation";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import RecoveryForm from "./RecoveryForm";

export default function RecoveryPage() {
  const router = useRouter();

  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <select
            value="recovery"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "pre") router.push("/dashboard/pre-anesthetic");
              if (v === "peri") router.push("/dashboard/perioperative");
              if (v === "post-anaesthesia") router.push("/dashboard/post-anaesthesia");
            }}
            className="min-w-[320px] rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
          >
            <option value="pre">Pre-Anaesthetic Assessment / Pre-Operative Checkup</option>
            <option value="peri">Perioperative</option>
            <option value="recovery">Recovery (Immediate Post-op / Procedure)</option>
            <option value="post-anaesthesia">Post anaesthesia monitoring care record</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--accent-muted)] hover:bg-white/80"
            aria-label="Audio support"
          >
            <HiOutlineSpeakerWave className="h-4 w-4" />
          </button>
          <span className="rounded-xl bg-slate-600 px-5 py-2.5 text-sm font-medium text-white">
            Jennifer
          </span>
        </div>
      </header>
      <RecoveryForm />
    </div>
  );
}
