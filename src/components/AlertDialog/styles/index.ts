import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha, palette } from "../../../theme/colors";

export function getAlertDialogStyles(theme: AppTheme) {
  return StyleSheet.create({
    actionsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 20,
    },
    backdrop: {
      alignItems: "center",
      backgroundColor: alpha.overlayScrim,
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    btn: {
      alignItems: "center",
      borderRadius: 14,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    btnDestructive: {
      backgroundColor: palette.red700,
    },
    btnDestructiveText: {
      color: palette.white,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    btnPrimary: {
      backgroundColor: theme.accent,
    },
    btnPrimaryText: {
      color: palette.onAccent,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    btnSecondary: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
    },
    btnSecondaryText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    btnSingle: {
      alignSelf: "stretch",
      flex: 0,
      marginTop: 20,
      width: "100%",
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 18,
      borderWidth: 1,
      maxWidth: 400,
      paddingHorizontal: 20,
      paddingVertical: 22,
      width: "100%",
    },
    message: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 10,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.3,
    },
  });
}
