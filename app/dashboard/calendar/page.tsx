"use client";

import CalendarView from "./CalendarView";

export default function CalendarPage() {
  return (
    <div className="min-h-full p-6 md:p-8 lg:p-10">
      <h1 className="mb-8 text-2xl font-bold text-[#202224]">Calendar</h1>
      <CalendarView />
    </div>
  );
}
