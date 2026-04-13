"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { parseSessionUser } from "@/lib/anaesthesiaAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname?.startsWith("/dashboard")) return;
    const user = parseSessionUser();
    if (!user) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
