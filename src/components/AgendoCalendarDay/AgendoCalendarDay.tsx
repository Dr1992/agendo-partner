import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import type { MonthCalendarRenderDayArgs } from "../MonthCalendar/MonthCalendar";
import { useAppTheme } from "../../hooks/useAppTheme";
import { sameLocalDay, startOfLocalDay } from "../../utils/bookingCalendar";

import { getAgendoCalendarDayStyles } from "./styles";

export type AgendoCalendarDayRenderContext =
  | {
      variant: "booking";
      establishmentOpenOnLocalDay: (date: Date) => boolean;
      now: Date;
      selectedDate: Date;
      todayStart: Date;
    }
  | {
      variant: "staff";
      bookingDates: Set<string>;
      selectedKey: string | null;
      todayKey: string;
    };

export type AgendoCalendarDayProps = MonthCalendarRenderDayArgs &
  AgendoCalendarDayRenderContext;

/**
 * Célula de dia partilhada entre reserva (cliente) e agenda do colaborador.
 */
export function AgendoCalendarDay(props: AgendoCalendarDayProps) {
  const { date, dayKey, onPress, state } = props;
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const calendarStyles = useMemo(
    () => getAgendoCalendarDayStyles(theme),
    [theme],
  );
  const dayRing = calendarStyles.dayRing;

  if (props.variant === "booking") {
    const { establishmentOpenOnLocalDay, now, selectedDate, todayStart } =
      props;
    const dayStart = startOfLocalDay(date);
    const dayStartMs = dayStart.getTime();
    const todayStartMs = startOfLocalDay(todayStart).getTime();
    const isBeforeToday = dayStartMs < todayStartMs;
    const isOutOfMonth = state === "disabled" || state === "inactive";
    const isPastDay = isBeforeToday || isOutOfMonth;
    const isClosedDay = !establishmentOpenOnLocalDay(date);
    const isDisabled = isPastDay || isClosedDay;
    const isClosedNotPast = isClosedDay && !isPastDay;
    const isSelected = sameLocalDay(date, selectedDate);
    const isToday = sameLocalDay(date, now);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          selected: isSelected,
        }}
        disabled={isDisabled}
        style={calendarStyles.booking.bookingCalendarDay}
        onPress={onPress}
      >
        <View
          style={[
            dayRing.circle,
            (isPastDay || isClosedNotPast) && dayRing.circlePast,
            !isPastDay &&
              isToday &&
              !isSelected &&
              !isClosedDay &&
              dayRing.circleToday,
            isSelected && dayRing.circleSelected,
          ]}
        >
          <Text
            style={[
              dayRing.dayNum,
              (isPastDay || isClosedNotPast) && dayRing.dayNumMuted,
              isSelected && dayRing.dayNumSelected,
            ]}
          >
            {date.getDate()}
          </Text>
        </View>
      </Pressable>
    );
  }

  const { bookingDates, selectedKey, todayKey } = props;
  const has = bookingDates.has(dayKey);
  const sel = selectedKey === dayKey;
  const isToday = dayKey === todayKey;

  return (
    <Pressable
      accessibilityLabel={
        has
          ? t("agendoCalendarDay.dayWithBookingsLabel", { day: date.getDate() })
          : t("agendoCalendarDay.dayLabel", { day: date.getDate() })
      }
      accessibilityRole="button"
      accessibilityState={{ selected: sel }}
      style={({ pressed }) => [
        calendarStyles.staff.dayCell,
        has && calendarStyles.staff.dayCellHasBooking,
        pressed && calendarStyles.staff.dayPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          dayRing.circle,
          !sel && isToday && dayRing.circleToday,
          sel && dayRing.circleSelected,
        ]}
      >
        <Text
          style={[
            dayRing.dayNum,
            has &&
              theme.scheme === "dark" &&
              calendarStyles.staff.dayNumStaffHasBooking,
            !has && !sel && dayRing.dayNumMuted,
            sel && dayRing.dayNumSelected,
          ]}
        >
          {date.getDate()}
        </Text>
      </View>
    </Pressable>
  );
}
