import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getServicePerformersModalStyles(theme: AppTheme) {
  return StyleSheet.create({
    bodyColumn: {
      alignSelf: "stretch",
      flex: 1,
      minHeight: 0,
      width: "100%",
    },
    listContent: {
      paddingBottom: 8,
    },
    listFlex: {
      flex: 1,
      width: "100%",
    },
    row: {
      alignItems: "center",
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      overflow: "visible",
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    rowLabel: {
      flex: 1,
      flexShrink: 1,
      marginRight: 12,
      minWidth: 0,
    },
    switchWrap: {
      flexShrink: 0,
    },
    searchField: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      color: theme.textPrimary,
      fontSize: 16,
      marginBottom: 12,
      marginTop: 4,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    subHint: {
      marginTop: 4,
    },
  });
}
