import { StyleSheet } from "react-native";

import { alpha } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";

export function getStaffAgendaCalendarScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    headerAddButton: {
      alignItems: "center",
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandVioletOnDark15
          : alpha.brandDeepOnLight08,
      borderRadius: 20,
      flexDirection: "row",
      gap: 4,
      minHeight: 36,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    headerAddButtonPressed: {
      opacity: 0.85,
    },
    headerAddLabel: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: -0.2,
    },
    /** Cartão de resumo: `getBookingScheduleStyles` usa `marginHorizontal: 20`; o scroll do ecrã já tem padding 20. */
    staffSummaryCard: {
      marginHorizontal: 0,
    },
    staffSummaryCardSpacing: {
      marginTop: 12,
    },
    summaryCancelFooter: {
      alignItems: "center",
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      marginTop: 14,
      paddingTop: 14,
    },
    summaryCancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    summaryCancelButtonPressed: {
      opacity: 0.75,
    },
    summaryCancelButtonLabel: {
      color: theme.textDestructive,
      fontSize: 15,
      fontWeight: "600",
    },
    detailSection: {
      marginTop: 20,
    },
    intro: {
      marginBottom: 12,
      marginTop: 4,
    },
    legendDot: {
      alignSelf: "center",
      backgroundColor: theme.accent,
      borderRadius: 4,
      height: 8,
      marginRight: 8,
      width: 8,
    },
    /** `hint` traz `marginTop` para contexto em coluna; na legenda em linha isso desalinha a bolinha. */
    legendLabel: {
      flexShrink: 1,
      marginTop: 0,
    },
    legendRow: {
      alignItems: "center",
      alignSelf: "stretch",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 4,
    },
    sectionTitle: {
      marginBottom: 8,
      marginTop: 16,
    },
  });
}
