/** Utilitários para calendário de reserva (timezone local). */

import type { DaySlot } from "./openingHours";
import { createDefaultOpeningSchedule } from "./openingHours";

export function startOfLocalDay(d: Date): Date {
  const startDate = new Date(d);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
}

export function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function localDayKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoToLocalDate(iso: string): Date {
  return new Date(iso);
}

export function monthLabelPt(year: number, monthIndex: number): string {
  const monthStart = new Date(year, monthIndex, 1);
  const raw = monthStart.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Seg=0 … Dom=6 — alinhado ao grid do estabelecimento e ao backend. */
export function weekdayIndexMon0(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** `openingSchedule` com 7 dias do GET; senão assume o mesmo default que o backend na geração de slots. */
export function isEstablishmentOpenOnLocalDay(
  date: Date,
  schedule: DaySlot[] | undefined,
): boolean {
  const days =
    schedule?.length === 7 ? schedule : createDefaultOpeningSchedule();
  const rule = days[weekdayIndexMon0(date)];
  return Boolean(rule?.enabled);
}
