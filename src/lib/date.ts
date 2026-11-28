/** Format an ISO date (YYYY-MM-DD) as "November 23, 2026". Fixed to UTC so output never shifts. */
export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
