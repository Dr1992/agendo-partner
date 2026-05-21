import type { ReactNode } from "react";

import type { MonthCalendarRenderDayArgs } from "../MonthCalendar/MonthCalendar";

import {
  AgendoCalendarDay,
  type AgendoCalendarDayProps,
  type AgendoCalendarDayRenderContext,
} from "./AgendoCalendarDay";

/**
 * Função única para passar a `MonthCalendar` `renderDay`; o contexto fixa o fluxo (reserva vs equipa).
 */
export function renderAgendoCalendarDay(
  args: MonthCalendarRenderDayArgs,
  ctx: AgendoCalendarDayRenderContext,
): ReactNode {
  const merged = { ...args, ...ctx } as AgendoCalendarDayProps;
  return <AgendoCalendarDay {...merged} />;
}
