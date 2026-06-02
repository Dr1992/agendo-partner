import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { palette } from "../../../theme/colors";

export function getSignedOutGateStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      alignItems: "center",
      alignSelf: "stretch",
      backgroundColor: theme.accent,
      borderRadius: 12,
      marginTop: 24,
      paddingVertical: 13,
    },
    buttonPressed: {
      opacity: 0.75,
    },
    buttonText: {
      color: palette.onAccent,
      fontWeight: "600",
      textAlign: "center",
    },
    container: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    subtitle: {
      color: theme.textHint,
      fontSize: 15,
      marginTop: 12,
      textAlign: "center",
    },
    title: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: "600",
      textAlign: "center",
    },
  });
}
