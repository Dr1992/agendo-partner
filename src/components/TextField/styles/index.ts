import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getTextFieldStyles(theme: AppTheme) {
  return StyleSheet.create({
    charCount: {
      alignSelf: "flex-end",
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "500",
      marginTop: 6,
      textAlign: "right",
    },
    charCountLimit: {
      color: theme.accent,
    },
  });
}
