"use client";

import { useRouter } from "next/navigation";
import DashboardUserBar from "@/components/DashboardUserBar";

type StageSlug =
  | "pre-anesthetic"
  | "perioperative"
  | "recovery"
  | "post-anaesthesia";

const STAGES: { value: StageSlug; label: string }[] = [
  {
    value: "pre-anesthetic",
    label: "PRE-ANAESTHETIC ASSESSMENT / PRE-OPERATIVE CHECKUP",
  },
  { value: "perioperative", label: "PERIOPERATIVE ANAESTHESIA" },
  {
    value: "recovery",
    label: "RECOVERY (IMMEDIATE POST-OP / PROCEDURE)",
  },
  {
    value: "post-anaesthesia",
    label: "POST ANAESTHESIA MONITORING CARE RECORD",
  },
];

type Props = {
  patientId: string;
  currentStage: StageSlug;
  /** Kept for call sites; badge shows logged-in anaesthetist name. */
  patientName?: string;
};

export default function PatientStageHeader({ patientId, currentStage }: Props) {
  const router = useRouter();

  return (
    <header className='mb-6 flex min-h-[44px] items-center justify-between gap-1.5 sm:gap-4 lg:mb-8'>
      <div className='min-w-0 flex-[1.15] sm:flex-1'>
        <select
          value={currentStage}
          onChange={(e) => {
            const v = e.target.value as StageSlug;
            router.push(`/dashboard/patients/${patientId}/${v}`);
          }}
          className='w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-[11px] font-semibold leading-snug text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50 sm:px-3 sm:py-2.5 sm:text-sm lg:max-w-3xl lg:px-4'
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className='max-sm:[&>div]:gap-1.5 max-sm:[&_button]:p-1 max-sm:[&_svg]:h-[18px] max-sm:[&_svg]:w-[18px] max-sm:[&_span]:max-w-[6.5rem] max-sm:[&_span]:truncate max-sm:[&_span]:px-2 max-sm:[&_span]:py-0.5 max-sm:[&_span]:text-[10px] shrink-0'>
        <DashboardUserBar />
      </div>
    </header>
  );
}
