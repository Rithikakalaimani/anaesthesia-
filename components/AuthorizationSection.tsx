"use client";

import { HiOutlinePencilSquare, HiOutlineInformationCircle } from "react-icons/hi2";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";
const cardClass =
  "overflow-hidden rounded-xl border border-[#D1D5DB] shadow-sm";

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-t-xl px-5 py-3"
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="truncate font-semibold text-[var(--header-text)] text-sm py-5">
          {title}
        </span>
      </div>
    </div>
  );
}

function AuthorizationNameIcon(){
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.25 6.75C5.25 7.57787 5.92213 8.25 6.75 8.25C7.57787 8.25 8.25 7.57787 8.25 6.75C8.25 5.92213 7.57787 5.25 6.75 5.25C5.92213 5.25 5.25 5.92213 5.25 6.75V6.75'
        stroke='#6B7280'
        strokeWidth={1.125}
      />
      <path
        d='M9.75 11.25C9.75 12.0788 9.75 12.75 6.75 12.75C3.75 12.75 3.75 12.0788 3.75 11.25C3.75 11.25 5.0925 9.75 6.75 9.75C6.75 9.75 9.75 10.4212 9.75 11.25V11.25'
        stroke='#6B7280'
        strokeWidth={1.125}
      />
      <path
        d='M1.5 9C1.5 6.17175 1.5 4.75725 2.379 3.879C3.258 3.00075 4.67175 3 7.5 3H10.5C13.3282 3 14.7428 3 15.621 3.879C16.4993 4.758 16.5 6.17175 16.5 9C16.5 9 16.5 13.2428 15.621 14.121C15.621 14.121 13.3282 15 10.5 15H7.5C4.67175 15 3.25725 15 2.379 14.121C1.50075 13.242 1.5 11.8282 1.5 9V9'
        stroke='#6B7280'
        strokeWidth={1.125}
      />
      <path
        d='M14.25 9H11.25M14.25 6.75H10.5M14.25 11.25H12'
        stroke='#6B7280'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
    </svg>
  );
}
export default function AuthorizationSection({
  className = "",
  anaesthesiologistName = "",
  onAnaesthesiologistNameChange,
  signed = "",
  onSignedChange,
  readOnly = false,
  actions,
}: {
  className?: string;
  anaesthesiologistName?: string;
  onAnaesthesiologistNameChange?: (value: string) => void;
  signed?: string;
  onSignedChange?: (value: string) => void;
  readOnly?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <section className={`mb-6 mt-8 ${cardClass} ${className} bg-[#F6F8FB]`}>
      <SectionHeader
        title='AUTHORIZATION'
        icon={<HiOutlinePencilSquare className={SECTION_ICON_CLASS} />}
      />

      <div className='p-6 space-y-6 text-sm'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2 text-gray-500 font-medium'>
              Anaesthesiologist Name
            </label>
            <div className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
              {readOnly ? (
                anaesthesiologistName || "—"
              ) : onAnaesthesiologistNameChange ? (
                <input
                  type='text'
                  value={anaesthesiologistName}
                  onChange={(e) =>
                    onAnaesthesiologistNameChange(e.target.value)
                  }
                  placeholder='Dr'
                  className='h-10 w-full bg-[#F6F8FB] focus:outline-none'
                />
              ) : (
                "Dr."
              )}
            </div>
          </div>

          <div>
            <label className='block mb-2 text-gray-500 font-medium'>
              Digital Signature
            </label>
            <div className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between'>
              {readOnly ? (
                <>
                  <span className='font-semibold tracking-wide'>
                    {signed || "—"}
                  </span>
                  {signed ? (
                    <span className='text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium'>
                      Signed
                    </span>
                  ) : null}
                </>
              ) : onSignedChange ? (
                <input
                  type='text'
                  value={signed}
                  onChange={(e) => onSignedChange(e.target.value)}
                  placeholder='Dr.'
                  className='h-10 w-full bg-[#F6F8FB] focus:outline-none'
                />
              ) : (
                <>
                  <span className='font-semibold tracking-wide'>
                    {signed || "Dr."}
                  </span>
                  {signed ? (
                    <span className='text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium'>
                      Signed
                    </span>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-start gap-3 rounded-lg bg-[#F2994A1A] border border-amber-200 p-1 text-xs text-[#F2994A]'>
          <HiOutlineInformationCircle className='h-5 w-5 shrink-0 mt-0.5 text-[#F2994A]' />
          <p>
            By finalizing this record, you certify that the information provided
            is accurate. This document will be locked and archived as a
            permanent medico-legal record.
          </p>
        </div>

        {/* ACTIONS */}
        {actions ? <div className='flex gap-3 pt-2'>{actions}</div> : null}
      </div>
    </section>
  );
}
