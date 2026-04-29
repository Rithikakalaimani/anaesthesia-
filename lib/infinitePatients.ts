"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

export type UseInfinitePatientsOptions = {
  /** Debounced text search; passed to backend as `q` (name / id / gender). */
  search?: string;
  /** Scroll container for infinite scroll (IntersectionObserver `root`). Must be the element that actually scrolls. */
  scrollRoot?: HTMLElement | null;
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

/** When present (reset fetch), use these so the URL `q` matches this search change even if refs lag by a frame. */
type FetchMeta = {
  query: string;
  epoch: number;
};

/**
 * Paginated patient list: loads first page, then more when the sentinel intersects the scroll root.
 */
export function useInfinitePatients(opts?: UseInfinitePatientsOptions) {
  const search = (opts?.search ?? "").trim();
  const scrollRoot = opts?.scrollRoot ?? null;

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
  const searchRef = useRef(search);
  const scrollRootRef = useRef(scrollRoot);
  /** Bumped on each `search` change so stale responses never overwrite list. */
  const searchEpochRef = useRef(0);
  const listFetchAbortRef = useRef<AbortController | null>(null);

  // Keep latest search on the ref every render (before effects / IO callbacks) to avoid stale `q` on "load more".
  searchRef.current = search;

  useEffect(() => {
    hasNextRef.current = hasNext;
  }, [hasNext]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);
  useEffect(() => {
    scrollRootRef.current = scrollRoot;
  }, [scrollRoot]);

  const loadPage = useCallback(
    async (page: number, reset: boolean, meta?: FetchMeta) => {
      if (!reset && inFlightRef.current) return;

      if (reset) {
        listFetchAbortRef.current?.abort();
        listFetchAbortRef.current = new AbortController();
      }

      inFlightRef.current = true;
      const requestEpoch = meta?.epoch ?? searchEpochRef.current;
      const q = (meta?.query ?? searchRef.current).trim();
      const signal = reset ? listFetchAbortRef.current?.signal : undefined;

      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("size", String(PATIENT_PAGE_SIZE));
        if (q) params.set("q", q);
        const res = await fetch(`${API_BASE}/api/patients?${params.toString()}`, {
          signal,
        });
        if (!res.ok) throw new Error("Failed to load patients");
        const data: PatientPageJson = await res.json();
        if (searchEpochRef.current !== requestEpoch) {
          return;
        }
        const content = Array.isArray(data.content) ? data.content : [];
        setPatients((prev) => (reset ? content : mergeUniqueById(prev, content)));
        const hn = data.hasNext === true;
        setHasNext(hn);
        hasNextRef.current = hn;
        nextPageRef.current = page + 1;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        if (searchEpochRef.current !== requestEpoch) {
          return;
        }
        setError(e instanceof Error ? e.message : "Error loading patients");
      } finally {
        if (searchEpochRef.current === requestEpoch) {
          inFlightRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const epoch = ++searchEpochRef.current;
    const query = search.trim();
    nextPageRef.current = 0;
    setPatients([]);
    setHasNext(true);
    hasNextRef.current = true;
    loadPage(0, true, { query, epoch });
  }, [search, loadPage]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const root = scrollRootRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (
          !hasNextRef.current ||
          loadingRef.current ||
          loadingMoreRef.current
        ) {
          return;
        }
        loadPage(nextPageRef.current, false);
      },
      {
        root: root ?? null,
        rootMargin: "160px",
        threshold: 0,
      },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadPage, patients.length, hasNext, scrollRoot, loading]);

  const reload = useCallback(() => {
    const epoch = ++searchEpochRef.current;
    const query = searchRef.current.trim();
    nextPageRef.current = 0;
    setPatients([]);
    setHasNext(true);
    hasNextRef.current = true;
    loadPage(0, true, { query, epoch });
  }, [loadPage]);

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

/** Loads every page for the current month (e.g. prescription picker). */
export async function fetchAllPatientsCurrentMonth(
  search?: string,
): Promise<PatientSummary[]> {
  const merged: PatientSummary[] = [];
  const seen = new Set<string>();
  let page = 0;
  let hasNext = true;
  const q = (search ?? "").trim();
  while (hasNext) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(FETCH_ALL_CHUNK));
    if (q) params.set("q", q);
    const res = await fetch(`${API_BASE}/api/patients?${params.toString()}`);
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
