/** Seg=0 … Dom=6 */
export const WEEKDAY_SHORT = [
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
  "Dom",
] as const;

export type DaySlot = {
  close: string;
  enabled: boolean;
  open: string;
};

export function createDefaultOpeningSchedule(): DaySlot[] {
  return Array.from({ length: 7 }, (_, i) =>
    i <= 4
      ? { enabled: true, open: "09:00", close: "18:00" }
      : { enabled: false, open: "09:00", close: "18:00" },
  );
}

export function cloneOpeningSchedule(schedule: DaySlot[]): DaySlot[] {
  return schedule.map((daySlot) => ({ ...daySlot }));
}

/**
 * Só dígitos → máscara `HH:MM` (máx. 4 dígitos). Usado em tempo real no teclado numérico.
 */
export function formatMaskedHHMM(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "").slice(0, 4);
  if (digitsOnly.length === 0) {
    return "";
  }
  let hh = digitsOnly.slice(0, 2);
  let mm = digitsOnly.slice(2, 4);
  if (hh.length === 2) {
    const hn = Number(hh);
    if (hn > 23) {
      hh = "23";
    }
  }
  if (mm.length === 1) {
    const tens = Number(mm[0]!);
    if (tens > 5) {
      mm = "5";
    }
  }
  if (mm.length === 2) {
    const mn = Number(mm);
    if (mn > 59) {
      mm = "59";
    }
  }
  if (digitsOnly.length <= 2) {
    return hh;
  }
  return `${hh}:${mm}`;
}

export function normalizeTimeInput(input: string): string {
  const normalizedInput = input.trim().replace(/\s/g, "");
  if (/^\d{1,2}:\d{2}$/.test(normalizedInput)) {
    const [hour, minute] = normalizedInput.split(":").map(Number);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }
  /** Um dígito nos minutos — interpreta como `0X` (ex.: `9:3` → `09:03`). */
  if (/^\d{1,2}:\d{1}$/.test(normalizedInput)) {
    const [hourRaw, minuteSingleDigitRaw] = normalizedInput.split(":");
    const hour = Number(hourRaw);
    const minuteSingleDigit = Number(minuteSingleDigitRaw);
    if (
      hour >= 0 &&
      hour <= 23 &&
      minuteSingleDigit >= 0 &&
      minuteSingleDigit <= 9
    ) {
      return `${String(hour).padStart(2, "0")}:0${minuteSingleDigit}`;
    }
  }
  if (/^\d{1,2}$/.test(normalizedInput)) {
    const hour = Number(normalizedInput);
    if (hour >= 0 && hour <= 23) {
      return `${String(hour).padStart(2, "0")}:00`;
    }
  }
  return input.trim();
}

export function timeToMinutes(hhmm: string): number | null {
  const match = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const min = Number(match[2]);
  if (hour > 23 || min > 59) {
    return null;
  }
  return hour * 60 + min;
}

function formatTimeBr(hhmm: string): string {
  const mins = timeToMinutes(hhmm);
  if (mins === null) {
    return hhmm;
  }
  const hour = Math.floor(mins / 60);
  const minute = mins % 60;
  return minute === 0
    ? `${hour}h`
    : `${hour}h${String(minute).padStart(2, "0")}`;
}

function dayRangeLabel(startIdx: number, endIdx: number): string {
  if (startIdx === endIdx) {
    return WEEKDAY_SHORT[startIdx];
  }
  return `${WEEKDAY_SHORT[startIdx]}–${WEEKDAY_SHORT[endIdx]}`;
}

/** Converte o grid semanal num texto único para a API (ex.: "Seg–Sex 9h–18h; Sáb 9h–13h"). */
export function scheduleToSummary(slots: DaySlot[]): string {
  const entries: { close: string; idx: number; open: string }[] = [];
  slots.forEach((s, idx) => {
    if (!s.enabled) {
      return;
    }
    const openMinutes = timeToMinutes(s.open);
    const closeMinutes = timeToMinutes(s.close);
    if (
      openMinutes === null ||
      closeMinutes === null ||
      openMinutes >= closeMinutes
    ) {
      return;
    }
    entries.push({ idx, open: s.open, close: s.close });
  });
  if (entries.length === 0) {
    return "";
  }

  type Run = {
    close: string;
    endIdx: number;
    open: string;
    startIdx: number;
  };
  const runs: Run[] = [];
  for (const e of entries) {
    const last = runs[runs.length - 1];
    if (
      last &&
      last.endIdx === e.idx - 1 &&
      last.open === e.open &&
      last.close === e.close
    ) {
      last.endIdx = e.idx;
    } else {
      runs.push({
        close: e.close,
        endIdx: e.idx,
        open: e.open,
        startIdx: e.idx,
      });
    }
  }

  return runs
    .map((r) => {
      const days = dayRangeLabel(r.startIdx, r.endIdx);
      const t0 = formatTimeBr(r.open);
      const t1 = formatTimeBr(r.close);
      return `${days} ${t0}–${t1}`;
    })
    .join("; ");
}

export function isOpeningScheduleValid(slots: DaySlot[]): boolean {
  const enabled = slots.filter((s) => s.enabled);
  if (enabled.length === 0) {
    return false;
  }
  for (const s of enabled) {
    const openMinutes = timeToMinutes(s.open);
    const closeMinutes = timeToMinutes(s.close);
    if (
      openMinutes === null ||
      closeMinutes === null ||
      openMinutes >= closeMinutes
    ) {
      return false;
    }
  }
  return true;
}

const WEEKDAY_BR_SHORT = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
] as const;

/**
 * Alinha disponibilidade do staff ao horário do estabelecimento (mesma regra do backend).
 * Retorna mensagem de erro ou `null` se ok / sem horário do local para comparar.
 */
export function validateStaffWithinEstablishment(
  staff: DaySlot[],
  establishment: DaySlot[] | undefined,
): string | null {
  if (!establishment || establishment.length !== 7) {
    return null;
  }
  if (!isOpeningScheduleValid(establishment)) {
    return null;
  }
  for (let i = 0; i < 7; i++) {
    const staffDay = staff[i]!;
    const establishmentDay = establishment[i]!;
    if (!staffDay.enabled) {
      continue;
    }
    if (!establishmentDay.enabled) {
      return `O estabelecimento não funciona em ${WEEKDAY_BR_SHORT[i]}. Desmarque este dia na sua disponibilidade ou peça ao dono ou ao gestor para ajustar o horário do local.`;
    }
    const staffOpenMinutes = timeToMinutes(staffDay.open);
    const staffCloseMinutes = timeToMinutes(staffDay.close);
    const establishmentOpenMinutes = timeToMinutes(establishmentDay.open);
    const establishmentCloseMinutes = timeToMinutes(establishmentDay.close);
    if (
      staffOpenMinutes === null ||
      staffCloseMinutes === null ||
      establishmentOpenMinutes === null ||
      establishmentCloseMinutes === null
    ) {
      return `Confira os horários em ${WEEKDAY_BR_SHORT[i]} (use formato HH:MM).`;
    }
    if (
      staffOpenMinutes < establishmentOpenMinutes ||
      staffCloseMinutes > establishmentCloseMinutes
    ) {
      return `Em ${WEEKDAY_BR_SHORT[i]}, sua disponibilidade (${staffDay.open}–${staffDay.close}) precisa ficar dentro do horário do estabelecimento (${establishmentDay.open}–${establishmentDay.close}).`;
    }
  }
  return null;
}
