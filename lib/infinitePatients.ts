"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Initial page size for lazy loading (backend caps at 100). */
export const PATIENT_PAGE_SIZE = 15;

export type PatientSummary = {
  id: string;
  patientName: string;
  patientId: string;
  age?: number;
  gender?: string;
  currentStage?: string;
  stageStatus?: string;
};

export type PatientPageJson = {
  content: PatientSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  hasNext: boolean;
  first: boolean;
};

function mergeUniqueById(
  prev: PatientSummary[],
  incoming: PatientSummary[],
): PatientSummary[] {
  const seen = new Set(prev.map((p) => p.id));
  const out = [...prev];
  for (const p of incoming) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

/**
 * Paginated patient list for the dashboard: loads first page, then more when the sentinel is visible.
 * Uses IntersectionObserver + a single in-flight guard (no duplicate requests).
 */
export function useInfinitePatients() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);

  const nextPageRef = useRef(0);
  const inFlightRef = useRef(false);
  const hasNextRef = useRef(true);
  const loadingRef = useRef(true);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    hasNextRef.current = hasNext;
  }, [hasNext]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  const loadPage = useCallback(async (page: number, reset: boolean) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/patients?page=${page}&size=${PATIENT_PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to load patients");
      const data: PatientPageJson = await res.json();
      const content = Array.isArray(data.content) ? data.content : [];
      setPatients((prev) => (reset ? content : mergeUniqueById(prev, content)));
      const hn = data.hasNext === true;
      setHasNext(hn);
      hasNextRef.current = hn;
      nextPageRef.current = page + 1;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading patients");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const reload = useCallback(() => {
    nextPageRef.current = 0;
    setPatients([]);
    setHasNext(true);
    hasNextRef.current = true;
    loadPage(0, true);
  }, [loadPage]);

  useEffect(() => {
    nextPageRef.current = 0;
    setPatients([]);
    setHasNext(true);
    hasNextRef.current = true;
    loadPage(0, true);
  }, [loadPage]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (!hasNextRef.current || loadingRef.current || loadingMoreRef.current)
          return;
        loadPage(nextPageRef.current, false);
      },
      { root: null, rootMargin: "120px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadPage, patients.length, hasNext]);

  return {
    patients,
    loading,
    loadingMore,
    error,
    hasNext,
    sentinelRef,
    reload,
  };
}

const FETCH_ALL_CHUNK = 100;

/** Loads every page for the current month (for screens that need the full list, e.g. prescription picker). */
export async function fetchAllPatientsCurrentMonth(): Promise<
  PatientSummary[]
> {
  const merged: PatientSummary[] = [];
  const seen = new Set<string>();
  let page = 0;
  let hasNext = true;
  while (hasNext) {
    const res = await fetch(
      `${API_BASE}/api/patients?page=${page}&size=${FETCH_ALL_CHUNK}`,
    );
    if (!res.ok) throw new Error("Failed to load patients");
    const data: PatientPageJson = await res.json();
    const content = Array.isArray(data.content) ? data.content : [];
    for (const p of content) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }
    hasNext = data.hasNext === true;
    page += 1;
  }
  return merged;
}
