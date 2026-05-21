import { useCallback, useMemo, useState } from "react";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";

import type { AgendoCalendarDayRenderContext } from "../../../components/AgendoCalendarDay";
import { localDayKey, startOfLocalDay } from "../../../utils/bookingCalendar";
import { timeToMinutes } from "../../../utils/openingHours";
import { monthBoundsIsoLocal } from "../../../utils/monthCalendarGrid";
import { usePersonalCommitmentBookingsData } from "../fetch/usePersonalCommitmentBookingsData";

export type TimePickerTarget = "start" | "end" | null;

function hhmmToMs(date: Date, hhmm: string): number {
  const totalMinutes = timeToMinutes(hhmm) ?? 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
  ).getTime();
}

function hasTimeOverlap(
  commitmentStartMs: number,
  commitmentEndMs: number,
  bookingStartMs: number,
  bookingEndMs: number,
): boolean {
  return bookingStartMs < commitmentEndMs && bookingEndMs > commitmentStartMs;
}

export function useStaffPersonalCommitmentScreen(establishmentId: string) {
  const now = useMemo(() => new Date(), []);
  const todayStart = useMemo(() => startOfLocalDay(now), [now]);

  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => todayStart);
  const [startHHMM, setStartHHMM] = useState<string | null>(null);
  const [endHHMM, setEndHHMM] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [timePickerTarget, setTimePickerTarget] =
    useState<TimePickerTarget>(null);
  const [showOverlapAlert, setShowOverlapAlert] = useState(false);

  const viewYear = monthAnchor.getFullYear();
  const viewMonth = monthAnchor.getMonth();

  const { from, to } = useMemo(
    () => monthBoundsIsoLocal(viewYear, viewMonth),
    [viewMonth, viewYear],
  );

  const { data: bookingsRes } = usePersonalCommitmentBookingsData(
    establishmentId,
    from,
    to,
  );

  const bookings = useMemo(
    () =>
      (bookingsRes?.data ?? []).filter(
        (booking) => booking.status !== "CANCELLED",
      ),
    [bookingsRes?.data],
  );

  const todayKey = useMemo(() => localDayKey(todayStart), [todayStart]);
  const selectedDayKey = useMemo(
    () => localDayKey(selectedDate),
    [selectedDate],
  );

  const markedDates = useMemo((): MarkedDates => {
    return { [selectedDayKey]: { selected: true } };
  }, [selectedDayKey]);

  const calendarDayCtx = useMemo(
    (): AgendoCalendarDayRenderContext => ({
      variant: "booking",
      establishmentOpenOnLocalDay: () => true,
      now,
      selectedDate,
      todayStart,
    }),
    [now, selectedDate, todayStart],
  );

  const onDayPress = useCallback(
    (dayData: DateData) => {
      const picked = startOfLocalDay(
        new Date(dayData.year, dayData.month - 1, dayData.day),
      );
      if (picked.getTime() < todayStart.getTime()) {
        return;
      }
      setSelectedDate(picked);
    },
    [todayStart],
  );

  const onMonthChange = useCallback((dayData: DateData) => {
    setMonthAnchor(new Date(dayData.year, dayData.month - 1, 1));
  }, []);

  const onConfirmTime = useCallback(
    (hhmm: string) => {
      if (timePickerTarget === "start") {
        setStartHHMM(hhmm);
      } else if (timePickerTarget === "end") {
        setEndHHMM(hhmm);
      }
      setTimePickerTarget(null);
    },
    [timePickerTarget],
  );

  const timeError = useMemo(() => {
    if (!startHHMM || !endHHMM) {
      return null;
    }
    if ((timeToMinutes(endHHMM) ?? 0) <= (timeToMinutes(startHHMM) ?? 0)) {
      return "O horário de fim deve ser depois do início.";
    }
    return null;
  }, [startHHMM, endHHMM]);

  const canSave = Boolean(startHHMM && endHHMM && !timeError);

  const overlappingBookings = useMemo(() => {
    if (!startHHMM || !endHHMM || timeError) {
      return [];
    }
    const commitmentStartMs = hhmmToMs(selectedDate, startHHMM);
    const commitmentEndMs = hhmmToMs(selectedDate, endHHMM);
    return bookings.filter((booking) => {
      const bookingStartMs = new Date(booking.startsAt).getTime();
      const bookingEndMs = new Date(booking.endsAt).getTime();
      return hasTimeOverlap(
        commitmentStartMs,
        commitmentEndMs,
        bookingStartMs,
        bookingEndMs,
      );
    });
  }, [bookings, endHHMM, selectedDate, startHHMM, timeError]);

  const onSavePress = useCallback(() => {
    if (!canSave) {
      return;
    }
    if (overlappingBookings.length > 0) {
      setShowOverlapAlert(true);
      return;
    }
    // TODO: chamar API de bloqueio de agenda
  }, [canSave, overlappingBookings.length]);

  const onConfirmOverlap = useCallback(() => {
    setShowOverlapAlert(false);
    // TODO: chamar API de bloqueio de agenda
  }, []);

  return {
    calendarDayCtx,
    canSave,
    description,
    endHHMM,
    markedDates,
    now,
    onConfirmTime,
    onConfirmOverlap,
    onDayPress,
    onMonthChange,
    onSavePress,
    overlappingBookings,
    setDescription,
    setTimePickerTarget,
    showOverlapAlert,
    setShowOverlapAlert,
    startHHMM,
    timeError,
    timePickerTarget,
    todayKey,
    viewMonth,
    viewYear,
  };
}
