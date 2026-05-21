import { StyleSheet } from "react-native";

import { palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme/themes";

export function getScreenFormStyles(theme: AppTheme) {
  return StyleSheet.create({
    body: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 8,
    },
    center: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    container: {
      marginTop: 24,
      backgroundColor: theme.background,
      flex: 1,
    },
    cta: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 14,
      marginTop: 24,
      paddingVertical: 16,
    },
    ctaMarginTopTight: {
      marginTop: 16,
    },
    /** Botão de repetir pedido em ecrã centrado (evita largura só do texto). */
    ctaRetryFullWidth: {
      alignSelf: "stretch",
      marginTop: 32,
    },
    ctaNoTopMargin: {
      marginTop: 0,
    },
    ctaModalFooter: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 14,
      marginTop: 0,
      paddingVertical: 16,
    },
    ctaDisabled: {
      opacity: 0.55,
    },
    ctaOutline: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 12,
      paddingVertical: 16,
    },
    ctaOutlineText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    ctaText: {
      color: palette.onAccent,
      fontSize: 17,
      fontWeight: "700",
    },
    field: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      color: theme.textPrimary,
      fontSize: 16,
      marginTop: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    fieldLabel: {
      /** Alinhado a `Text` `fieldLabel` — secções mais legíveis que `textMuted`. */
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginTop: 16,
      textTransform: "uppercase",
    },
    hint: {
      color: theme.textHint,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
    },
    interactionPressed: {
      opacity: 0.92,
    },
    fieldDimmed: {
      opacity: 0.55,
    },
    fieldNoTopMargin: {
      marginTop: 0,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingBottom: 32,
      paddingHorizontal: 20,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: "800",
    },
  });
}
