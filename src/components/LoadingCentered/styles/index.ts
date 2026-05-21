import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getLoadingCenteredStyles(theme: AppTheme) {
  return StyleSheet.create({
    outer: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
    },
  });
}
