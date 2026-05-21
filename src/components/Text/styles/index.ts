import { StyleSheet, type TextStyle } from "react-native";

import type { AppTheme } from "../../../theme";
import { palette } from "../../../theme/colors";

export function getTextStyles(theme: AppTheme): Record<string, TextStyle> {
  return StyleSheet.create({
    body: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 8,
    },
    bodyTight: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    caption: {
      color: theme.textMuted,
      fontSize: 13,
      marginTop: 4,
      textAlign: "center",
    },
    ctaOutline: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    ctaPrimary: {
      color: palette.onAccent,
      fontSize: 17,
      fontWeight: "700",
    },
    fieldLabel: {
      /** Mais legível que `textMuted` (rótulos de secção / formulário). */
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginTop: 16,
      textTransform: "uppercase",
    },
    formSelectPlaceholder: {
      color: theme.textMuted,
      flex: 1,
      fontSize: 16,
      fontWeight: "400",
    },
    formSelectValue: {
      color: theme.textPrimary,
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
    },
    hint: {
      color: theme.textHint,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
    },
    linkAccent: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "700",
    },
    linkMuted: {
      color: theme.textMuted,
      fontSize: 13,
      marginTop: 4,
      textAlign: "center",
    },
    listSubtitle: {
      color: theme.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    listTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    title: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: "800",
    },
  });
}
