"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='relative box-border flex h-svh max-h-svh min-h-0 w-full justify-center overflow-hidden bg-[#D4DEEA] p-2 lg:p-3 xl:p-4'>
      <div className='pointer-events-none fixed inset-y-0 left-0 z-0 w-1/2 overflow-hidden'>
        {/* Image */}
        <div
          className='h-full w-full'
          style={{
            backgroundImage: "url('/assets/bg2.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Outer glass container */}
      <div
        className='relative z-10 flex h-full min-h-0 w-full max-w-full gap-3 rounded-3xl border-[1.5px] border-white p-2 shadow-xl lg:rounded-[59px] lg:p-3'
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(11.2px)",
          WebkitBackdropFilter: "blur(11.2px)",
        }}
      >
        {/* Desktop sidebar */}
        <div className='hidden lg:flex shrink-0'>
          <Sidebar />
        </div>

        {/* Mobile */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <div
              className='absolute inset-0 bg-black/30'
              onClick={() => setMobileOpen(false)}
            />
            <div className='relative z-10 ml-3 mt-3 mb-3 h-[calc(100vh-1.5rem)]'>
              <Sidebar onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content: mobile toolbar reserves space so the hamburger never overlaps page titles */}
        <main className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl lg:rounded-[59px] bg-white shadow-sm'>
          <div className='flex shrink-0 items-center px-4 pt-3 pb-2 lg:hidden'>
            <button
              type='button'
              onClick={() => setMobileOpen(true)}
              className='rounded-xl bg-slate-50 p-2.5 shadow-sm ring-1 ring-slate-200/80'
              aria-label='Open menu'
            >
              <svg
                className='h-5 w-5 text-slate-700'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>
          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-auto lg:overflow-x-hidden'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
