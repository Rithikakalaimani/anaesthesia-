"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/patients", label: "Patients", icon: PatientsIcon },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/dashboard/prescription", label: "Prescription", icon: PrescriptionIcon },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function PatientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function PrescriptionIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.318H4.517c-1.718 0-2.299-2.086-1.067-3.318L5 14.5" />
    </svg>
  );
}

const AUTH_KEY = "auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_KEY);
    }
    router.push("/login");
  }

  return (
    <aside
      className="flex h-full w-[269px] shrink-0 flex-col overflow-hidden rounded-l-[59px] border-r-[1.5px] border-white"
      style={{
        background: "rgba(245,245,245,0.23)",
        backdropFilter: "blur(11.2px)",
        WebkitBackdropFilter: "blur(11.2px)",
      }}
    >
      <div className="flex flex-col border-b border-slate-200/80 px-5 py-5">
        <img
          src="/assets/Logo.png"
          alt="XO Labs Anaesthesia"
          className="h-20 w-auto object-contain object-left"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 py-5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === "/dashboard/patients" && pathname.startsWith("/dashboard/patients"));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--header-bg)] text-slate-700"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-200/80 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl bg-slate-500 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-600"
        >
          LOG OUT
        </button>
      </div>
    </aside>
  );
}
