"use client";

import DashboardUserBar from "@/components/DashboardUserBar";
import CalendarView from "./CalendarView";

export default function CalendarPage() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto p-6 md:p-8 lg:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-raleway text-2xl font-bold text-[#202224]">
          Calendar
        </h1>
        <DashboardUserBar />
      </header>
      <CalendarView />
    </div>
  );
}
