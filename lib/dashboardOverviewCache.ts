import type { DashboardOverviewPayload } from "@/components/DashboardOverviewCharts";

const STORAGE_PREFIX = "anesthetic.dashboard.overview.v1";
/** Charts aggregate data is fine to reuse for a few minutes (not real-time). */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

type CachedEnvelope = {
  savedAt: number;
  weekOf: string;
  payload: DashboardOverviewPayload;
};

function key(weekOf: string) {
  return `${STORAGE_PREFIX}:${weekOf}`;
}

export function readCachedOverview(
  weekOf: string,
  ttlMs: number = DEFAULT_TTL_MS,
): DashboardOverviewPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key(weekOf));
    if (!raw) return null;
    const env = JSON.parse(raw) as CachedEnvelope;
    if (!env || typeof env.savedAt !== "number" || !env.payload) return null;
    if (Date.now() - env.savedAt > ttlMs) {
      sessionStorage.removeItem(key(weekOf));
      return null;
    }
    return env.payload;
  } catch {
    return null;
  }
}

export function writeCachedOverview(
  weekOf: string,
  payload: DashboardOverviewPayload,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const env: CachedEnvelope = {
      savedAt: Date.now(),
      weekOf,
      payload,
    };
    sessionStorage.setItem(key(weekOf), JSON.stringify(env));
  } catch {
    // quota / private mode — ignore
  }
}
