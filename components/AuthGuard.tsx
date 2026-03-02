"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const AUTH_KEY = "auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const auth = sessionStorage.getItem(AUTH_KEY);
    if (!auth && pathname?.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
