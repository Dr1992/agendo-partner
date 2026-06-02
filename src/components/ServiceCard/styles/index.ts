import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getServiceCardStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 0,
    },
    cardPressed: {
      opacity: 0.92,
    },
    topRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 8,
    },
    name: {
      color: theme.textPrimary,
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: -0.1,
    },
    actionIcon: {
      marginTop: 1,
    },
    desc: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
    },
    separator: {
      backgroundColor: theme.border,
      height: StyleSheet.hairlineWidth,
      marginTop: 12,
    },
    footerRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    durationRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    durationText: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    price: {
      color: theme.accent,
      fontSize: 14,
      fontWeight: "700",
    },
    inactiveBadge: {
      color: theme.textHint,
      fontSize: 12,
      marginBottom: 12,
      marginTop: -4,
    },
  });
}
