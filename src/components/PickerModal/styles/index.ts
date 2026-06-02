import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getPickerModalStyles(theme: AppTheme) {
  return StyleSheet.create({
    footer: {
      borderTopColor: theme.border,
      borderTopWidth: 1,
      paddingTop: 12,
    },
    listContent: {
      paddingBottom: 8,
    },
    listFill: {
      flex: 1,
    },
    listOuter: {
      flex: 1,
      minHeight: 0,
      paddingTop: 4,
    },
    row: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      marginBottom: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowPressed: {
      opacity: 0.88,
    },
    rowSubtitle: {
      color: theme.textHint,
      fontSize: 13,
      marginTop: 4,
    },
    rowTextCol: {
      flex: 1,
    },
    rowTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
  });
}
