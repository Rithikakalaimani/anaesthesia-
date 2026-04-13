/**
 * Dashboard content lives in <main class="overflow-y-auto"> (see DashboardShell).
 * window.scrollTo does not move that pane; use this after save actions.
 */
export function scrollDashboardMainToTop() {
  if (typeof document === "undefined") return;
  const main = document.querySelector("main.overflow-y-auto");
  if (main instanceof HTMLElement) {
    main.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
