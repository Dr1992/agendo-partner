import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getFormSelectRowStyles(theme: AppTheme) {
  return StyleSheet.create({
    pressable: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      minHeight: 48,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    pressableDisabled: {
      opacity: 0.5,
    },
    pressablePressed: {
      opacity: 0.9,
    },
  });
}
