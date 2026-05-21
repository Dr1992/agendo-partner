function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Ex.: `30/04/2026 às 13:00` (fuso local do dispositivo). */
export function formatSlotDateTimePt(iso: string): string {
  const slotDate = new Date(iso);
  const date = `${pad2(slotDate.getDate())}/${pad2(slotDate.getMonth() + 1)}/${slotDate.getFullYear()}`;
  const time = `${pad2(slotDate.getHours())}:${pad2(slotDate.getMinutes())}`;
  return `${date} às ${time}`;
}
