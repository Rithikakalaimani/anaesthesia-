export const SESSION_USER_KEY = "anaesthesiaUser";

export type AnaesthesiaUser = {
  id: string;
  /** Unique business id (same as API `anaesthesiaId`). */
  anaesthesiaId: string;
  name: string;
  age: number | null;
  role: string;
  username: string;
};

export function parseSessionUser(): AnaesthesiaUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<AnaesthesiaUser>;
    if (!o?.id || !o?.username || !o?.name) return null;
    const anaesthesiaId =
      o.anaesthesiaId != null && String(o.anaesthesiaId).trim() !== ""
        ? String(o.anaesthesiaId).trim()
        : null;
    if (!anaesthesiaId) return null;
    return {
      id: String(o.id),
      anaesthesiaId,
      name: String(o.name),
      username: String(o.username),
      role: o.role != null ? String(o.role) : "",
      age: typeof o.age === "number" ? o.age : o.age != null ? Number(o.age) : null,
    };
  } catch {
    return null;
  }
}

export function clearSessionUser(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_USER_KEY);
}
