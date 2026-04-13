"use client";

import { AnaesthesiaUserProvider } from "@/contexts/AnaesthesiaUserContext";

export default function ClientDashboardProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnaesthesiaUserProvider>{children}</AnaesthesiaUserProvider>;
}
