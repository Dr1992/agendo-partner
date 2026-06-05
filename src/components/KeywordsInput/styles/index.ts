import { StyleSheet } from "react-native";

import { alpha, palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";

export function getKeywordsInputStyles(theme: AppTheme) {
  const isDark = theme.scheme === "dark";
  return StyleSheet.create({
    inputRow: {
      alignItems: "flex-end",
      flexDirection: "row",
    },
    inputField: {
      flex: 1,
      marginTop: 0,
    },
    addButton: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 10,
      height: 44,
      justifyContent: "center",
      marginBottom: 0,
      marginLeft: 8,
      marginTop: 8,
      width: 44,
    },
    addButtonPressed: {
      opacity: 0.75,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
    },
    chip: {
      alignItems: "center",
      backgroundColor: isDark
        ? alpha.brandVioletOnDark35
        : alpha.brandDeepOnLight11,
      borderRadius: 999,
      flexDirection: "row",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipText: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: "600",
      includeFontPadding: false, 
			marginBottom:4
    },
  });
}
