/** Shared anaesthesia plan options used in Pre-Anaesthetic and Perioperative stages */
export const ANAESTHESIA_PLAN_OPTIONS = [
  "General",
  "Regional",
  "Local",
  "Sedation",
] as const;

export type AnaesthesiaPlanType = (typeof ANAESTHESIA_PLAN_OPTIONS)[number];
