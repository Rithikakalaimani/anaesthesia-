"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SESSION_USER_KEY,
  type AnaesthesiaUser,
  parseSessionUser,
} from "@/lib/anaesthesiaAuth";

type Ctx = {
  user: AnaesthesiaUser | null;
  setSessionUser: (u: AnaesthesiaUser | null) => void;
  refresh: () => void;
};

const AnaesthesiaUserContext = createContext<Ctx | null>(null);

export function AnaesthesiaUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AnaesthesiaUser | null>(null);

  const refresh = useCallback(() => {
    setUser(parseSessionUser());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setSessionUser = useCallback((u: AnaesthesiaUser | null) => {
    if (typeof window === "undefined") return;
    if (u) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(u));
    } else {
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
    setUser(u);
  }, []);

  const value = useMemo(
    () => ({ user, setSessionUser, refresh }),
    [user, setSessionUser, refresh],
  );

  return (
    <AnaesthesiaUserContext.Provider value={value}>
      {children}
    </AnaesthesiaUserContext.Provider>
  );
}

export function useAnaesthesiaUser(): Ctx {
  const ctx = useContext(AnaesthesiaUserContext);
  if (!ctx) {
    throw new Error("useAnaesthesiaUser must be used within AnaesthesiaUserProvider");
  }
  return ctx;
}
