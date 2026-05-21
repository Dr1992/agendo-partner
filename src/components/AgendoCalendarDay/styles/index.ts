import { StyleSheet } from "react-native";

import { alpha, palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";

export function getAgendoCalendarDayStyles(theme: AppTheme) {
  /** Contorno do número do dia: igual em reserva e agenda equipa. */
  const dayRing = StyleSheet.create({
    circle: {
      alignItems: "center",
      borderRadius: 22,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    circlePast: {
      opacity: 0.35,
    },
    circleSelected: {
      borderColor: theme.accent,
      borderWidth: 2,
    },
    circleToday: {
      backgroundColor: theme.border,
    },
    dayNum: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
    dayNumMuted: {
      color: theme.textMuted,
      fontWeight: "500",
    },
    dayNumSelected: {
      fontWeight: "800",
    },
  });

  const booking = StyleSheet.create({
    bookingCalendarDay: {
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 8,
    },
  });

  const staff = StyleSheet.create({
    dayCell: {
      alignItems: "center",
      borderRadius: 10,
      justifyContent: "center",
      margin: 2,
      minHeight: 44,
      paddingVertical: 6,
      width: "100%",
    },
    dayCellHasBooking:
      theme.scheme === "dark"
        ? {
            backgroundColor: theme.surfaceElevated,
            borderColor: alpha.brandVioletOnDark35,
            borderWidth: 1,
          }
        : {
            backgroundColor: palette.accentWash,
          },
    /** Número do dia: no escuro, `accent` sobre `surfaceElevated` lê-se melhor que `textPrimary` sobre lavanda clara. */
    dayNumStaffHasBooking: {
      color: theme.accent,
      fontWeight: "700",
    },
    dayPressed: {
      opacity: 0.85,
    },
  });

  return { booking, dayRing, staff };
}
