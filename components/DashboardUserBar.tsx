"use client";

import AudioSupportIcon from "@/components/AudioSupportIcon";
import { useAnaesthesiaUser } from "@/contexts/AnaesthesiaUserContext";

export default function DashboardUserBar() {
  const { user } = useAnaesthesiaUser();
  const label = user?.name?.trim() || "—";

  return (
    <div className='flex shrink-0 items-center gap-3'>
      <button
        type='button'
        className='rounded-lg p-2 text-[var(--accent-muted)] hover:bg-slate-100'
        aria-label='Audio support'
      >
        <AudioSupportIcon className='h-[25px] w-[25px]' />
      </button>
      <span className='font-raleway rounded-xl bg-[#2E2B3E] px-5 py-1 text-sm font-semibold text-white'>
        {label}
      </span>
    </div>
  );
}
