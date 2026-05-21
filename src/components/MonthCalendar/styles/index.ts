import { StyleSheet } from "react-native";

import type { Theme as RnCalendarTheme } from "react-native-calendars/src/types";

import type { AppTheme } from "../../../theme";

export function getMonthCalendarChromeStyles(theme: AppTheme) {
  return StyleSheet.create({
    calendarShell: {
      marginTop: 4,
      overflow: "hidden",
    },
    loadingHint: {
      marginTop: 12,
      paddingVertical: 8,
    },
  });
}

type BuildRnCalendarThemeOptions = {
  /** Default da biblioteca: 7. Valores menores aproximam conteúdo abaixo da grelha (ex.: legenda). */
  weekVerticalMargin?: number;
};

/** Tema do `react-native-calendars` alinhado a `AppTheme` (sem cores soltas fora de tokens). */
export function buildRnCalendarTheme(
  theme: AppTheme,
  options?: BuildRnCalendarThemeOptions,
): RnCalendarTheme {
  return {
    arrowColor: theme.textPrimary,
    calendarBackground: theme.background,
    dayTextColor: theme.textPrimary,
    monthTextColor: theme.textPrimary,
    selectedDayBackgroundColor: theme.background,
    selectedDayTextColor: theme.textPrimary,
    textDayFontSize: 15,
    textDayFontWeight: "600",
    textDayHeaderFontSize: 11,
    textDayHeaderFontWeight: "600",
    textDisabledColor: theme.textMuted,
    textInactiveColor: theme.textMuted,
    textMonthFontSize: 17,
    textMonthFontWeight: "700",
    textSectionTitleColor: theme.textMuted,
    todayBackgroundColor: theme.background,
    todayTextColor: theme.accent,
    ...(options?.weekVerticalMargin !== undefined
      ? { weekVerticalMargin: options.weekVerticalMargin }
      : {}),
  };
}
