/** Local calendar date as `yyyy-MM-dd` for HTML `<input type="date" />`. */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Normalizes pre-anaesthetic scheduled date (ISO or common text formats) to
 * perioperative `date` format `dd-MM-yy` used in the form and backend.
 */
export function toPerioperativeDdMmYy(scheduled: string): string {
  const s = scheduled.trim();
  if (!s) return "";

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (iso) {
    const y = parseInt(iso[1], 10);
    const m = parseInt(iso[2], 10);
    const d = parseInt(iso[3], 10);
    const yy = y % 100;
    return `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${String(yy).padStart(2, "0")}`;
  }

  const dmyLong = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(s);
  if (dmyLong) {
    const d = parseInt(dmyLong[1], 10);
    const m = parseInt(dmyLong[2], 10);
    const y = parseInt(dmyLong[3], 10);
    const yy = y % 100;
    return `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${String(yy).padStart(2, "0")}`;
  }

  const dmyShort = /^(\d{1,2})-(\d{1,2})-(\d{2})$/.exec(s);
  if (dmyShort) {
    return `${String(parseInt(dmyShort[1], 10)).padStart(2, "0")}-${String(parseInt(dmyShort[2], 10)).padStart(2, "0")}-${dmyShort[3]}`;
  }

  return s;
}
