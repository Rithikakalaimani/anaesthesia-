"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlinePlus,
} from "react-icons/hi2";
import { ANAESTHESIA_PLAN_OPTIONS } from "@/lib/anaesthesia";
import PerioperativeChart, {
  PLOT_METRICS,
  type ChartPoint,
  type PlotMetric,
} from "./PerioperativeChart";


const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-[var(--header-text)]";
const cardClass =
  "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm";
const inputBase =
  "w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50";

export type PerioperativeFormProps = {
  defaultAnaesthesiaType: string;
  onAnaesthesiaTypeChange?: (value: string) => void;
};

export default function PerioperativeForm({
  defaultAnaesthesiaType,
  onAnaesthesiaTypeChange,
}: PerioperativeFormProps) {
  const [anaesthesiaType, setAnaesthesiaType] = useState<string>(defaultAnaesthesiaType);
  const [ventilationMode, setVentilationMode] = useState("Controlled");
  const [preOxygen, setPreOxygen] = useState("Yes");
  const [tourniquet, setTourniquet] = useState("Yes");
  const [intubationType, setIntubationType] = useState<string>("NA");
  const [throatPack, setThroatPack] = useState(true);
  const [ecgMonitoring, setEcgMonitoring] = useState(true);
  const [maintenanceAgents, setMaintenanceAgents] = useState<string[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<PlotMetric>("Heart Rate");
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);

  useEffect(() => {
    setAnaesthesiaType(defaultAnaesthesiaType);
  }, [defaultAnaesthesiaType]);
 

  const handleAnaesthesiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setAnaesthesiaType(v);
    onAnaesthesiaTypeChange?.(v);
  };

  const handleAddChartPoint = (time: string, value: number, metric: PlotMetric) => {
    setChartPoints((prev) => [...prev, { time, value, metric }]);
  };

const toggleMaintenanceAgent = (agent: string) => {
  setMaintenanceAgents((prev) =>
    prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent],
  );
};

  type ToggleProps = {
    value: boolean;
    onChange?: (val: boolean) => void;
  };

  function Toggle({ value, onChange }: ToggleProps) {
    return (
      <button
        type='button'
        onClick={() => onChange?.(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          value ? "bg-slate-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  }

  function SectionHeader({
    title,
    icon,
    rightAction,
  }: {
    title: string;
    icon?: React.ReactNode;
    rightAction?: React.ReactNode;
  }) {
    return (
      <div
        className='flex min-h-[52px] items-center justify-between rounded-t-xl px-5 py-3'
        style={{ background: "var(--header-bg)" }}
      >
        <div className='flex min-w-0 items-center gap-2'>
          {icon ? <span className='shrink-0'>{icon}</span> : null}
          <span className='truncate font-semibold text-[var(--header-text)]'>
            {title}
          </span>
        </div>
        {rightAction ? <span className='shrink-0'>{rightAction}</span> : null}
      </div>
    );
  }

  return (
    <>
      {/* 1. Patient Information – full width bar (Figma) */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader
          title='Patient Information'
          icon={<HiOutlineUser className={SECTION_ICON_CLASS} />}
        />
        <div className='grid grid-cols-3 gap-x-12 gap-y-4 p-6 text-sm'>
          <InfoRow label='Patient Name' value='Patient Name' />
          <InfoRow label='Surgery / Procedure Name:' value='TKR' />
          <InfoRow label='Staff Nurse Name:' value='Nurse Name' />
          <InfoRow label='Surgeon Name:' value='Surg Name' />
          <InfoRow label='Patient Position:' value='158 cm' />
          <InfoRow label='Anaesthesiologist Name :' value='Name' />
          <InfoRow label='Assist Surgeon Name:' value='Surg Name' />
          <InfoRow label='Duration of Surgery:' value='22.7' />
          <InfoRow label='Date' value='22-10-25' />
        </div>
      </section>

      {/* 2. Three columns: compact equal height; left & right scrollable */}
      <div className='grid h-[420px] grid-cols-1 gap-6 lg:grid-cols-12 items-stretch'>
        {/* Left column – scrollable */}
        <div className='flex min-h-0 flex-col gap-5 overflow-y-auto lg:col-span-4'>
          {/* Anaesthesia Type */}
          <section className='rounded-md border border-slate-200 bg-white p-3 shadow-sm'>
            <p className='mb-2 text-xs font-medium uppercase text-slate-500'>
              Anaesthesia Type
            </p>

            <div className='relative'>
              <div className='relative flex rounded-lg border border-slate-200 bg-slate-100 p-1 h-[42px]'>
                {/* Sliding Highlight */}
                <div
                  className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/4)] rounded-md bg-white shadow-sm transition-transform duration-300 ${
                    anaesthesiaType === "General"
                      ? "translate-x-0"
                      : anaesthesiaType === "Regional"
                        ? "translate-x-full"
                        : anaesthesiaType === "Local"
                          ? "translate-x-[200%]"
                          : "translate-x-[300%]"
                  }`}
                />

                {[
                  { label: "GA", value: "General" },
                  { label: "RA", value: "Regional" },
                  { label: "LA", value: "Local" },
                  { label: "MAC", value: "Sedation" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => {
                      setAnaesthesiaType(value);
                      onAnaesthesiaTypeChange?.(value);
                    }}
                    className={`relative z-10 flex-1 text-sm font-medium transition-colors duration-300 ${
                      anaesthesiaType === value
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Ventilation Mode */}
          <section className='rounded-md border border-slate-200 bg-white p-3 shadow-sm'>
            <p className='mb-2 text-xs font-medium uppercase text-slate-500'>
              Mode of Ventilation
            </p>
            <div className='flex flex-wrap gap-3'>
              {["Controlled", "Spontaneous", "Mask"].map((opt) => (
                <label
                  key={opt}
                  className='flex cursor-pointer items-center gap-2'
                >
                  <input
                    type='radio'
                    name='ventilation'
                    checked={ventilationMode === opt}
                    onChange={() => setVentilationMode(opt)}
                    className='h-3.5 w-3.5 accent-slate-600'
                  />
                  <span className='text-sm font-medium text-slate-800'>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            <p className='mt-3 text-xs font-medium uppercase text-slate-500'>
              Pre Oxygen
            </p>
            <div className='mt-1 flex gap-3'>
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className='flex cursor-pointer items-center gap-2'
                >
                  <input
                    type='radio'
                    name='preOxygen'
                    checked={preOxygen === opt}
                    onChange={() => setPreOxygen(opt)}
                    className='h-3.5 w-3.5 accent-slate-600'
                  />
                  <span className='text-sm font-medium text-slate-800'>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            <div className='mt-3'>
              <label className='mb-1 block text-xs font-medium text-slate-500'>
                Induction Method
              </label>
              <input
                type='text'
                placeholder='Enter method'
                className={inputBase}
              />
            </div>

            <div className='mt-3'>
              <label className='mb-1 block text-xs font-medium text-slate-500'>
                Relaxant
              </label>
              <input
                type='text'
                placeholder='Enter relaxant'
                className={inputBase}
              />
            </div>
            <div className='mt-3'>
              <label className='mb-1 block text-xs font-medium text-slate-500'>
                Intra Op Problems
              </label>
              <input
                type='text'
                placeholder='Enter problems'
                className={inputBase}
              />
            </div>

            <div className='mt-3'>
              <label className='mb-1 block text-xs font-medium text-slate-500'>
                Intubation
              </label>

              <div className='grid grid-cols-2 gap-2'>
                {["Oral", "LMA", "Nasal", "NA"].map((option) => {
                  const isSelected = intubationType === option;

                  return (
                    <button
                      key={option}
                      type='button'
                      onClick={() => setIntubationType(option)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200
            ${
              isSelected
                ? "border-slate-700 bg-slate-100 text-slate-900"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='mt-4 space-y-4'>
              {/* Row 1 */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-1 block text-xs font-medium text-slate-500'>
                    SA / EA / LA / Drug
                  </label>
                  <input
                    type='text'
                    placeholder='Enter drug'
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className='mb-1 block text-xs font-medium text-slate-500'>
                    Block Position
                  </label>
                  <input
                    type='text'
                    placeholder='Enter position'
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className='grid grid-cols-2 gap-4'>
                {/* Space */}
                <div>
                  <label className='mb-1 block text-xs font-medium text-slate-500'>
                    Space
                  </label>
                  <input
                    type='text'
                    placeholder='Enter space'
                    className={inputBase}
                  />
                </div>

                {/* Needle + Level */}
                <div className='grid grid-cols-2 gap-1'>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-slate-500'>
                      Needle
                    </label>
                    <input
                      type='text'
                      placeholder='Needle'
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-medium text-slate-500'>
                      Level
                    </label>
                    <input
                      type='text'
                      placeholder='Level'
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-700'>
                  Throat Pack?
                </span>
                <Toggle value={throatPack} onChange={setThroatPack} />
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-700'>
                  ECG Monitoring?
                </span>
                <Toggle value={ecgMonitoring} onChange={setEcgMonitoring} />
              </div>
            </div>

            <div className='mt-4'>
              <label className='mb-2 block text-xs font-medium text-slate-500'>
                Maintenance Agent
              </label>

              <div className='grid grid-cols-2 gap-3'>
                {["O₂", "N₂O", "Volatile", "Narcotic"].map((agent) => {
                  const checked = maintenanceAgents.includes(agent);

                  return (
                    <label
                      key={agent}
                      className={`flex items-center gap-3 cursor-pointer rounded-md border px-3 py-2 text-sm transition-all duration-200
            ${
              checked
                ? "border-slate-700 bg-slate-100"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
            }`}
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => toggleMaintenanceAgent(agent)}
                        className='h-4 w-4 accent-slate-700'
                      />

                      <span
                        className={`font-medium ${
                          checked ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {agent}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Center column – Chart (fixed height, no scroll) */}
        <div className='flex min-h-0 flex-col gap-4 lg:col-span-5'>
          <section className='flex flex-1 flex-col min-h-0 rounded-lg border border-slate-200 bg-slate-100 p-4'>
            <p className='mb-3 text-xs font-medium uppercase text-slate-500'>
              Select to plot
            </p>
            <div className='mb-3'>
              <div className='flex w-full overflow-hidden rounded-md border border-slate-300 bg-white text-xs font-medium'>
                {PLOT_METRICS.map((label, index, arr) => {
                  const isActive = selectedPlot === label;
                  return (
                    <button
                      key={label}
                      type='button'
                      onClick={() => setSelectedPlot(label)}
                      className={`flex-1 px-3 py-2 transition-colors duration-200
                ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }
                ${index !== arr.length - 1 ? "border-r border-slate-300" : ""}
              `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className='flex-1 min-h-0'>
              <PerioperativeChart
                selectedMetric={selectedPlot}
                points={chartPoints}
                onAddPoint={handleAddChartPoint}
                className='h-full'
              />
            </div>
          </section>
        </div>

        {/* Right column – scrollable */}
        <div className='flex min-h-0 flex-col gap-6 overflow-y-auto lg:col-span-3'>
          {/* Tourniquet */}
          <section>
            <p className='mb-2 text-xs font-medium uppercase text-slate-500'>
              Torniquet Used
            </p>

            {/* Yes / No */}
            <div className='flex gap-6'>
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className='flex cursor-pointer items-center gap-2'
                >
                  <input
                    type='radio'
                    name='tourniquet'
                    checked={tourniquet === opt}
                    onChange={() => setTourniquet(opt)}
                    className='h-3.5 w-3.5 accent-slate-600'
                  />
                  <span className='text-sm font-medium text-slate-800'>
                    {opt}
                  </span>
                </label>
              ))}
            </div>

            {/* Apply & Remove Time */}
            <div className='mt-4 grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-1 block text-xs font-medium text-slate-500'>
                  Applied Time
                </label>
                <input
                  type='time'
                  className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-xs font-medium text-slate-500'>
                  Removed Time
                </label>
                <input
                  type='time'
                  className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
                />
              </div>
            </div>
          </section>

          {/* Fluids */}
          <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
            <p className='mb-3 text-xs font-medium uppercase text-slate-500'>
              Fluids
            </p>
            <div className='space-y-3'>
              {["IV Fluids", "Blood Transfused"].map((label) => (
                <div
                  key={label}
                  className='flex items-center justify-between border-b border-slate-100 pb-2'
                >
                  <span className='text-sm font-medium text-slate-800'>
                    {label}
                  </span>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      defaultValue='0'
                      className='w-20 rounded border border-dashed border-slate-300 px-2 py-1 text-right text-sm'
                    />
                    <span className='text-xs text-slate-500'>ml</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Intra-op */}
          <section className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm'>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
              Intra Operative Fluid Balance
            </p>

            <div className='space-y-2'>
              {[
                { label: "Total Fluid Given", unit: "ml" },
                { label: "Blood Loss", unit: "ml" },
                { label: "Urine Output", unit: "ml" },
              ].map(({ label, unit }) => (
                <div
                  key={label}
                  className='grid grid-cols-[1fr_auto] items-center border-b border-slate-100 pb-2 last:border-none'
                >
                  <span className='text-xs font-medium text-slate-700'>
                    {label}
                  </span>

                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      defaultValue='0'
                      className='w-16 rounded border border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>{unit}</span>
                  </div>
                </div>
              ))}

              {/* Other Drugs – full width horizontal field */}
              <div className='pt-2'>
                <label className='mb-1 block text-xs font-medium text-slate-700'>
                  Other Drugs Used
                </label>
                <input
                  type='text'
                  className='w-full rounded border border-slate-300 px-2 py-1 text-xs'
                  placeholder='Enter drugs'
                />
              </div>
            </div>
          </section>

          {/* IPPV  */}
          <section className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm'>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
              IPPV / Ventilator Settings
            </p>

            <div className='space-y-2'>
              {[
                { label: "Tidal Volume", unit: "ml" },
                { label: "Peak Airway Pressure", unit: "cmH₂O" },
                { label: "Respiratory Rate", unit: "ml" },
              ].map(({ label, unit }) => (
                <div
                  key={label}
                  className='grid grid-cols-[1fr_60px_50px] items-center border-b border-slate-100 pb-2 last:border-none'
                >
                  {/* Label */}
                  <span className='text-xs font-medium text-slate-700'>
                    {label}
                  </span>

                  {/* Input */}
                  <input
                    type='text'
                    defaultValue='0'
                    className='w-full rounded border border-slate-300 px-1.5 py-1 text-right text-xs'
                  />

                  {/* Unit */}
                  <span className='text-[10px] text-slate-500 text-left'>
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Reversal Agents */}
          <section className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm'>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
              Reversal Agents
            </p>

            <div className='space-y-2'>
              {[
                { label: "Neostigmine", unit: "mg" },
                { label: "Glycopyrrolate", unit: "mg" },
              ].map(({ label, unit }) => (
                <div
                  key={label}
                  className='grid grid-cols-[1fr_auto] items-center border-b border-slate-100 pb-2 last:border-none'
                >
                  <span className='text-xs font-medium text-slate-700'>
                    {label}
                  </span>

                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      defaultValue='0'
                      className='w-16 rounded border border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 3. Immediate Pre Anaesthesia – full width */}
      <section className='rounded-md border border-slate-200 bg-white p-5 shadow-sm'>
        <h3 className='mb-4 text-sm font-semibold text-slate-800'>
          Immediate Pre Anaesthesia
        </h3>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {[
            { label: "Pulse Rate", unit: "bpm", placeholder: "78" },
            { label: "BP", unit: "mmHg", placeholder: "120/80" },
            { label: "Resp Rate", unit: "/min", placeholder: "16" },
            { label: "Temp", unit: "C", placeholder: "36.5" },
          ].map(({ label, unit, placeholder }) => (
            <div key={label}>
              <label className='mb-1 block text-xs font-medium uppercase text-slate-500'>
                {label} <span className='text-emerald-600'>{unit}</span>
              </label>
              <input
                type='text'
                placeholder={placeholder}
                className={inputBase}
              />
            </div>
          ))}
        </div>
        <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3'>
          {["Resp Rate MIN", "SpO2 %", "TDAP C", "Time MIN", "Others"].map(
            (label) => (
              <div key={label}>
                <label className='mb-1 block text-xs font-medium uppercase text-slate-500'>
                  {label}
                </label>
                <input type='text' placeholder='-' className={inputBase} />
              </div>
            ),
          )}
        </div>
      </section>

      {/* 4. Intra-Operative Monitoring Log – full width */}
      <section className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-base font-semibold text-slate-800'>
            Intra-Operative Monitoring Log
          </h3>
          <button
            type='button'
            className='flex items-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800'
          >
            <HiOutlinePlus className='h-4 w-4' />
            Add Entry
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='bg-slate-700 text-white'>
                <th className='px-4 py-3 text-left text-xs font-medium'>
                  Time
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  Heart Rate
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  Systolic
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  Diastolic
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  Temp
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  ETCO2
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium'>
                  SpO2
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-slate-100'>
                <td className='px-4 py-3'>
                  <input type='time' className={inputBase} />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    className='w-full rounded border border-slate-200 px-2 py-1 text-center text-sm'
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div>
            <label className='mb-1 block text-xs font-medium uppercase text-slate-500'>
              Time of Extubation
            </label>
            <input type='text' className={inputBase} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium uppercase text-slate-500'>
              Time completion of surgery
            </label>
            <input type='text' className={inputBase} />
          </div>
          <div className='flex items-end'>
            <button
              type='button'
              className='w-full rounded-md bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600'
            >
              End Surgery
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex gap-3">
//       <span className="w-40 shrink-0 text-sm text-slate-600">{label}</span>
//       <span className="text-sm font-medium text-slate-900">{value}</span>
//     </div>
//   );
// }
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

function Toggle({ value }: { value: boolean }) {
  return (
    <div
      className={`h-5 w-10 shrink-0 rounded-full border transition-colors ${
        value ? "bg-slate-600" : "bg-slate-300"
      }`}
    />
  );
}
