"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSessionUser } from "@/lib/anaesthesiaAuth";
import {
  SidebarCalendarIcon,
  SidebarHomeIcon,
  SidebarPatientsIcon,
  SidebarPrescriptionIcon,
} from "@/components/SidebarNavIcons";

const navItems = [
  { href: "/dashboard", label: "Home", icon: SidebarHomeIcon },
  { href: "/dashboard/patients", label: "Patients", icon: SidebarPatientsIcon },
  { href: "/dashboard/calendar", label: "Calendar", icon: SidebarCalendarIcon },
  {
    href: "/dashboard/prescription",
    label: "Prescription",
    icon: SidebarPrescriptionIcon,
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSessionUser();
    router.push("/login");
  }

  return (
    <aside
      className='font-raleway flex h-full w-[269px] lg:w-[200px] xl:w-[269px] shrink-0 flex-col overflow-hidden rounded-3xl lg:rounded-[40px] xl:rounded-[59px] border-[1.5px] border-white'
      style={{
        background: "rgba(245,245,245,0.23)",
        backdropFilter: "blur(11.2px)",
        WebkitBackdropFilter: "blur(11.2px)",
      }}
    >
      <div className='flex items-center justify-between border-b border-white/30 px-10 py-5 lg:px-6 lg:py-4 xl:px-10 xl:py-5'>
        <img
          src='/assets/Logo.png'
          alt='XO Labs Anaesthesia'
          className='h-20 lg:h-14 xl:h-20 w-auto object-contain object-left'
        />
        {/* Close button – only shown in mobile overlay */}
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            className='lg:hidden rounded-lg p-1.5 hover:bg-white/50 transition-colors'
            aria-label='Close menu'
          >
            <svg
              className='h-5 w-5 text-slate-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18 18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-1 px-3 py-5 lg:py-3 xl:py-5'>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href === "/dashboard/patients" &&
              pathname.startsWith("/dashboard/patients"));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 lg:py-2.5 xl:py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-white text-slate-800"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
              }`}
            >
              <Icon className='shrink-0' />
              {label}
            </Link>
          );
        })}
      </div>
      <div className='border-t border-white/30 p-10 lg:p-6 xl:p-10'>
        <button
          type='button'
          onClick={handleLogout}
          className='w-full rounded-xl bg-slate-600 px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700'
        >
          LOG OUT
        </button>
      </div>
    </aside>
  );
}
