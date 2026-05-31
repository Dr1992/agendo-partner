import { Ionicons } from "@expo/vector-icons";
import { memo, type ComponentProps, type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Calendar,
  type CalendarProps,
  type DateData,
} from "react-native-calendars";
import type { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import type { DayState, MarkedDates } from "react-native-calendars/src/types";

import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import { localDayKey } from "../../utils/bookingCalendar";
import "../../utils/calendarLocalePt";

import { buildRnCalendarTheme, getMonthCalendarChromeStyles } from "./styles";

export type MonthCalendarRenderDayArgs = {
  date: Date;
  dayKey: string;
  marking?: MarkingProps;
  onPress: () => void;
  state?: DayState;
};

type LibraryDayProps = ComponentProps<
  NonNullable<CalendarProps["dayComponent"]>
>;

function monthAnchorDateString(year: number, monthIndex0: number): string {
  return `${year}-${String(monthIndex0 + 1).padStart(2, "0")}-01`;
}

export type MonthCalendarProps = {
  footerBelowGrid?: ReactNode;
  loading?: boolean;
  loadingHint?: string;
  markedDates: MarkedDates;
  minDate?: string;
  monthIndex: number;
  onDayPress: (d: DateData) => void;
  onMonthChange: (d: DateData) => void;
  renderDay: (args: MonthCalendarRenderDayArgs) => ReactNode;
  weekStartsOn: "monday" | "sunday";
  /** Espaçamento vertical entre linhas da grelha (biblioteca: 7). */
  weekVerticalMargin?: number;
  year: number;
};

/**
 * Calendário mensal partilhado (reserva + agenda equipa) com `react-native-calendars`.
 */
export function MonthCalendar({
  footerBelowGrid,
  loading = false,
  loadingHint,
  markedDates,
  minDate,
  monthIndex,
  onDayPress,
  onMonthChange,
  renderDay,
  weekStartsOn,
  weekVerticalMargin,
  year,
}: MonthCalendarProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const resolvedLoadingHint = loadingHint ?? t("monthCalendar.loading");
  const chrome = useMemo(() => getMonthCalendarChromeStyles(theme), [theme]);
  const rnTheme = useMemo(
    () => buildRnCalendarTheme(theme, { weekVerticalMargin }),
    [theme, weekVerticalMargin],
  );

  const dayComponent = useMemo(() => {
    const DayCell = memo(function MonthCalendarDayCell(props: LibraryDayProps) {
      const { date, marking, onPress, state } = props;
      if (!date || typeof date !== "object" || !("timestamp" in date)) {
        return <View />;
      }
      const calendarDate = date as DateData;
      const jsDate = new Date(
        calendarDate.year,
        calendarDate.month - 1,
        calendarDate.day,
      );
      const dayKey = localDayKey(jsDate);
      return (
        <>
          {renderDay({
            date: jsDate,
            dayKey,
            marking,
            onPress: () => onPress?.(calendarDate),
            state,
          })}
        </>
      );
    });
    DayCell.displayName = "MonthCalendarDayCell";
    return DayCell;
  }, [renderDay]);

  const renderArrow = useMemo(
    () =>
      function MonthCalendarArrow(direction: "left" | "right") {
        return (
          <Ionicons
            color={theme.textPrimary}
            name={direction === "left" ? "chevron-back" : "chevron-forward"}
            size={26}
          />
        );
      },
    [theme.textPrimary],
  );

  const current = monthAnchorDateString(year, monthIndex);

  return (
    <View>
      {loading ? (
        <Text style={chrome.loadingHint} variant="body">
          {resolvedLoadingHint}
        </Text>
      ) : (
        <View style={chrome.calendarShell}>
          <Calendar
            key={`${year}-${monthIndex}`}
            current={current}
            dayComponent={dayComponent}
            disableMonthChange
            enableSwipeMonths
            firstDay={weekStartsOn === "monday" ? 1 : 0}
            hideExtraDays
            markedDates={markedDates}
            minDate={minDate}
            monthFormat="MMMM yyyy"
            renderArrow={renderArrow}
            theme={rnTheme}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
          />
        </View>
      )}

      {footerBelowGrid}
    </View>
  );
}
