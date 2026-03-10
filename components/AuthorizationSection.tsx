"use client";

import { HiOutlinePencilSquare, HiOutlineInformationCircle } from "react-icons/hi2";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";
const cardClass =
  "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";

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

export default function AuthorizationSection({
  className = "",
  anaesthesiologistName = "",
  onAnaesthesiologistNameChange,
  signed = "",
  readOnly = false,
}: {
  className?: string;
  anaesthesiologistName?: string;
  onAnaesthesiologistNameChange?: (value: string) => void;
  signed?: string;
  readOnly?: boolean;
}) {
  return (
    <section className={`mb-6 mt-8 ${cardClass} ${className}`}>
      <SectionHeader
        title="Authorization"
        icon={<HiOutlinePencilSquare className={SECTION_ICON_CLASS} />}
      />
      <div className="p-6 space-y-6 text-sm">
        <div>
          <label className="block mb-2 text-[var(--header-text)]">
            Anaesthesiologist Name
          </label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            {readOnly ? (
              (anaesthesiologistName || "—")
            ) : onAnaesthesiologistNameChange ? (
              <input
                type="text"
                value={anaesthesiologistName}
                onChange={(e) => onAnaesthesiologistNameChange(e.target.value)}
                placeholder="Dr."
                className="w-full bg-transparent focus:outline-none"
              />
            ) : (
              "Dr."
            )}
          </div>
        </div>
        <div>
          <label className="block mb-2 text-[var(--header-text)]">
            Digital Signature
          </label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <span className="font-semibold tracking-wide">{signed || "Dr."}</span>
            {signed ? (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                Signed
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
          <HiOutlineInformationCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <p>
            By finalizing this record, you certify that the information provided
            is accurate. This document will be locked and archived as a
            permanent medico-legal record.
          </p>
        </div>
      </div>
    </section>
  );
}
