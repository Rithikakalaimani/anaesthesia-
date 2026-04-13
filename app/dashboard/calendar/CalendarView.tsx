"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseSessionUser } from "@/lib/anaesthesiaAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = ["10:30", "12:20", "15:30", "20:15"] as const;

export type CalendarScheduleDTO = {
  id: string;
  anaesthesiaId: string;
  date: string;
  title: string;
  description: string;
  timeSlot: string;
};

type BadgeItem = { number: string; width?: string };



function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatLongDate(iso: string): string {
  const [y, m, day] = iso.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCardDate(iso: string): string {
  const [y, m, day] = iso.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Normalize so API vs UI date strings always match (e.g. padding). */
function normalizeIsoDate(raw: string): string {
  const s = raw.trim();
  const parts = s.split("-").map((p) => p.trim());
  if (parts.length !== 3) return s;
  const y = Number(parts[0]);
  const mo = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !mo || !d) return s;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}


function buildBadgeColumns(count: number): BadgeItem[][] {
  if (count <= 0) return [];
  const nums: BadgeItem[] = Array.from({ length: count }, (_, i) => ({
    number: String(i + 1),
  }));
  const col0 = nums.filter((_, i) => i % 2 === 0);
  const col1 = nums.filter((_, i) => i % 2 === 1);
  const cols: BadgeItem[][] = [];
  if (col0.length) cols.push(col0);
  if (col1.length) cols.push(col1);
  return cols;
}

const MAX_VISIBLE_BADGES = 5;

function CalendarCell({
  date,
  badges = [],
  showMoreEllipsis = false,
  opacity = 1,
  isRed = false,
  roundedCorner,
  onClick,
}: {
  date: string;
  badges?: BadgeItem[][];
  showMoreEllipsis?: boolean;
  opacity?: number;
  isRed?: boolean;
  roundedCorner?: "tl" | "tr" | "bl" | "br";
  onClick?: () => void;
}) {
  const cornerClass =
    roundedCorner === "tl"
      ? "rounded-tl-[8px]"
      : roundedCorner === "tr"
        ? "rounded-tr-[8px]"
        : roundedCorner === "bl"
          ? "rounded-bl-[8px]"
          : roundedCorner === "br"
            ? "rounded-br-[8px]"
            : "";
  const borderClass = `relative min-h-[90px] w-full min-w-0 border border-[#d9d9d9] sm:min-h-[110px] lg:min-h-[125px] ${cornerClass}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${borderClass} ${onClick ? "cursor-pointer hover:bg-slate-50/80" : "cursor-default"} text-left`}
    >
      <div
        className={`flex h-full min-w-0 flex-col px-1 py-1.5 sm:px-2 sm:py-2 ${badges.length > 0 ? "justify-between" : ""}`}
      >
        <p
          className={`shrink-0 text-[10px] font-normal sm:text-xs ${opacity < 1 ? "text-[#7e7e7e]" : isRed ? "text-red-600" : "text-black"}`}
        >
          {date}
        </p>
        {badges.length > 0 && (
          <div className="flex min-w-0 items-end gap-0.5 sm:gap-1">
            {badges.map((column, colIdx) => (
              <div
                key={colIdx}
                className={`flex min-w-0 flex-col gap-0.5 sm:gap-1 ${column.length === 1 && column[0].width ? "h-[46px] justify-between" : ""}`}
              >
                {column.map((badge, badgeIdx) => (
                  <div
                    key={badgeIdx}
                    className="flex min-w-0 shrink-0 items-center justify-center rounded-md bg-[#9fbad8] px-1 py-0.5 text-[10px] font-medium text-black sm:px-2 sm:py-1 sm:text-xs"
                    style={badge.width ? { width: badge.width } : undefined}
                  >
                    {badge.number}
                  </div>
                ))}
              </div>
            ))}
            {showMoreEllipsis ? (
              <span
                className="shrink-0 pb-0.5 text-[10px] font-semibold leading-none text-[#6b7280] sm:text-xs"
                aria-hidden
              >
                ...
              </span>
            ) : null}
          </div>
        )}
      </div>
    </button>
  );
}

type CellMeta = {
  displayDate: string;
  isoDate: string;
  isCurrentMonth: boolean;
  opacity: number;
};

function generateCalendar(year: number, month: number): CellMeta[] {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = (firstDay.getDay() + 6) % 7;
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const cells: CellMeta[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthLastDate - i;
    const dt = new Date(year, month - 1, d);
    cells.push({
      displayDate: String(d).padStart(2, "0"),
      isoDate: toIsoLocal(dt),
      isCurrentMonth: false,
      opacity: 0.4,
    });
  }

  for (let d = 1; d <= lastDate; d++) {
    const dt = new Date(year, month, d);
    cells.push({
      displayDate: String(d).padStart(2, "0"),
      isoDate: toIsoLocal(dt),
      isCurrentMonth: true,
      opacity: 1,
    });
  }

  let nextD = 1;
  while (cells.length < 35) {
    const dt = new Date(year, month + 1, nextD);
    cells.push({
      displayDate: String(nextD).padStart(2, "0"),
      isoDate: toIsoLocal(dt),
      isCurrentMonth: false,
      opacity: 0.4,
    });
    nextD++;
  }

  return cells;
}

function CalendarGrid({
  year,
  month,
  countByIso,
  todayIso,
  onDayClick,
}: {
  year: number;
  month: number;
  countByIso: Map<string, number>;
  todayIso: string;
  onDayClick: (iso: string) => void;
}) {
  const cells = generateCalendar(year, month);

  return (
    <div className="grid w-full grid-cols-7">
      {Array.from({ length: 5 }).flatMap((_, rowIdx) =>
        cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, idx) => {
          const isTopRow = rowIdx === 0;
          const isBottomRow = rowIdx === 4;
          const roundedCorner =
            isTopRow && idx === 0
              ? "tl"
              : isTopRow && idx === 6
                ? "tr"
                : isBottomRow && idx === 0
                  ? "bl"
                  : isBottomRow && idx === 6
                    ? "br"
                    : undefined;

          const n = countByIso.get(cell.isoDate) ?? 0;
          const capped =
            cell.isCurrentMonth && n > 0 ? Math.min(n, MAX_VISIBLE_BADGES) : 0;
          const badges =
            capped > 0 ? buildBadgeColumns(capped) : [];
          const showMoreEllipsis = cell.isCurrentMonth && n > MAX_VISIBLE_BADGES;
          const isToday = cell.isoDate === todayIso;

          return (
            <CalendarCell
              key={`${cell.isoDate}-${rowIdx}-${idx}`}
              date={cell.displayDate}
              opacity={cell.opacity}
              badges={badges}
              showMoreEllipsis={showMoreEllipsis}
              isRed={isToday}
              roundedCorner={roundedCorner}
              onClick={
                cell.isCurrentMonth ? () => onDayClick(cell.isoDate) : undefined
              }
            />
          );
        }),
      )}
    </div>
  );
}

function MonthHeader({
  monthLabel,
  onPrev,
  onNext,
}: {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-md font-semibold text-black">{monthLabel}</p>
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onPrev}
          className="rounded p-1 text-[#242424] hover:bg-slate-100"
          aria-label="Previous month"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M5.25 10.5L8.75 7L5.25 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded p-1 text-[#242424] hover:bg-slate-100"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5.25 10.5L8.75 7L5.25 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DayHeadersContainer() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[10px] bg-[#f3f9ff]">
      <div className="grid h-10 w-full grid-cols-7 items-center">
        {DAYS.map((d) => (
          <span
            key={d}
            className="min-w-0 text-center text-[10px] font-semibold leading-tight text-[#232323] sm:text-sm"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function AppointmentCard({
  title,
  description,
  timeSlot,
  dateLabel,
}: {
  title: string;
  description: string;
  timeSlot: string;
  dateLabel: string;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} , ${year}`;
  };

  return (
    <div className='relative w-full max-w-none overflow-hidden rounded-lg border border-slate-200 bg-white/80 shadow-sm lg:max-w-[328px]'>
      <div className='flex flex-col gap-1.5 p-5'>
        <p className='text-sm font-semibold text-black'>{title}</p>

        {description ? (
          <p className='text-xs text-black line-clamp-3'>{description}</p>
        ) : null}
        <div className='flex items-center justify-between text-black'>
          <span className='text-xs'>{timeSlot}</span>
          <span className='text-xs'>{formatDate(dateLabel)}</span>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({
  open,
  isoDate,
  anaesthesiaId,
  onClose,
  onSaved,
}: {
  open: boolean;
  isoDate: string | null;
  anaesthesiaId: string;
  onClose: () => void;
  onSaved: (created: CalendarScheduleDTO) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [existing, setExisting] = useState<CalendarScheduleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDay = useCallback(async () => {
    if (!open || !isoDate || !anaesthesiaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/calendar/schedules/day?anaesthesiaId=${encodeURIComponent(anaesthesiaId)}&date=${encodeURIComponent(isoDate)}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Failed to load schedules");
      const data = (await res.json()) as CalendarScheduleDTO[];
      setExisting(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load schedules for this day.");
      setExisting([]);
    } finally {
      setLoading(false);
    }
  }, [open, isoDate, anaesthesiaId]);

  useEffect(() => {
    if (open && isoDate) {
      setTitle("");
      setDescription("");
      setTimeSlot(TIME_SLOTS[0]);
      loadDay();
    }
  }, [open, isoDate, loadDay]);

  const handleSave = async () => {
    if (!isoDate || !title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/calendar/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anaesthesiaId,
          date: isoDate,
          title: title.trim(),
          description: description.trim(),
          timeSlot,
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      const created = (await res.json()) as CalendarScheduleDTO;
      await loadDay();
      onSaved(created);
      setTitle("");
      setDescription("");
      setTimeSlot(TIME_SLOTS[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !isoDate) return null;

  const headerDate = `Date: ${formatLongDate(isoDate)}`;

  function ScheduleIcon() {
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M7.5 13.3333C8.20833 13.8583 9.07083 14.1666 10 14.1666C10.9292 14.1666 11.7917 13.8583 12.5 13.3333'
          stroke='#2F80ED'
          stroke-width='1.25'
          stroke-linecap='round'
        />
        <path
          d='M11.667 8.75C11.667 9.43989 12.0404 10 12.5003 10C12.9603 10 13.3337 9.43989 13.3337 8.75C13.3337 8.06011 12.9603 7.5 12.5003 7.5C12.0404 7.5 11.667 8.06011 11.667 8.75Z'
          fill='#2F80ED'
        />
        <path
          d='M6.66699 8.75C6.66699 9.43989 7.0404 10 7.50033 10C7.96025 10 8.33366 9.43989 8.33366 8.75C8.33366 8.06011 7.96025 7.5 7.50033 7.5C7.0404 7.5 6.66699 8.06011 6.66699 8.75Z'
          fill='#2F80ED'
        />
        <path
          d='M18.3337 11.6667C18.3337 14.8092 18.3337 16.3809 17.357 17.3567C16.3803 18.3326 14.8095 18.3334 11.667 18.3334M8.33366 18.3334C5.19116 18.3334 3.61949 18.3334 2.64366 17.3567C1.66783 16.3801 1.66699 14.8092 1.66699 11.6667M8.33366 1.66675C5.19116 1.66675 3.61949 1.66675 2.64366 2.64341C1.66783 3.62008 1.66699 5.19091 1.66699 8.33341M11.667 1.66675C14.8095 1.66675 16.3812 1.66675 17.357 2.64341C18.3328 3.62008 18.3337 5.19091 18.3337 8.33341'
          stroke='#2F80ED'
          stroke-width='1.25'
          stroke-linecap='round'
        />
      </svg>
    );
  }

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='schedule-modal-title'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
          <h2
            id='schedule-modal-title'
            className='text-lg font-semibold text-slate-800'
          >
            {<ScheduleIcon />}Schedule
          </h2>
          <p className='text-sm text-slate-600'>{headerDate}</p>
        </div>

        <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-xs font-medium text-[#64748B]'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-sm text-[#64748B]'
              placeholder='Title'
            />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-[#64748B]'>
              Description
            </label>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-sm text-[#64748B]'
              placeholder='Description'
            />
          </div>
        </div>

        <p className='mb-2 text-xs font-medium text-[#64748B]'>Time slot</p>
        <div className='mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setTimeSlot(t)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                timeSlot === t
                  ? "border-[#80A6F0] bg-[#80A6F01A] text-[#2F80ED]"
                  : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className='mb-2 text-sm  text-black'>
          Other schedules
        </p>
        <div className='mb-6 max-h-40 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/80 p-3'>
          {loading ? (
            <p className='text-sm text-slate-500'>Loading…</p>
          ) : existing.length === 0 ? (
            <p className='text-sm text-slate-500'>No other schedules yet.</p>
          ) : (
            <ul className='space-y-3'>
              {existing.map((s, i) => (
                <li
                  key={s.id}
                  className='flex flex-wrap items-start gap-2 border-b border-slate-200 pb-3 last:border-0 last:pb-0'
                >
                  <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#9fbad8] text-xs font-semibold text-white'>
                    {i + 1}
                  </span>
                  <div className='min-w-0 flex-1 flex flex-wrap gap-x-4 gap-y-1'>
                    <span className='text-sm font-medium text-slate-800'>
                      {s.title}
                    </span>
                    <span className='text-sm text-slate-600'>
                      {s.description || "—"}
                    </span>
                    <span className='text-sm text-slate-700'>{s.timeSlot}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p className='mb-3 text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
          >
            Close
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={saving}
            className='rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60'
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarView() {
 const today = new Date();
 const [year, setYear] = useState(today.getFullYear());
 const [month, setMonth] = useState(today.getMonth());
  const monthLabel = `${MONTHS[month]} ${year}`;

  const [anaesthesiaId, setAnaesthesiaId] = useState("");
  useEffect(() => {
    setAnaesthesiaId(parseSessionUser()?.anaesthesiaId ?? "");
  }, []);

  const [monthSchedules, setMonthSchedules] = useState<CalendarScheduleDTO[]>(
    [],
  );
  const [rangeSchedules, setRangeSchedules] = useState<CalendarScheduleDTO[]>(
    [],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  /** Client-only “today / tomorrow” so SSR vs local TZ never mismatches the reserved list. */
  const [dayRange, setDayRange] = useState<{
    today: string;
    tomorrow: string;
  } | null>(null);
  useEffect(() => {
    const now = new Date();
    setDayRange({
      today: toIsoLocal(now),
      tomorrow: toIsoLocal(addDays(now, 1)),
    });
  }, []);

  const todayIsoForGrid = dayRange?.today ?? toIsoLocal(new Date());

  const countByIso = useMemo(() => {
    const m = new Map<string, number>();
    monthSchedules.forEach((s) => {
      m.set(s.date, (m.get(s.date) ?? 0) + 1);
    });
    return m;
  }, [monthSchedules]);

  const fetchMonth = useCallback(async (): Promise<void> => {
    if (!anaesthesiaId) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/calendar/schedules?anaesthesiaId=${encodeURIComponent(anaesthesiaId)}&year=${year}&month=${month}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as CalendarScheduleDTO[];
      setMonthSchedules(Array.isArray(data) ? data : []);
    } catch {
      setMonthSchedules([]);
    }
  }, [anaesthesiaId, year, month]);

  const fetchTodayTomorrow = useCallback(async (): Promise<void> => {
    if (!anaesthesiaId || !dayRange) return;
    const from = dayRange.today;
    const to = dayRange.tomorrow;
    try {
      const res = await fetch(
        `${API_BASE}/api/calendar/schedules/range?anaesthesiaId=${encodeURIComponent(anaesthesiaId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as CalendarScheduleDTO[];
      setRangeSchedules(Array.isArray(data) ? data : []);
    } catch {
      setRangeSchedules([]);
    }
  }, [anaesthesiaId, dayRange]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  useEffect(() => {
    fetchTodayTomorrow();
  }, [fetchTodayTomorrow]);

  const refreshAll = useCallback(
    async (created?: CalendarScheduleDTO) => {
      await Promise.all([fetchMonth(), fetchTodayTomorrow()]);
      if (!created?.id || !dayRange) return;
      const d = normalizeIsoDate(created.date);
      const t = normalizeIsoDate(dayRange.today);
      const tm = normalizeIsoDate(dayRange.tomorrow);
      if (d !== t && d !== tm) return;
      setRangeSchedules((prev) => {
        if (prev.some((x) => x.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => {
          const c = a.date.localeCompare(b.date);
          if (c !== 0) return c;
          return (a.timeSlot || "").localeCompare(b.timeSlot || "");
        });
      });
    },
    [fetchMonth, fetchTodayTomorrow, dayRange],
  );

  const todayItems = useMemo(() => {
    if (!dayRange) return [];
    const t = normalizeIsoDate(dayRange.today);
    return rangeSchedules.filter(
      (s) => normalizeIsoDate(s.date) === t,
    );
  }, [rangeSchedules, dayRange]);

  const tomorrowItems = useMemo(() => {
    if (!dayRange) return [];
    const tm = normalizeIsoDate(dayRange.tomorrow);
    return rangeSchedules.filter(
      (s) => normalizeIsoDate(s.date) === tm,
    );
  }, [rangeSchedules, dayRange]);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const openModal = (iso: string) => {
    setSelectedIso(iso);
    setModalOpen(true);
  };

  if (!anaesthesiaId) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Sign in with an account that has an <strong>anaesthesiaId</strong> to
        use the calendar schedules.
      </p>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 p-2 font-sans lg:flex-row lg:items-start lg:gap-10">
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[rgba(35,35,35,0.1)] bg-white p-3 shadow-sm sm:p-5">
        <div className="flex flex-col gap-5">
          <MonthHeader
            monthLabel={monthLabel}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <div className="flex min-w-0 flex-col gap-4">
            <DayHeadersContainer />
            <div className="w-full min-w-0">
              <CalendarGrid
                year={year}
                month={month}
                countByIso={countByIso}
                todayIso={todayIsoForGrid}
                onDayClick={openModal}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 shrink-0 flex-col gap-3 lg:w-[250px]">
        <p className="text-md font-semibold text-black">RESERVED LIST</p>
        <div className="h-px w-full bg-[#f7f7f7]" />
        <div className="w-full max-h-[min(60vh,520px)] overflow-y-auto pr-1">
          <p className="mb-3 text-base font-normal text-black">Today</p>
          <div className="flex flex-col gap-5">
            {todayItems.length === 0 ? (
              <p className="text-xs text-slate-500">No schedules.</p>
            ) : (
              todayItems.map((item) => (
                <AppointmentCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  timeSlot={item.timeSlot}
                  dateLabel={formatCardDate(item.date)}
                />
              ))
            )}
          </div>
          <div className="my-4 h-px w-full bg-[#f7f7f7]" />
          <p className="mb-3 text-base font-normal text-black">Tomorrow</p>
          <div className="flex flex-col gap-5">
            {tomorrowItems.length === 0 ? (
              <p className="text-xs text-slate-500">No schedules.</p>
            ) : (
              tomorrowItems.map((item) => (
                <AppointmentCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  timeSlot={item.timeSlot}
                  dateLabel={formatCardDate(item.date)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ScheduleModal
        open={modalOpen}
        isoDate={selectedIso}
        anaesthesiaId={anaesthesiaId}
        onClose={() => {
          setModalOpen(false);
          setSelectedIso(null);
        }}
        onSaved={refreshAll}
      />
    </div>
  );
}
