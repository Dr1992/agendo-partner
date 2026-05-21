/**
 * Rótulo de duração para UI: sempre `XXhXX` (ex.: 165 min → `02h45`, 45 min → `00h45`).
 */
export function formatDurationMinutesLabel(totalMinutes: number): string {
  const clampedMinutes = Math.min(
    Math.max(Math.round(Number(totalMinutes) || 0), 0),
    24 * 60,
  );
  const hours = Math.floor(clampedMinutes / 60);
  const minutes = clampedMinutes % 60;
  return `${String(hours).padStart(2, "0")}h${String(minutes).padStart(2, "0")}`;
}
