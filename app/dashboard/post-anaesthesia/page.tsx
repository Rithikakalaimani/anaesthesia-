"use client";

import { useRouter } from "next/navigation";
import DashboardUserBar from "@/components/DashboardUserBar";
import PostAnaesthesiaForm from "./PostAnaesthesiaForm";

export default function PostAnaesthesiaPage() {
  const router = useRouter();

  return (
    <div className='min-h-full p-6 md:p-8 lg:p-10'>
      <header className='mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          <label className='text-sm font-medium text-[var(--header-text)]'>
            Stage
          </label>
          <select
            value='post-anaesthesia'
            onChange={(e) => {
              const v = e.target.value;
              if (v === "pre") router.push("/dashboard/pre-anesthetic");
              if (v === "peri") router.push("/dashboard/perioperative");
              if (v === "recovery") router.push("/dashboard/recovery");
            }}
            className='min-w-[320px] rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
          >
            <option value='pre'>
              PRE-ANAESTHETIC ASSESSMENT / PRE-OPERATIVE CHECKUP
            </option>
            <option value='peri'>PERIOPERATIVE ANAESTHESIA</option>
            <option value='recovery'>
              RECOVERY (IMMEDIATE POST-OP / PROCEDURE)
            </option>
            <option value='post-anaesthesia'>
              POST ANAESTHESIA MONITORING CARE RECORD
            </option>
          </select>
        </div>
        <DashboardUserBar />
      </header>
      <PostAnaesthesiaForm />
    </div>
  );
}
