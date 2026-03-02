"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlinePlus,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { ANAESTHESIA_PLAN_OPTIONS } from "@/lib/anaesthesia";
import VitalSignsChart from "./VitalSignsChart";
import AuthorizationSection from "@/components/AuthorizationSection";

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

  useEffect(() => {
    setAnaesthesiaType(defaultAnaesthesiaType);
  }, [defaultAnaesthesiaType]);

  const handleAnaesthesiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setAnaesthesiaType(v);
    onAnaesthesiaTypeChange?.(v);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1. Patient Information – full width bar (Figma) */}
      <section className="rounded-lg bg-[#a2b8d4] p-4">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-white">
          Patient Information
        </p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-3">
          <div className="space-y-2">
            <InfoRow label="Patient Name:" value="Patient Name" />
            <InfoRow label="Surgeon Name:" value="Surg Name" />
            <InfoRow label="Assist Surgeon Name:" value="Surg Name" />
          </div>
          <div className="space-y-2">
            <InfoRow label="Surgery / Procedure Name:" value="TKR" />
            <InfoRow label="Patient Position:" value="158 cm" />
            <InfoRow label="Duration of Surgery:" value="22.7" />
          </div>
          <div className="space-y-2">
            <InfoRow label="Staff Nurse Name:" value="Nurse Name" />
            <InfoRow label="Anaesthesiologist Name:" value="Name" />
            <InfoRow label="Date:" value="22-10-25" />
          </div>
        </div>
      </section>

      {/* 2. Three columns: Left (Anaesthesia + Induction) | Center (Ventilation + Chart) | Right (Tourniquet, Fluids, etc.) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Anaesthesia Type */}
          <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Anaesthesia Type</p>
            <select
              value={anaesthesiaType}
              onChange={handleAnaesthesiaChange}
              className={inputBase}
            >
              {ANAESTHESIA_PLAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </section>

          {/* Induction & Airway */}
          <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase text-slate-500">Induction & Airway</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Relaxant</label>
                <input type="text" placeholder="Enter relaxant" className={inputBase} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">IM/IA OP Problems</label>
                <input type="text" placeholder="Enter problems" className={inputBase} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Intubation</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Oral" className={inputBase} />
                  <input type="text" placeholder="LMA" className={inputBase} />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Throat Pack?</span>
                <Toggle value={true} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">ECG Monitoring?</span>
                <Toggle value={true} />
              </div>
            </div>
          </section>
        </div>

        {/* Center column – Ventilation + Chart (chart in middle) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Ventilation Mode */}
          <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Mode of Ventilation</p>
            <div className="flex flex-wrap gap-3">
              {["Controlled", "Spontaneous", "Mask"].map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="ventilation"
                    checked={ventilationMode === opt}
                    onChange={() => setVentilationMode(opt)}
                    className="h-3.5 w-3.5 accent-slate-600"
                  />
                  <span className="text-sm font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs font-medium uppercase text-slate-500">Pre Oxygen</p>
            <div className="mt-1 flex gap-3">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="preOxygen"
                    checked={preOxygen === opt}
                    onChange={() => setPreOxygen(opt)}
                    className="h-3.5 w-3.5 accent-slate-600"
                  />
                  <span className="text-sm font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-slate-500">Induction Method</label>
              <input type="text" placeholder="Enter method" className={inputBase} />
            </div>
          </section>

          {/* Chart – in the middle */}
          <section className="rounded-lg border border-slate-200 bg-slate-100 p-4">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Select to plot</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {["Heart Rate", "Systolic", "Diastolic", "Temp", "ETCO2", "SpO2"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="min-h-[320px]">
              <VitalSignsChart showHR showNIBP showSpO2 />
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Tourniquet */}
          <section>
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Tourniquet used</p>
            <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="tourniquet"
                    checked={tourniquet === opt}
                    onChange={() => setTourniquet(opt)}
                    className="h-3.5 w-3.5 accent-slate-600"
                  />
                  <span className="text-sm font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Fluids */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase text-slate-500">Fluids</p>
            <div className="space-y-3">
              {["IV Fluids", "Blood Transfused"].map((label) => (
                <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-medium text-slate-800">{label}</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="0" className="w-20 rounded border border-dashed border-slate-300 px-2 py-1 text-right text-sm" />
                    <span className="text-xs text-slate-500">ml</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">Applied TIME: _________</p>
            <p className="text-xs text-slate-500">Removed TIME: _________</p>
          </section>

          {/* Other drugs / Fluid balance / Ventilator / Reversal – compact cards */}
          <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Other drugs</p>
            <input type="text" placeholder="Enter" className={inputBase} />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">Fluid balance</p>
            <input type="text" placeholder="Enter" className={inputBase} />
          </section>
        </div>
      </div>

      {/* 3. Immediate Pre Anaesthesia – full width */}
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">Immediate Pre Anaesthesia</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Pulse Rate", unit: "bpm", placeholder: "78" },
            { label: "BP", unit: "mmHg", placeholder: "120/80" },
            { label: "Resp Rate", unit: "/min", placeholder: "16" },
            { label: "Temp", unit: "C", placeholder: "36.5" },
          ].map(({ label, unit, placeholder }) => (
            <div key={label}>
              <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
                {label} <span className="text-emerald-600">{unit}</span>
              </label>
              <input type="text" placeholder={placeholder} className={inputBase} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {["Resp Rate MIN", "SpO2 %", "TDAP C", "Time MIN", "Others"].map((label) => (
            <div key={label}>
              <label className="mb-1 block text-xs font-medium uppercase text-slate-500">{label}</label>
              <input type="text" placeholder="-" className={inputBase} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Intra-Operative Monitoring Log – full width */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Intra-Operative Monitoring Log</h3>
          <button type="button" className="flex items-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800">
            <HiOutlinePlus className="h-4 w-4" />
            Add Entry
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="px-4 py-3 text-left text-xs font-medium">Time</th>
                <th className="px-4 py-3 text-center text-xs font-medium">Heart Rate</th>
                <th className="px-4 py-3 text-center text-xs font-medium">Systolic</th>
                <th className="px-4 py-3 text-center text-xs font-medium">Diastolic</th>
                <th className="px-4 py-3 text-center text-xs font-medium">Temp</th>
                <th className="px-4 py-3 text-center text-xs font-medium">ETCO2</th>
                <th className="px-4 py-3 text-center text-xs font-medium">SpO2</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3"><input type="time" className={inputBase} /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
                <td className="px-4 py-3"><input type="text" className="w-full rounded border border-slate-200 px-2 py-1 text-center text-sm" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">Time of Extubation</label>
            <input type="text" className={inputBase} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">Time completion of surgery</label>
            <input type="text" className={inputBase} />
          </div>
          <div className="flex items-end">
            <button type="button" className="w-full rounded-md bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600">
              End Surgery
            </button>
          </div>
        </div>
      </section>

      <AuthorizationSection />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-40 shrink-0 text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
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
