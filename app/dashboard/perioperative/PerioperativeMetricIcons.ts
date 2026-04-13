/** Matches `PlotMetric` in PerioperativeChart — kept local to avoid circular imports. */
export type MetricIconKey =
  | "Heart Rate"
  | "Systolic"
  | "Diastolic"
  | "Temp"
  | "ETCO2"
  | "SpO2";

/** SVG markup for each metric; stroke/fill use `color` (metric line color). */
export function svgMarkupForMetric(metric: MetricIconKey, color: string): string {
  const c = color;
  switch (metric) {
    case "Heart Rate":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="8" height="8" stroke="${c}"/><circle cx="4.5" cy="4.5" r="2" stroke="${c}"/></svg>`;
    case "Systolic":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="8" height="8" stroke="${c}"/><path d="M6.45526 2.63636L4.84162 7H4.1598L2.54616 2.63636H3.27344L4.47798 6.11364H4.52344L5.72798 2.63636H6.45526Z" fill="${c}"/></svg>`;
    case "Diastolic":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8.5" y="8.5" width="8" height="8" transform="rotate(-180 8.5 8.5)" stroke="${c}"/><path d="M2.54474 6.36364L4.15838 2L4.8402 2L6.45384 6.36364H5.72656L4.52202 2.88636H4.47656L3.27202 6.36364L2.54474 6.36364Z" fill="${c}"/></svg>`;
    case "Temp":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="8.50391" width="8" height="8" transform="rotate(-90 0.5 8.50391)" stroke="${c}"/><path d="M2.6701 4.95455V4.5L6.32919 2.63636V3.36364L3.52237 4.71591L3.5451 4.67045V4.78409L3.52237 4.73864L6.32919 6.09091V6.81818L2.6701 4.95455Z" fill="${c}"/></svg>`;
    case "ETCO2":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="8.5" width="8" height="8" transform="rotate(-90 0.5 8.5)" stroke="${c}"/><path d="M1.18182 6.02095L3.60227 4.52095V4.4755L1.18182 2.9755L1.18182 2.14595L4.09091 3.9755L7 2.14595V2.9755L4.625 4.4755V4.52095L7 6.02095V6.8505L4.09091 4.9755L1.18182 6.8505L1.18182 6.02095Z" fill="${c}"/></svg>`;
    case "SpO2":
      return `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="8" height="8" stroke="${c}"/><circle cx="4.5" cy="4.5" r="2.5" fill="${c}"/></svg>`;
    default: {
      const _exhaustive: never = metric;
      return _exhaustive;
    }
  }
}

export function svgDataUrlForMetric(metric: MetricIconKey, color: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svgMarkupForMetric(metric, color),
  )}`;
}
