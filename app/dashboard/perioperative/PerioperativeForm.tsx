"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineBeaker,
  HiOutlineClipboardDocumentList,
  HiOutlineMicrophone,
  HiOutlinePencilSquare,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { ANAESTHESIA_PLAN_OPTIONS } from "@/lib/anaesthesia";
import VitalSignsChart from "./VitalSignsChart";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";
const cardClass = "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";
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
        <span className="truncate font-semibold text-[var(--header-text)]">{title}</span>
      </div>
    </div>
  );
}

export type PerioperativeFormProps = {
  defaultAnaesthesiaType: string;
  onAnaesthesiaTypeChange?: (value: string) => void;
};

export default function PerioperativeForm({
  defaultAnaesthesiaType,
  onAnaesthesiaTypeChange,
}: PerioperativeFormProps) {
  const [anaesthesiaType, setAnaesthesiaType] = useState<string>(defaultAnaesthesiaType);
  const [inductionTime, setInductionTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setAnaesthesiaType(defaultAnaesthesiaType);
  }, [defaultAnaesthesiaType]);

  const handleAnaesthesiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setAnaesthesiaType(v);
    onAnaesthesiaTypeChange?.(v);
  };

  return (
    <div className='space-y-8'>
      {/* Patient Info */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader
          title='Patient Information'
          icon={<HiOutlineUser className={SECTION_ICON_CLASS} />}
        />
        <div className='grid grid-cols-3 gap-x-12 gap-y-4 p-6 text-sm'>
          <InfoRow label='Patient Name' value='Patient Name' />
          <InfoRow label='Surgery / Procedure Name' value='TKR' />
          <InfoRow label='Staff nurse Name' value='42' />
          <InfoRow label='Surgeon Name' value='Surg name' />
          <InfoRow label='Patient Position' value='158 cm' />
          <InfoRow label='Anaesthesiologist Name : ' value='Name' />
          <InfoRow label='Assist Surgeon Name' value='Surg name' />
          <InfoRow label='Duration of Surgery:' value='22.7' />
          <InfoRow label='Date' value='22-10-25' />
        </div>
      </section>
      {/* Anaesthesia Type – defaults from pre-anaesthetic, editable here */}
      <section className={cardClass}>
        <SectionHeader
          title='Anaesthesia Type'
          icon={<HiOutlineBeaker className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6'>
          <p className='mb-2 text-sm text-[var(--accent-muted)]'>
            Default from Pre-Anaesthetic Plan. You can change it here if needed.
          </p>
          <select
            value={anaesthesiaType}
            onChange={handleAnaesthesiaChange}
            className={inputBase}
          >
            {ANAESTHESIA_PLAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Vital Signs / Monitoring – Recharts */}
      <section className={cardClass}>
        <SectionHeader
          title='Vital Signs and Monitoring'
          icon={<HiOutlineChartBar className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6'>
          <VitalSignsChart showHR showNIBP showSpO2 />
        </div>
      </section>

      {/* Timeline / Events */}
      <section className={cardClass}>
        <SectionHeader
          title='Timeline and Events'
          icon={<HiOutlineClock className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6 space-y-4 text-sm'>
          <div>
            <label className='mb-2 block font-medium text-[var(--header-text)]'>
              Induction time
            </label>
            <input
              type='time'
              value={inductionTime}
              onChange={(e) => setInductionTime(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className='mb-2 block font-medium text-[var(--header-text)]'>
              Events log
            </label>
            <textarea
              placeholder='e.g. IV access, induction, intubation, emergence...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={`${inputBase} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Fluids and Blood loss */}
      <section className={cardClass}>
        <SectionHeader
          title={"Fluids and Blood Loss"}
          icon={<HiOutlineBeaker className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6'>
          <table className='w-full text-sm border-collapse'>
            <thead className='text-left text-[var(--header-text)]'>
              <tr className='border-b border-slate-100'>
                <th className='pb-2 pr-4'>Type</th>
                <th className='pb-2 px-4'>Volume</th>
                <th className='pb-2 pl-1'>Unit</th>
              </tr>
            </thead>
            <tbody>
              {["Crystalloid", "Colloid", "Blood", "Blood loss (EBL)"].map(
                (row) => (
                  <tr
                    key={row}
                    className='border-b border-slate-100 last:border-0'
                  >
                    <td className='py-3 pr-4 font-medium text-slate-700'>
                      {row}
                    </td>
                    <td className='py-3 px-4'>
                      <input
                        type='text'
                        placeholder='-'
                        className={inputBase}
                      />
                    </td>
                    <td className='py-3 pl-1 text-slate-500'>mL</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Medications */}
      <section className={cardClass}>
        <SectionHeader
          title='Medications'
          icon={
            <HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />
          }
        />
        <div className='p-6'>
          <table className='w-full text-sm border-collapse'>
            <thead className='text-left text-[var(--header-text)]'>
              <tr className='border-b border-slate-100'>
                <th className='pb-2 pr-4'>Drug</th>
                <th className='pb-2 px-4'>Dose</th>
                <th className='pb-2 pl-1'>Route / Time</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className='border-b border-slate-100 last:border-0'>
                  <td className='py-3 pr-4'>
                    <input
                      type='text'
                      placeholder='Drug name'
                      className={inputBase}
                    />
                  </td>
                  <td className='py-3 px-4'>
                    <input
                      type='text'
                      placeholder='Dose'
                      className={inputBase}
                    />
                  </td>
                  <td className='py-3 pl-1'>
                    <input
                      type='text'
                      placeholder='IV / time'
                      className={inputBase}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notes & Voice */}
      <section className={cardClass}>
        <SectionHeader
          title='Perioperative Notes'
          icon={<HiOutlineDocumentText className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6 space-y-4 text-sm'>
          <div className='flex items-center gap-3 text-[var(--header-text)]'>
            <HiOutlineMicrophone className='text-lg text-slate-600' />
            <span className='font-medium'>Voice Record</span>
          </div>
          <textarea
            rows={4}
            placeholder='Enter findings...'
            className={`${inputBase} resize-none`}
          />
        </div>
      </section>

      {/* Authorization / Info */}
      <section className={cardClass}>
        <SectionHeader
          title='Authorization'
          icon={<HiOutlinePencilSquare className={SECTION_ICON_CLASS} />}
        />
        <div className='p-6 space-y-6 text-sm'>
          <div>
            <label className='block mb-2 text-[var(--header-text)]'>
              Anaesthesiologist Name
            </label>
            <div className='w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'>
              Dr. Ronald Shaw
            </div>
          </div>
          <div className='flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800'>
            <HiOutlineInformationCircle className='h-5 w-5 shrink-0 mt-0.5 text-amber-600' />
            <p>
              By finalizing this record, you certify that the information
              provided is accurate. This document will be locked and archived as
              a permanent medico-legal record.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[140px_1fr] items-start ${className}`}>
      <span className='text-[var(--accent-muted)]'>{label}</span>
      <span className='font-medium text-slate-700'>{value}</span>
    </div>
  );
}
