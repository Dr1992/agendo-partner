import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha, palette } from "../../../theme/colors";

export function getProfileStyles(theme: AppTheme) {
  return StyleSheet.create({
    chip: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    chipActive: {
      backgroundColor:
        theme.scheme === "dark" ? theme.surfaceElevated : palette.accentWash,
      borderColor: theme.accent,
    },
    chipText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    chipTextActive: {
      color: theme.accent,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
      paddingBottom: 8,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    sectionLabel: {
      color: theme.textHint,
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 0.6,
      marginBottom: 12,
      marginTop: 28,
      textTransform: "uppercase",
    },
    title: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: "700",
    },
    loginBlockingOverlay: {
      alignItems: "center",
      backgroundColor: alpha.overlayScrim,
      flex: 1,
      justifyContent: "center",
    },
    linkCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    linkRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    linkTextColumn: {
      flex: 1,
    },
    linkTextColumnPadded: {
      flex: 1,
      paddingRight: 12,
    },
    linkSubtitle: {
      color: theme.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    linkTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    loginBtn: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      marginTop: 10,
      paddingVertical: 14,
    },
    loginBtnBusy: {
      opacity: 0.65,
    },
    loginBtnStacked: {
      marginTop: 12,
    },
    loginBtnText: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
    pressedFeedback: {
      opacity: 0.9,
    },
    /** Só o necessário em baixo: a área útil já fica acima da tab bar (não somar altura da tab). */
    scrollContent: {
      paddingBottom: 20,
    },
    signOutInScroll: {
      marginTop: 28,
    },
    scrollFlex: {
      flex: 1,
    },
    subtle: {
      color: theme.textHint,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 8,
    },
    welcomeLine: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: "600",
      marginTop: 2,
    },
  });
}
