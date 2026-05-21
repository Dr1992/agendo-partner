import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getOpeningHoursEditorStyles(theme: AppTheme) {
  return StyleSheet.create({
    dayLabelMuted: {
      color: theme.textMuted,
      fontWeight: "500",
    },
    dayRow: {
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      paddingVertical: 12,
    },
    dayRowLast: {
      borderBottomWidth: 0,
    },
    dayTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    dayTitleRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginRight: 12,
    },
    timeGrid: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },
    timeLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },
    titleCol: {
      flex: 1,
      paddingRight: 12,
    },
    timeCol: {
      flex: 1,
    },
    timeFieldRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
}

/** Estilos do corpo dentro de `AppSheetModal` (footer fica no prop `footer` do sheet). */
export function getOpeningHoursEditorModalStyles(
  theme: AppTheme,
  insets: { bottom: number },
) {
  return StyleSheet.create({
    bodyWrap: {
      backgroundColor: theme.background,
      flex: 1,
      minHeight: 0,
    },
    scroll: {
      flex: 1,
      minHeight: 0,
    },
    scrollContent: {
      paddingBottom: 28 + Math.max(insets.bottom, 12),
      paddingTop: 8,
    },
  });
}
