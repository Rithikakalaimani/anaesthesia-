"use client";

import { useState } from "react";

/* Calendar layout and reserved list */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type BadgeItem = { number: string; width?: string };

function CalendarCell({
  date,
  badges = [],
  opacity = 1,
  isRed = false,
  roundedCorner,
}: {
  date: string;
  badges?: BadgeItem[][];
  opacity?: number;
  isRed?: boolean;
  roundedCorner?: "tl" | "tr" | "bl" | "br";
}) {
  const cornerClass =
    roundedCorner === "tl"
      ? "rounded-tl-[10px]"
      : roundedCorner === "tr"
        ? "rounded-tr-[10px]"
        : roundedCorner === "bl"
          ? "rounded-bl-[10px]"
          : roundedCorner === "br"
            ? "rounded-br-[10px]"
            : "";
  const borderClass = `relative h-[125px] w-[103px] shrink-0 border border-[#d9d9d9] ${cornerClass}`;

  return (
    <div className={borderClass} style={{ opacity }}>
      <div
        className={`flex h-full flex-col px-2 py-3.5 ${badges.length > 0 ? "justify-between" : ""}`}
      >
        <p
          className={`shrink-0 text-sm font-normal ${opacity < 1 ? "text-[#7e7e7e]" : isRed ? "text-red-600" : "text-black"}`}
        >
          {date}
        </p>
        {badges.length > 0 && (
          <div className="flex gap-1">
            {badges.map((column, colIdx) => (
              <div
                key={colIdx}
                className={`flex flex-col gap-1 ${column.length === 1 && column[0].width ? "h-[46px] justify-between" : ""}`}
              >
                {column.map((badge, badgeIdx) => (
                  <div
                    key={badgeIdx}
                    className="flex shrink-0 items-center justify-center rounded-md bg-[#9fbad8] px-2 py-1 text-xs font-medium text-black"
                    style={badge.width ? { width: badge.width } : undefined}
                  >
                    {badge.number}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarGrid() {
  return (
    <div className="flex flex-col">
      {/* Week 1 */}
      <div className="flex -mr-px -mb-px">
        <CalendarCell date="31" opacity={0.4} roundedCorner="tl" />
        <CalendarCell date="01" badges={[[{ number: "03" }]]} />
        <CalendarCell date="02" badges={[[{ number: "01", width: "32px" }]]} />
        <CalendarCell date="03" />
        <CalendarCell
          date="04"
          badges={[[{ number: "02" }, { number: "03" }]]}
        />
        <CalendarCell
          date="05"
          badges={[
            [
              { number: "01", width: "32px" },
              { number: "03" },
            ],
            [{ number: "02" }],
          ]}
        />
        <CalendarCell date="06" badges={[[{ number: "03" }]]} roundedCorner="tr" />
      </div>
      {/* Week 2 */}
      <div className="flex -mr-px -mb-px">
        <CalendarCell date="07" badges={[[{ number: "02" }, { number: "03" }]]} />
        <CalendarCell date="08" />
        <CalendarCell
          date="09"
          badges={[
            [
              { number: "01", width: "32px" },
              { number: "03" },
            ],
            [{ number: "02" }],
          ]}
        />
        <CalendarCell date="10" badges={[[{ number: "03" }]]} />
        <CalendarCell date="11" isRed />
        <CalendarCell date="12" badges={[[{ number: "02" }, { number: "03" }]]} />
        <CalendarCell
          date="13"
          badges={[[{ number: "01", width: "32px" }], [{ number: "03" }]]}
        />
      </div>
      {/* Week 3 */}
      <div className="flex -mr-px -mb-px">
        <CalendarCell
          date="14"
          badges={[[{ number: "01", width: "32px" }], [{ number: "02" }]]}
        />
        <CalendarCell date="15" badges={[[{ number: "03" }]]} />
        <CalendarCell date="16" badges={[[{ number: "02" }, { number: "03" }]]} />
        <CalendarCell date="17" isRed />
        <CalendarCell
          date="18"
          badges={[
            [
              { number: "01", width: "32px" },
              { number: "03" },
            ],
            [{ number: "02" }],
          ]}
        />
        <CalendarCell date="19" />
        <CalendarCell
          date="20"
          badges={[
            [
              { number: "01", width: "32px" },
              { number: "03" },
            ],
            [{ number: "02" }],
          ]}
        />
      </div>
      {/* Week 4 */}
      <div className="flex -mr-px -mb-px">
        <CalendarCell
          date="21"
          badges={[[{ number: "01", width: "32px" }], [{ number: "03" }]]}
        />
        <CalendarCell date="22" />
        <CalendarCell
          date="23"
          badges={[[{ number: "01", width: "32px" }], [{ number: "03" }]]}
        />
        <CalendarCell date="24" badges={[[{ number: "02" }, { number: "03" }]]} />
        <CalendarCell date="25" />
        <CalendarCell
          date="26"
          badges={[
            [
              { number: "01", width: "32px" },
              { number: "03" },
            ],
            [{ number: "02" }],
          ]}
        />
        <CalendarCell date="27" />
      </div>
      {/* Week 5 */}
      <div className="flex -mr-px">
        <CalendarCell date="28" roundedCorner="bl" />
        <CalendarCell date="29" badges={[[{ number: "01", width: "32px" }]]} />
        <CalendarCell date="30" badges={[[{ number: "02" }]]} />
        <CalendarCell date="01" opacity={0.4} />
        <CalendarCell date="02" opacity={0.4} />
        <CalendarCell date="03" opacity={0.4} />
        <CalendarCell date="04" opacity={0.4} roundedCorner="br" />
      </div>
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
      <p className="text-lg font-semibold text-black">{monthLabel}</p>
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
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
      </div>
    </div>
  );
}

const GRID_WIDTH = 7 * 103; /* 721px – 7 cells × 103px */

function DayHeadersContainer() {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[10px] bg-[#f3f9ff]"
      style={{ width: GRID_WIDTH }}
    >
      <div className="flex h-10 items-center justify-between px-2">
        {DAYS.map((d) => (
          <span
            key={d}
            className="w-[103px] shrink-0 text-center text-[15px] font-semibold text-[#232323]"
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
  time,
  date,
}: {
  title: string;
  time: string;
  date: string;
}) {
  return (
    <div className="relative h-[85px] w-full max-w-[328px] overflow-hidden rounded-lg border border-slate-200 bg-white/80 shadow-sm">
      <div className="flex flex-col gap-1.5 p-5">
        <p className="text-lg font-semibold text-black">{title}</p>
        <div className="flex items-center gap-4 text-[#7a7d84]">
          <span className="text-sm">{time}</span>
          <span className="text-xs">{date}</span>
        </div>
      </div>
    </div>
  );
}

const TODAY_ITEMS = [
  { title: "Patient Name - TKR", time: "10:00am - 11:00am", date: "Nov 01, 2022" },
  { title: "Consultation", time: "10:00am - 11:00am", date: "Nov 01, 2022" },
  { title: "Surgery 1", time: "10:00am - 11:00am", date: "Nov 01, 2022" },
];

const TOMORROW_ITEMS = [
  { title: "Surgery 2", time: "10:00am - 11:00am", date: "Nov 02, 2022" },
  {
    title: "Session with Patient",
    time: "10:00am - 11:00am",
    date: "Nov 02, 2022",
  },
];

function ReservedList() {
  return (
    <div className="flex w-full max-w-[328px] shrink-0 flex-col gap-4">
      <p className="text-lg font-semibold text-black">RESERVED LIST</p>
      <div className="h-px w-full bg-[#f7f7f7]" />
      <p className="text-base font-normal text-black">Today</p>
      <div className="flex flex-col gap-5">
        {TODAY_ITEMS.map((item, i) => (
          <AppointmentCard
            key={i}
            title={item.title}
            time={item.time}
            date={item.date}
          />
        ))}
      </div>
      <div className="h-px w-full bg-[#f7f7f7]" />
      <p className="text-base font-normal text-black">Tomorrow</p>
      <div className="flex flex-col gap-5">
        {TOMORROW_ITEMS.map((item, i) => (
          <AppointmentCard
            key={i}
            title={item.title}
            time={item.time}
            date={item.date}
          />
        ))}
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
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(10); // 0-indexed: November

  const monthLabel = `${MONTHS[month]} ${year}`;

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

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      {/* Calendar section – constrained so it does not overlap reserved list */}
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[rgba(35,35,35,0.1)] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5">
          <MonthHeader
            monthLabel={monthLabel}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <div className="flex flex-col gap-4 overflow-x-auto">
            <DayHeadersContainer />
            <div style={{ width: GRID_WIDTH }} className="shrink-0">
              <CalendarGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Reserved list – right column, never shrunk */}
      <ReservedList />
    </div>
  );
}
