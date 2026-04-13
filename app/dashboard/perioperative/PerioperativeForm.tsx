"use client";

import { useState, useEffect, useMemo } from "react";
import { scrollDashboardMainToTop } from "@/lib/scrollDashboard";
import { HiOutlinePlus } from "react-icons/hi2";
import PerioperativeChart, {
  type ChartPoint,
  type PlotMetric,
} from "./PerioperativeChart";
import { toPerioperativeDdMmYy } from "@/lib/surgeryDate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Patient height may already include "cm" from API; avoid "160 cm cm". */
function formatHeightForPatientPosition(raw: unknown): string {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  if (!s) return "";
  return /\bcm\b/i.test(s) ? s : `${s} cm`;
}
const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-white";
const cardClass =
  "overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm";
const inputBase =
  "w-full  border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50";

export type PerioperativeFormProps = {
  defaultAnaesthesiaType: string;
  onAnaesthesiaTypeChange?: (value: string) => void;
  patientId?: string;
};

export default function PerioperativeForm({
  defaultAnaesthesiaType,
  onAnaesthesiaTypeChange,
  patientId,
}: PerioperativeFormProps) {
  const [anaesthesiaType, setAnaesthesiaType] = useState<string>(
    defaultAnaesthesiaType,
  );
  const [ventilationMode, setVentilationMode] = useState("Controlled");
  const [preOxygen, setPreOxygen] = useState("Yes");
  const [tourniquet, setTourniquet] = useState("Yes");
  const [intubationType, setIntubationType] = useState<string>("NA");
  const [throatPack, setThroatPack] = useState(true);
  const [ecgMonitoring, setEcgMonitoring] = useState(true);
  const [maintenanceAgents, setMaintenanceAgents] = useState<string[]>([]);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);

  // Track if data already exists and if submitted (read-only when submitted)
  const [hasExistingData, setHasExistingData] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "draft" | "error"
  >("idle");
  /** When pre-anaesthetic has a scheduled date, surgery date is derived (not typed here). */
  const [surgeryDateFromPre, setSurgeryDateFromPre] = useState(false);
  const readOnly = hasExistingData && submitted;

  // Autofill fields from preanaesthetic
  const [patientName, setPatientName] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [patientPosition, setPatientPosition] = useState("");
  const [anaesthesiologistName, setAnaesthesiologistName] = useState("");
  const [date, setDate] = useState("");

  // Typable fields
  const [assistSurgeonName, setAssistSurgeonName] = useState("");
  const [surgeryProcedureName, setSurgeryProcedureName] = useState("");
  const [durationOfSurgery, setDurationOfSurgery] = useState("");
  const [staffNurseName, setStaffNurseName] = useState("");

  // Immediate Pre Anaesthesia
  const [immediatePrePulseRate, setImmediatePrePulseRate] = useState("");
  const [immediatePreRespRate, setImmediatePreRespRate] = useState("");
  const [immediatePreTemp, setImmediatePreTemp] = useState("");
  const [immediatePreTime, setImmediatePreTime] = useState("");
  const [immediatePreBpSys, setImmediatePreBpSys] = useState("");
  const [immediatePreBpDia, setImmediatePreBpDia] = useState("");
  const [immediatePreSpo2, setImmediatePreSpo2] = useState("");
  const [immediatePreOthers, setImmediatePreOthers] = useState("");

  // Other fields
  const [timeOfExtubation, setTimeOfExtubation] = useState("");
  const [timeCompletionOfSurgery, setTimeCompletionOfSurgery] = useState("");

  // Ventilation Mode section fields
  const [inductionMethod, setInductionMethod] = useState("");
  const [relaxant, setRelaxant] = useState("");
  const [intraOpProblems, setIntraOpProblems] = useState("");
  const [saEaLaDrug, setSaEaLaDrug] = useState("");
  const [blockPosition, setBlockPosition] = useState("");
  const [space, setSpace] = useState("");
  const [needle, setNeedle] = useState("");
  const [level, setLevel] = useState("");

  // Tourniquet fields
  const [tourniquetAppliedTime, setTourniquetAppliedTime] = useState("");
  const [tourniquetRemovedTime, setTourniquetRemovedTime] = useState("");

  // Fluids fields
  const [ivFluidsMl, setIvFluidsMl] = useState("");
  const [bloodTransfusedMl, setBloodTransfusedMl] = useState("");

  // Intra Operative Fluid Balance
  const [totalFluidGivenMl, setTotalFluidGivenMl] = useState("");
  const [bloodLossMl, setBloodLossMl] = useState("");
  const [urineOutputMl, setUrineOutputMl] = useState("");
  const [otherDrugsUsed, setOtherDrugsUsed] = useState("");

  // IPPV / Ventilator Settings
  const [tidalVolumeMl, setTidalVolumeMl] = useState("");
  const [peakAirwayPressureCmH2O, setPeakAirwayPressureCmH2O] = useState("");
  const [respiratoryRateMl, setRespiratoryRateMl] = useState("");

  // Reversal Agents
  const [neostigmineMg, setNeostigmineMg] = useState("");
  const [glycopyrrolateMg, setGlycopyrrolateMg] = useState("");

  type Entry = {
    time: string;
    hr: string;
    sys: string;
    dia: string;
    temp: string;
    etco2: string;
    spo2: string;
  };
  const [entries, setEntries] = useState<Entry[]>([
    {
      time: "",
      hr: "",
      sys: "",
      dia: "",
      temp: "",
      etco2: "",
      spo2: "",
    },
  ]);
  const handleAddEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        time: "",
        hr: "",
        sys: "",
        dia: "",
        temp: "",
        etco2: "",
        spo2: "",
      },
    ]);
  };

  const fields: (keyof Entry)[] = ["hr", "sys", "dia", "temp", "etco2", "spo2"];

  const chartTimeLabels = useMemo(() => {
    const times = entries
      .map((entry) => entry.time)
      .filter((time) => time.trim() !== "")
      .sort((a, b) => {
        const [aHours, aMinutes] = a.split(":").map(Number);
        const [bHours, bMinutes] = b.split(":").map(Number);
        const aTotal = aHours * 60 + aMinutes;
        const bTotal = bHours * 60 + bMinutes;
        return aTotal - bTotal;
      });
    return times.length > 0
      ? times
      : ["00:00", "00:15", "00:30", "00:45", "01:00"];
  }, [entries]);

  const applyPerioperativeData = (data: Record<string, unknown>) => {
    setPatientName((data.patientName as string) || "");
    setSurgeonName((data.surgeonName as string) || "");
    setPatientPosition((data.patientPosition as string) || "");
    setAnaesthesiologistName((data.anaesthesiologistName as string) || "");
    setDate((data.date as string) || "");
    setAnaesthesiaType(
      (data.anaesthesiaType as string) || defaultAnaesthesiaType,
    );
    setAssistSurgeonName((data.assistSurgeonName as string) || "");
    setSurgeryProcedureName((data.surgeryProcedureName as string) || "");
    setDurationOfSurgery((data.durationOfSurgery as string) || "");
    setStaffNurseName((data.staffNurseName as string) || "");
    setVentilationMode((data.ventilationMode as string) || "Controlled");
    setPreOxygen((data.preOxygen as string) || "Yes");
    setInductionMethod((data.inductionMethod as string) || "");
    setRelaxant((data.relaxant as string) || "");
    setIntraOpProblems((data.intraOpProblems as string) || "");
    setIntubationType((data.intubationType as string) || "NA");
    setSaEaLaDrug((data.saEaLaDrug as string) || "");
    setBlockPosition((data.blockPosition as string) || "");
    setSpace((data.space as string) || "");
    setNeedle((data.needle as string) || "");
    setLevel((data.level as string) || "");
    setThroatPack(Boolean(data.throatPack));
    setEcgMonitoring(Boolean(data.ecgMonitoring));
    setMaintenanceAgents(
      Array.isArray(data.maintenanceAgents)
        ? (data.maintenanceAgents as string[])
        : [],
    );
    setTourniquet((data.tourniquetUsed as string) || "Yes");
    setTourniquetAppliedTime((data.tourniquetAppliedTime as string) || "");
    setTourniquetRemovedTime((data.tourniquetRemovedTime as string) || "");
    setIvFluidsMl((data.ivFluidsMl as string) || "");
    setBloodTransfusedMl((data.bloodTransfusedMl as string) || "");
    setTotalFluidGivenMl((data.totalFluidGivenMl as string) || "");
    setBloodLossMl((data.bloodLossMl as string) || "");
    setUrineOutputMl((data.urineOutputMl as string) || "");
    setOtherDrugsUsed((data.otherDrugsUsed as string) || "");
    setTidalVolumeMl((data.tidalVolumeMl as string) || "");
    setPeakAirwayPressureCmH2O((data.peakAirwayPressureCmH2O as string) || "");
    setRespiratoryRateMl((data.respiratoryRateMl as string) || "");
    setNeostigmineMg((data.neostigmineMg as string) || "");
    setGlycopyrrolateMg((data.glycopyrrolateMg as string) || "");
    setImmediatePrePulseRate((data.immediatePrePulseRate as string) || "");
    setImmediatePreRespRate((data.immediatePreRespRate as string) || "");
    setImmediatePreTemp((data.immediatePreTemp as string) || "");
    setImmediatePreTime((data.immediatePreTime as string) || "");
    setImmediatePreBpSys((data.immediatePreBpSys as string) || "");
    setImmediatePreBpDia((data.immediatePreBpDia as string) || "");
    setImmediatePreSpo2((data.immediatePreSpo2 as string) || "");
    setImmediatePreOthers((data.immediatePreOthers as string) || "");
    const logEntries = data.monitoringLogEntries as
      | Array<Record<string, string>>
      | undefined;
    if (logEntries && logEntries.length > 0) {
      setEntries(
        logEntries.map((entry) => ({
          time: entry.time || "",
          hr: entry.hr || "",
          sys: entry.sys || "",
          dia: entry.dia || "",
          temp: entry.temp || "",
          etco2: entry.etco2 || "",
          spo2: entry.spo2 || "",
        })),
      );
    }
    setTimeOfExtubation((data.timeOfExtubation as string) || "");
    setTimeCompletionOfSurgery((data.timeCompletionOfSurgery as string) || "");
  };

  useEffect(() => {
    setAnaesthesiaType(defaultAnaesthesiaType);
  }, [defaultAnaesthesiaType]);

  useEffect(() => {
    if (patientId) {
      const fetchPatientData = async () => {
        try {
          const [patientRes, preanaestheticRes, perioperativeRes] =
            await Promise.all([
              fetch(`${API_BASE}/api/patients/${patientId}`),
              fetch(`${API_BASE}/api/patients/${patientId}/preanaesthetic`),
              fetch(`${API_BASE}/api/patients/${patientId}/perioperative`),
            ]);

          if (patientRes.ok) {
            const patientData = await patientRes.json();
            setPatientName(patientData.patientName || "");
            setPatientPosition(formatHeightForPatientPosition(patientData.height));
          }

          let preScheduledRaw: string | null = null;
          if (preanaestheticRes.ok) {
            const preanaestheticData = await preanaestheticRes.json();
            setSurgeonName(preanaestheticData.attendingSurgeon || "");
            setAnaesthesiologistName(
              preanaestheticData.assignedAnaesthesiologist || "",
            );
            setAnaesthesiaType(
              preanaestheticData.anaesthesiaPlan || defaultAnaesthesiaType,
            );
            preScheduledRaw =
              typeof preanaestheticData.scheduledDate === "string" &&
              preanaestheticData.scheduledDate.trim()
                ? preanaestheticData.scheduledDate.trim()
                : null;
          }

          if (perioperativeRes.ok) {
            const perioperativeData = await perioperativeRes.json();
            setHasExistingData(true);
            setSubmitted(perioperativeData.submitted === true);
            applyPerioperativeData(perioperativeData);
          }

          if (preScheduledRaw) {
            setSurgeryDateFromPre(true);
            setDate(toPerioperativeDdMmYy(preScheduledRaw));
          } else {
            setSurgeryDateFromPre(false);
          }
        } catch (error) {
          console.error("Failed to fetch patient data:", error);
        }
      };
      fetchPatientData();
    }
  }, [patientId, defaultAnaesthesiaType]);

  useEffect(() => {
    const newChartPoints: ChartPoint[] = [];

    entries.forEach((entry) => {
      if (!entry.time || entry.time.trim() === "") return;

      // Map field names to chart metric names
      const fieldToMetric: Record<string, PlotMetric> = {
        hr: "Heart Rate",
        sys: "Systolic",
        dia: "Diastolic",
        temp: "Temp",
        etco2: "ETCO2",
        spo2: "SpO2",
      };

      // Add chart points for each non-empty field
      Object.entries(fieldToMetric).forEach(([field, metric]) => {
        const value = entry[field as keyof Entry];
        if (value && value.trim() !== "") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            newChartPoints.push({
              time: entry.time,
              value: numValue,
              metric,
            });
          }
        }
      });
    });

    // Sort chart points by time
    newChartPoints.sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);
      const aTotal = aHours * 60 + aMinutes;
      const bTotal = bHours * 60 + bMinutes;
      return aTotal - bTotal;
    });

    setChartPoints(newChartPoints);
  }, [entries]);

  const handleAnaesthesiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setAnaesthesiaType(v);
    onAnaesthesiaTypeChange?.(v);
  };

  const toggleMaintenanceAgent = (agent: string) => {
    setMaintenanceAgents((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent],
    );
  };

  const buildPayload = (submittedFlag: boolean) => ({
    patientId,
    patientName,
    surgeonName,
    patientPosition,
    anaesthesiologistName,
    date,
    anaesthesiaType,
    assistSurgeonName,
    surgeryProcedureName,
    durationOfSurgery,
    staffNurseName,
    ventilationMode,
    preOxygen,
    inductionMethod,
    relaxant,
    intraOpProblems,
    intubationType,
    saEaLaDrug,
    blockPosition,
    space,
    needle,
    level,
    throatPack,
    ecgMonitoring,
    maintenanceAgents,
    tourniquetUsed: tourniquet,
    tourniquetAppliedTime,
    tourniquetRemovedTime,
    ivFluidsMl,
    bloodTransfusedMl,
    totalFluidGivenMl,
    bloodLossMl,
    urineOutputMl,
    otherDrugsUsed,
    tidalVolumeMl,
    peakAirwayPressureCmH2O,
    respiratoryRateMl,
    neostigmineMg,
    glycopyrrolateMg,
    immediatePreBpDia,
    immediatePreBpSys,
    immediatePreOthers,
    immediatePrePulseRate,
    immediatePreRespRate,
    immediatePreSpo2,
    immediatePreTemp,
    immediatePreTime,
    monitoringLogEntries: entries.map((entry) => ({
      time: entry.time,
      hr: entry.hr,
      sys: entry.sys,
      dia: entry.dia,
      temp: entry.temp,
      etco2: entry.etco2,
      spo2: entry.spo2,
    })),
    timeOfExtubation,
    timeCompletionOfSurgery,
    chartPoints: chartPoints.map((p) => ({
      time: p.time,
      value: p.value,
      metric: p.metric,
    })),
    submitted: submittedFlag,
  });

  const handleSubmit = async (submittedFlag: boolean) => {
    if (!patientId) {
      alert("Patient ID is required");
      return;
    }
    setSaveStatus("saving");
    try {
      const response = await fetch(
        `${API_BASE}/api/patients/${patientId}/perioperative`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(submittedFlag)),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSaveStatus(submittedFlag ? "saved" : "draft");
        // Use POST response to mark as submitted and populate form so it becomes read-only with saved data
        setHasExistingData(true);
        setSubmitted(Boolean(data.submitted));
        applyPerioperativeData(data);
        setTimeout(() => scrollDashboardMainToTop(), 0);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  type ToggleProps = {
    value: boolean;
    onChange?: (val: boolean) => void;
    disabled?: boolean;
  };

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
        className='flex items-center justify-between  px-5 py-3'
        style={{ background: "var(--header-bg)" }}
      >
        <div className='flex min-w-0 items-center gap-2'>
          {icon ? <span className='shrink-0 text-white'>{icon}</span> : null}
          <span className='truncate font-semibold text-[var(--header-text)] text-sm text-white'>
            {title}
          </span>
        </div>
        {rightAction ? <span className='shrink-0'>{rightAction}</span> : null}
      </div>
    );
  }

  function GlassIcon(){
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.12388 2.07817L15.1322 6.09984M8.12472 2.07817L2.20805 12.2882C1.6723 13.2138 1.52726 14.3148 1.80498 15.3476C2.0827 16.3805 2.76031 17.2602 3.68805 17.7923C5.62136 18.9064 8.09154 18.2468 9.21222 16.3173L10.458 14.1673M8.12472 2.07734L7.42722 1.6665M15.1322 6.09984L13.2514 9.3465M15.1322 6.09984L15.833 6.50317M13.2514 9.3465L11.8239 11.8115M13.2514 9.3465L11.1197 8.12067M11.8239 11.8115L10.458 14.1665M11.823 11.8115L8.32055 9.7965M10.458 14.1665L8.28055 12.914'
          stroke='#2F80ED'
          strokeWidth='1.25'
          strokeLinecap='round'
        />
        <path
          d='M18.3333 12.4307C18.3333 13.389 17.5875 14.1665 16.6667 14.1665C15.7458 14.1665 15 13.389 15 12.4307C15 11.8307 15.6525 11.0298 16.1417 10.514C16.2773 10.3681 16.4675 10.2852 16.6667 10.2852C16.8659 10.2852 17.0561 10.3681 17.1917 10.514C17.6808 11.0298 18.3333 11.8307 18.3333 12.4307V12.4307'
          stroke='#2F80ED'
          strokeWidth='1.25'
        />
      </svg>
    );
  }

  return (
    <>
      {saveStatus === "saved" && (
        <p className='mb-4 text-sm font-medium text-green-600'>
          Record saved. Form is now read-only.
        </p>
      )}
      {saveStatus === "draft" && (
        <p className='mb-4 text-sm font-medium text-slate-600'>Draft saved.</p>
      )}
      {saveStatus === "error" && (
        <p className='mb-4 text-sm font-medium text-red-600'>
          Save failed. Please try again.
        </p>
      )}
      <div
        className={`min-w-0 max-w-full overflow-x-hidden font-sans ${readOnly ? "opacity-95 [&_input]:cursor-not-allowed [&_select]:cursor-not-allowed" : ""}`}
      >
        {/* 1. Patient Information */}
        <section className={`mb-6 min-w-0 overflow-hidden ${cardClass}`}>
          <SectionHeader title='Patient Information' />
          <div className='grid grid-cols-2 gap-x-4 gap-y-4 p-4 text-sm sm:p-6 md:gap-x-8 xl:grid-cols-3 xl:gap-x-10 2xl:gap-x-12'>
            <InfoRow label='Patient Name' value={patientName} />
            <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
              <label className='text-[var(--accent-muted)]'>
                Surgery / Procedure Name:
              </label>
              <input
                type='text'
                disabled={readOnly}
                value={surgeryProcedureName}
                onChange={(e) => setSurgeryProcedureName(e.target.value)}
                className='min-w-0 bg-transparent font-medium outline-none cursor-text'
              />
            </div>
            <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
              <label className='text-[var(--accent-muted)]'>
                Staff Nurse Name:
              </label>
              <input
                type='text'
                disabled={readOnly}
                value={staffNurseName}
                onChange={(e) => setStaffNurseName(e.target.value)}
                className='min-w-0 bg-transparent font-medium outline-none cursor-text'
              />
            </div>
            <InfoRow label='Surgeon Name:' value={surgeonName} />
            <InfoRow label='Patient Position:' value={patientPosition} />
            <InfoRow
              label='Anaesthesiologist Name :'
              value={anaesthesiologistName}
            />
            <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
              <label className='text-[var(--accent-muted)]'>
                Assist Surgeon Name:
              </label>
              <input
                type='text'
                disabled={readOnly}
                value={assistSurgeonName}
                onChange={(e) => setAssistSurgeonName(e.target.value)}
                className='min-w-0 bg-transparent font-medium outline-none cursor-text'
              />
            </div>
            <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
              <label className='text-[var(--accent-muted)]'>
                Duration of Surgery:
              </label>
              <input
                type='text'
                disabled={readOnly}
                value={durationOfSurgery}
                onChange={(e) => setDurationOfSurgery(e.target.value)}
                className='min-w-0 bg-transparent font-medium outline-none cursor-text'
              />
            </div>
            {readOnly ? (
              <InfoRow label='Date (surgery date)' value={date || "—"} />
            ) : surgeryDateFromPre ? (
              <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
                <label className='text-[var(--accent-muted)]'>
                  Date (surgery date):
                </label>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-slate-800'>
                    {date || " "}
                  </p>
                </div>
              </div>
            ) : (
              <div className='grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0'>
                <label className='text-[var(--accent-muted)]'>
                  Date (surgery date):
                </label>
                <input
                  type='text'
                  disabled={readOnly}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder='DD-MM-YY'
                  className='min-w-0 bg-transparent font-medium outline-none cursor-text'
                />
              </div>
            )}
          </div>
        </section>

        {/* Anaesthesia | chart | tourniquet: 3-col from min-[1366px] only (avoids tight lg–xl tablet/hub layouts) */}
        <div className='grid grid-cols-1 gap-6 min-w-0 overflow-x-hidden min-[1366px]:grid-cols-12 min-[1366px]:h-[420px] min-[1366px]:items-stretch'>
          <div className='flex min-w-0 flex-col gap-5 min-[1366px]:col-span-4 min-[1366px]:min-h-0 min-[1366px]:overflow-y-auto min-[1366px]:[scrollbar-width:none] min-[1366px]:[&::-webkit-scrollbar]:hidden'>
            {/* Anaesthesia Type */}
            <section className='rounded-md border border-slate-200 bg-white p-3 shadow-sm'>
              <p className='mb-2 text-xs font-medium uppercase text-slate-500'>
                Anaesthesia Type
              </p>

              <div className='relative'>
                <div className='flex rounded-xs  bg-slate-100 overflow-hidden h-[42px]'>
                  {[
                    { label: "GA", value: "General" },
                    { label: "RA", value: "Regional" },
                    { label: "LA", value: "Local" },
                    { label: "MAC", value: "Sedation" },
                  ].map(({ label, value }, index) => {
                    const isSelected = anaesthesiaType === value;

                    return (
                      <button
                        key={value}
                        type='button'
                        disabled={readOnly}
                        onClick={() => {
                          setAnaesthesiaType(value);
                          onAnaesthesiaTypeChange?.(value);
                        }}
                        className={`flex-1 text-sm font-medium border border-slate-200 transition-all duration-200 ${
                          isSelected
                            ? " bg-[#80A6F0] text-white"
                            : "text-[#6B7280] bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className='relative mt-1 h-[3px] w-full bg-transparent'>
                  <div
                    className={`absolute left-0 h-[3px] w-1/4 bg-[#80A6F0] transition-transform duration-300 ${
                      anaesthesiaType === "General"
                        ? "translate-x-0"
                        : anaesthesiaType === "Regional"
                          ? "translate-x-full"
                          : anaesthesiaType === "Local"
                            ? "translate-x-[200%]"
                            : "translate-x-[300%]"
                    }`}
                  />
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
                      disabled={readOnly}
                      name='ventilation'
                      checked={ventilationMode === opt}
                      onChange={() => setVentilationMode(opt)}
                      className='h-3.5 w-3.5 accent-blue-500 '
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
                      disabled={readOnly}
                      name='preOxygen'
                      checked={preOxygen === opt}
                      onChange={() => setPreOxygen(opt)}
                      className='h-3.5 w-3.5 accent-blue-500'
                    />
                    <span className='text-sm font-medium text-slate-800'>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>

              <div className='mt-3 flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3'>
                <label className='shrink-0 text-xs font-medium text-slate-500 sm:whitespace-nowrap'>
                  INDUCTION METHOD:
                </label>
                <input
                  type='text'
                  placeholder=''
                  value={inductionMethod}
                  onChange={(e) => setInductionMethod(e.target.value)}
                  disabled={readOnly}
                  className='min-w-0 flex-1 border-b border-slate-500 bg-transparent text-sm focus:outline-none'
                />
              </div>

              <div className='mt-3 flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3'>
                <label className='shrink-0 text-xs font-medium text-slate-500 sm:whitespace-nowrap'>
                  RELAXANT:
                </label>
                <input
                  type='text'
                  placeholder=''
                  value={relaxant}
                  onChange={(e) => setRelaxant(e.target.value)}
                  disabled={readOnly}
                  className='min-w-0 flex-1 border-b border-slate-500 bg-transparent text-sm focus:outline-none'
                />
              </div>

              <div className='mt-3 flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3'>
                <label className='shrink-0 text-xs font-medium text-slate-500 sm:whitespace-nowrap'>
                  INTRA OP PROBLEMS:
                </label>
                <input
                  type='text'
                  placeholder=''
                  value={intraOpProblems}
                  onChange={(e) => setIntraOpProblems(e.target.value)}
                  disabled={readOnly}
                  className='min-w-0 flex-1 border-b border-slate-500 bg-transparent text-sm focus:outline-none'
                />
              </div>

              <div className='mt-3'>
                <label className='mb-1 block text-xs font-medium text-slate-500'>
                  INTUBATION
                </label>

                <div className='grid grid-cols-2 gap-2'>
                  {["Oral", "LMA", "Nasal", "NA"].map((option) => {
                    const isSelected = intubationType === option;

                    return (
                      <button
                        key={option}
                        type='button'
                        disabled={readOnly}
                        onClick={() => setIntubationType(option)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200
            ${
              isSelected
                ? "border-[#80A6F0] bg-[#80A6F01A] text-[#80A6F0]"
                : "border-slate-200  text-slate-500 hover:bg-slate-50"
            }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className='mt-4 space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-slate-500'>
                      SA / EA / LA / DRUG
                    </label>
                    <input
                      type='text'
                      placeholder=''
                      value={saEaLaDrug}
                      onChange={(e) => setSaEaLaDrug(e.target.value)}
                      disabled={readOnly}
                      className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-medium text-slate-500'>
                      BLOCK POSITION
                    </label>
                    <input
                      type='text'
                      placeholder=''
                      value={blockPosition}
                      onChange={(e) => setBlockPosition(e.target.value)}
                      disabled={readOnly}
                      className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-slate-500'>
                      SPACE
                    </label>
                    <input
                      type='text'
                      placeholder=''
                      value={space}
                      onChange={(e) => setSpace(e.target.value)}
                      disabled={readOnly}
                      className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                    />
                  </div>

                  {/* Needle + Level */}
                  <div className='grid grid-cols-2 gap-1'>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-slate-500'>
                        NEEDLE
                      </label>
                      <input
                        type='text'
                        placeholder=''
                        value={needle}
                        onChange={(e) => setNeedle(e.target.value)}
                        disabled={readOnly}
                        className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                      />
                    </div>

                    <div>
                      <label className='mb-1 block text-xs font-medium text-slate-500'>
                        LEVEL
                      </label>
                      <input
                        type='text'
                        placeholder=''
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        disabled={readOnly}
                        className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-[#1F2937]'>
                    Throat Pack?
                  </span>
                  <Toggle
                    value={throatPack}
                    onChange={setThroatPack}
                    disabled={readOnly}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-[#1F2937]'>
                    ECG Monitoring?
                  </span>
                  <Toggle
                    value={ecgMonitoring}
                    onChange={setEcgMonitoring}
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='mb-2 block text-xs font-medium text-slate-500'>
                  Maintenance Agent
                </label>

                {/* Outer container */}
                <div className='bg-[#F3F4F6] rounded-lg p-3 grid grid-cols-2 gap-3'>
                  {["O₂", "N₂O", "Volatile", "Narcotic"].map((agent) => {
                    const checked = maintenanceAgents.includes(agent);

                    return (
                      <div
                        key={agent}
                        onClick={() =>
                          !readOnly && toggleMaintenanceAgent(agent)
                        }
                        className='flex items-center gap-3 cursor-pointer'
                      >
                        {/* Custom square */}
                        <div
                          className={`h-4 w-4 rounded-sm border transition-all ${
                            checked
                              ? "bg-[#80A6F0] border-[#80A6F0]"
                              : "bg-white border-slate-300"
                          }`}
                        />

                        {/* Label */}
                        <span
                          className={`text-sm font-medium ${
                            checked ? "text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {agent}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className='hidden min-h-0 flex-col gap-4 min-[1366px]:col-span-5 min-[1366px]:flex'>
            <section className='flex min-h-0 flex-1 flex-col rounded-lg border border-slate-200 bg-slate-100 p-4'>
              {/* <p className='mb-3 text-xs font-medium uppercase text-slate-500'>
              Select to plot
            </p> */}
              {/* <div className='mb-3'>
              <div className='flex w-full overflow-hidden rounded-md border border-slate-300 bg-white text-xs font-medium'>
                {PLOT_METRICS.map((label, index, arr) => {
                  const isActive = selectedPlot === label;
                  return (
                    <button
                      key={label}
                      type='button'
                      disabled={readOnly}
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
            </div> */}
              <div className='flex-1 min-h-0'>
                <PerioperativeChart
                  points={chartPoints}
                  timeLabels={chartTimeLabels}
                  className='h-full'
                />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className='flex min-w-0 flex-col gap-6 min-[1366px]:col-span-3 min-[1366px]:min-h-0 min-[1366px]:overflow-y-auto min-[1366px]:[scrollbar-width:none] min-[1366px]:[&::-webkit-scrollbar]:hidden'>
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
                      disabled={readOnly}
                      name='tourniquet'
                      checked={tourniquet === opt}
                      onChange={() => setTourniquet(opt)}
                      className='h-3.5 w-3.5 accent-blue-500'
                    />
                    <span className='text-sm font-medium text-slate-800'>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>

              {/* Apply & Remove Time */}
              <div className='mt-4 grid grid-cols-2 gap-6'>
                <div>
                  <label className='mb-1 block text-xs font-medium text-slate-500'>
                    Applied Time
                  </label>
                  <input
                    type='time'
                    value={tourniquetAppliedTime}
                    onChange={(e) => setTourniquetAppliedTime(e.target.value)}
                    className='w-full bg-transparent border-0 border-b border-slate-400 text-sm py-1 focus:outline-none focus:border-slate-600'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-xs font-medium text-slate-500'>
                    Removed Time
                  </label>
                  <input
                    type='time'
                    value={tourniquetRemovedTime}
                    onChange={(e) => setTourniquetRemovedTime(e.target.value)}
                    className='w-full bg-transparent border-0 border-b border-slate-400 text-sm py-1 focus:outline-none focus:border-slate-600'
                  />
                </div>
              </div>
            </section>

            {/* Fluids */}
            <section className='rounded-xl bg-white p-4 '>
              <p className='mb-3 text-xs font-medium uppercase text-slate-500'>
                Fluids
              </p>
              <div className='space-y-3'>
                <div className='flex items-center justify-between pb-2'>
                  <span className='text-xs font-medium text-slate-800'>
                    IV Fluids
                  </span>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={ivFluidsMl}
                      onChange={(e) => setIvFluidsMl(e.target.value)}
                      className='w-20 border-0 border-b border-dashed border-slate-300 px-2 py-1 text-right text-sm'
                    />
                    <span className='text-xs text-slate-500'>ml</span>
                  </div>
                </div>
                <div className='flex items-center justify-between  pb-2'>
                  <span className='text-xs font-medium text-slate-800'>
                    Blood Transfused
                  </span>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={bloodTransfusedMl}
                      onChange={(e) => setBloodTransfusedMl(e.target.value)}
                      className='w-20 border-0 border-b border-dashed border-slate-300 px-2 py-1 text-right text-sm'
                    />
                    <span className='text-xs text-slate-500'>ml</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Intra-op */}
            <section className='rounded-xl border border-[#F1F5F9] bg-white p-3 shadow-sm'>
              <div className='flex items-center gap-2 mb-2'>
                <GlassIcon />
                <p className='text-xs font-semibold tracking-wide text-[#334155]'>
                  Intra-Operative Fluid Balance
                </p>
              </div>

              <div className='space-y-2'>
                <div className='grid grid-cols-[1fr_auto] items-center pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Total Fluid Given
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={totalFluidGivenMl}
                      onChange={(e) => setTotalFluidGivenMl(e.target.value)}
                      className='w-16 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>ml</span>
                  </div>
                </div>

                <div className='grid grid-cols-[1fr_auto] items-center  pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Blood Loss
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={bloodLossMl}
                      onChange={(e) => setBloodLossMl(e.target.value)}
                      className='w-16 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>ml</span>
                  </div>
                </div>

                <div className='grid grid-cols-[1fr_auto] items-center pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Urine Output
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={urineOutputMl}
                      onChange={(e) => setUrineOutputMl(e.target.value)}
                      className='w-16 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>ml</span>
                  </div>
                </div>

                <div className='grid grid-cols-[1fr_auto] items-center  pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Other Drugs Used
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={otherDrugsUsed}
                      onChange={(e) => setOtherDrugsUsed(e.target.value)}
                      className='w-20 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* IPPV  */}
            <section className='rounded-xl border border-[#F1F5F9] bg-white p-3 shadow-sm'>
              <div className='flex items-center gap-2 mb-2'>
                <GlassIcon />
                <p className='text-xs font-semibold tracking-wide text-[#334155]'>
                  IPPV / Ventilator Settings
                </p>
              </div>

              <div className='space-y-2'>
                {/* Row */}
                <div className='grid grid-cols-[1fr_80px] items-center gap-2 pb-1'>
                  <span className='text-xs font-medium text-slate-700 whitespace-nowrap'>
                    Tidal Volume
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={tidalVolumeMl}
                      onChange={(e) => setTidalVolumeMl(e.target.value)}
                      className='w-full border-0 border-b border-dashed border-slate-300 py-0.5 text-right text-xs focus:outline-none'
                    />
                    <span className='text-[10px] text-slate-500'>ml</span>
                  </div>
                </div>

                {/* Row */}
                <div className='grid grid-cols-[1fr_80px] items-center gap-2  pb-1'>
                  <span className='text-xs font-medium text-slate-700 whitespace-nowrap'>
                    Peak Airway Pressure
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={peakAirwayPressureCmH2O}
                      onChange={(e) =>
                        setPeakAirwayPressureCmH2O(e.target.value)
                      }
                      className='w-full border-0 border-b border-dashed border-slate-300 py-0.5 text-right text-xs focus:outline-none'
                    />
                    <span className='text-[10px] text-slate-500'>cmH₂O</span>
                  </div>
                </div>

                {/* Row */}
                <div className='grid grid-cols-[1fr_80px] items-center gap-2  pb-1'>
                  <span className='text-xs font-medium text-slate-700 whitespace-nowrap'>
                    Respiratory Rate
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={respiratoryRateMl}
                      onChange={(e) => setRespiratoryRateMl(e.target.value)}
                      className='w-full border-0 border-b border-dashed border-slate-300 py-0.5 text-right text-xs focus:outline-none'
                    />
                    <span className='text-[10px] text-slate-500'>ml</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Reversal Agents */}
            <section className='rounded-xl border border-[#F1F5F9] bg-white p-3 shadow-sm'>
              <div className='flex items-center gap-2 mb-2'>
                <GlassIcon />
                <p className='text-xs font-semibold tracking-wide text-[#334155]'>
                  Reversal Agents
                </p>
              </div>
              <div className='space-y-2'>
                <div className='grid grid-cols-[1fr_auto] items-center  pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Neostigmine
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={neostigmineMg}
                      onChange={(e) => setNeostigmineMg(e.target.value)}
                      className='w-16 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>mg</span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_auto] items-center pb-2'>
                  <span className='text-xs font-medium text-slate-700'>
                    Glycopyrrolate
                  </span>
                  <div className='flex items-center gap-1'>
                    <input
                      type='text'
                      value={glycopyrrolateMg}
                      onChange={(e) => setGlycopyrrolateMg(e.target.value)}
                      className='w-16 border-0 border-b border-dashed border-slate-300 px-1.5 py-1 text-right text-xs'
                    />
                    <span className='text-[10px] text-slate-500'>mg</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Immediate Pre | chart (stacked &lt; min-[1366px]) | monitoring log */}
        <div className='mt-8 grid grid-cols-1 gap-6 min-w-0 overflow-x-hidden min-[1366px]:grid-cols-12'>
          {/* Immediate Pre Anaesthesia */}
          <section className='order-1 rounded-md bg-white p-5 min-[1366px]:order-none min-[1366px]:col-span-4'>
            <h3 className='mb-4 text-sm font-semibold text-slate-800'>
              Immediate Pre Anaesthesia
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                {/* Pulse Rate */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-400'>
                    Pulse Rate <span className='text-emerald-600'>bpm</span>
                  </label>
                  <input
                    type='text'
                    placeholder=''
                    value={immediatePrePulseRate}
                    onChange={(e) => setImmediatePrePulseRate(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#F6F8FB] rounded-md px-3 py-2`}
                  />
                </div>

                {/* Resp Rate */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    Resp Rate <span className='text-emerald-600'>/min</span>
                  </label>
                  <input
                    type='text'
                    placeholder=''
                    value={immediatePreRespRate}
                    onChange={(e) => setImmediatePreRespRate(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#F6F8FB] rounded-md px-3 py-2`}
                  />
                </div>

                {/* Temp */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    Temp <span className='text-emerald-600'>°C</span>
                  </label>
                  <input
                    type='text'
                    placeholder='36.5'
                    value={immediatePreTemp}
                    onChange={(e) => setImmediatePreTemp(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#F6F8FB] rounded-md px-3 py-2`}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    Time <span className='text-emerald-600'>min</span>
                  </label>
                  <input
                    type='text'
                    placeholder='10'
                    value={immediatePreTime}
                    onChange={(e) => setImmediatePreTime(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#F6F8FB] rounded-md px-3 py-2`}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    BP <span className='text-emerald-600'>mmHg</span>
                  </label>

                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      placeholder=''
                      value={immediatePreBpSys}
                      onChange={(e) => setImmediatePreBpSys(e.target.value)}
                      className='w-full bg-[#F3F4F6] rounded-lg border border-slate-300 px-2 py-1 text-sm text-center'
                    />
                    <span className='text-sm text-slate-500'>/</span>
                    <input
                      type='text'
                      placeholder=''
                      value={immediatePreBpDia}
                      onChange={(e) => setImmediatePreBpDia(e.target.value)}
                      className='w-full bg-[#F3F4F6] rounded-lg border border-slate-300 px-2 py-1 text-sm text-center'
                    />
                  </div>
                </div>

                {/* SpO2 */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    SpO2 <span className='text-emerald-600'>%</span>
                  </label>
                  <input
                    type='text'
                    placeholder=''
                    value={immediatePreSpo2}
                    onChange={(e) => setImmediatePreSpo2(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#F3F4F6] rounded-md`}
                  />
                </div>

                {/* Others */}
                <div>
                  <label className='block text-xs font-medium uppercase text-slate-500'>
                    Others
                  </label>
                  <input
                    type='text'
                    placeholder=''
                    value={immediatePreOthers}
                    onChange={(e) => setImmediatePreOthers(e.target.value)}
                    disabled={readOnly}
                    className={`${inputBase} bg-[#E2E2E2] rounded-md border-0 focus:border-0 focus:ring-0`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Chart directly above monitoring log when &lt; xl; xl+ uses chart in top row */}
          <div className='order-2 min-w-0 min-[1366px]:hidden'>
            <section className='flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-slate-100 p-4 sm:min-h-[280px]'>
              <div className='min-h-0 flex-1'>
                <PerioperativeChart
                  points={chartPoints}
                  timeLabels={chartTimeLabels}
                  className='h-full min-h-[200px]'
                />
              </div>
            </section>
          </div>

          {/* Intra-Operative Monitoring Log */}
          <section className='order-3 flex min-w-0 flex-col bg-white p-5 min-[1366px]:order-none min-[1366px]:col-span-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-slate-800'>
                Intra-Operative Monitoring Log
              </h3>
              <button
                type='button'
                disabled={readOnly}
                onClick={handleAddEntry}
                className='flex items-center gap-2 rounded-md bg-[#1F2937] px-4 py-2 text-xs font-medium text-white hover:bg-slate-800'
              >
                <HiOutlinePlus className='h-4 w-4' />
                Add Entry
              </button>
            </div>

            <div className='min-w-0 flex-1 overflow-hidden'>
              <div className='max-h-[260px] overflow-y-auto max-[1365px]:overflow-x-auto'>
                <table className='w-full table-fixed text-sm max-[1365px]:min-w-[36rem]'>
                  <thead className='sticky top-0 bg-[#1F2937] text-white z-10'>
                    <tr>
                      <th className='px-3 py-3 text-left text-xs font-medium w-[14%] uppercase'>
                        Time
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[14%] uppercase'>
                        Heart Rate
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[14%] uppercase'>
                        Systolic
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[14%] uppercase'>
                        Diastolic
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[14%] uppercase'>
                        Temp
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[15%] uppercase'>
                        ETCO2
                      </th>
                      <th className='px-3 py-3 text-center text-xs font-medium w-[15%] uppercase'>
                        SpO2
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {entries.map((entry, index) => {
                      const formatTime = (time?: string) => {
                        if (!time) return "";
                        const [hour, minute] = time.split(":");
                        let h = parseInt(hour);
                        const ampm = h >= 12 ? "PM" : "AM";
                        h = h % 12 || 12;
                        return `${h}:${minute} ${ampm}`;
                      };

                      return (
                        <tr key={index} className='border-b border-slate-100'>
                          {/* Time */}
                          <td className='px-3 py-3'>
                            <div className='flex items-center gap-2'>
                              <input
                                type='time'
                                disabled={readOnly}
                                value={entry.time}
                                onChange={(e) => {
                                  const updated = [...entries];
                                  updated[index].time = e.target.value;
                                  setEntries(updated);
                                }}
                                className='bg-transparent text-xs outline-none text-[#1F2937] font-medium'
                              />
                            </div>
                          </td>

                          {/* Other Fields */}
                          {fields.map((field) => (
                            <td key={field} className='px-3 py-3'>
                              <input
                                type='text'
                                disabled={readOnly}
                                value={entry[field]}
                                onChange={(e) => {
                                  const updated = [...entries];
                                  updated[index][field] = e.target.value;
                                  setEntries(updated);
                                }}
                                className='w-full bg-transparent text-center text-sm outline-none text-slate-500'
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div>
                <label className='mb-1 block text-xs font-medium uppercase text-[#9CA3AF]'>
                  Time of Extubation
                </label>
                <input
                  type='text'
                  value={timeOfExtubation}
                  onChange={(e) => setTimeOfExtubation(e.target.value)}
                  disabled={readOnly}
                  className={`${inputBase} bg-[#E2E2E2] rounded-md border-0 focus:border-0 focus:ring-0`}
                />
              </div>

              <div>
                <label className='mb-1 block text-xs font-medium uppercase text-[#9CA3AF]'>
                  Time completion of surgery
                </label>
                <input
                  type='text'
                  value={timeCompletionOfSurgery}
                  onChange={(e) => setTimeCompletionOfSurgery(e.target.value)}
                  disabled={readOnly}
                  className={`${inputBase} bg-[#E2E2E2] rounded-md border-0 focus:border-0 focus:ring-0`}
                />
              </div>

              <div className='flex items-end gap-3'>
                {!readOnly && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleSubmit(false)}
                      disabled={readOnly || saveStatus === "saving"}
                      className='rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60'
                    >
                      Save draft
                    </button>
                    <button
                      type='button'
                      onClick={() => handleSubmit(true)}
                      disabled={readOnly || saveStatus === "saving"}
                      className='flex-1 rounded-md bg-[#EB5757] py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60'
                    >
                      End Surgery
                    </button>
                  </>
                )}
                {readOnly && (
                  <div className='w-full rounded-md bg-slate-200 py-3 text-center text-sm font-bold text-slate-600'>
                    Submitted
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
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
    <div
      className={`grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0 ${className}`}
    >
      <span className='text-[var(--accent-muted)]'>{label}</span>
      <span className='min-w-0 break-words font-medium text-slate-700'>
        {value}
      </span>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={() => !disabled && onChange?.(!value)}
      className={`h-5 w-10 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
        value ? "bg-[#80A6F0]" : "bg-slate-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div
        className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
}
