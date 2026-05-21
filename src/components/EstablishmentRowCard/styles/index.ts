import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { palette } from "../../../theme/colors";

type EstablishmentRowCardStyleOpts = {
  compact?: boolean;
  elevated: boolean;
};

export function getEstablishmentRowCardStyles(
  theme: AppTheme,
  opts: EstablishmentRowCardStyleOpts,
) {
  const { compact = false, elevated } = opts;
  const innerPad = compact ? 12 : 16;
  const thumbSize = compact ? 56 : 72;
  const addressTop = compact ? 6 : 12;
  const mainGap = compact ? 10 : 14;

  return StyleSheet.create({
    address: {
      color: theme.textMuted,
      fontSize: 13,
      marginTop: addressTop,
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    category: {
      color: theme.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    cardHint: {
      marginTop: 10,
    },
    distancePill: {
      alignSelf: "center",
      marginTop: compact ? 6 : 8,
      maxWidth: 132,
    },
    editIconBox: {
      marginLeft: 10,
    },
    inner: {
      padding: innerPad,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: compact ? 8 : 10,
    },
    name: {
      color: theme.textPrimary,
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      marginRight: 12,
    },
    pill: {
      backgroundColor:
        theme.scheme === "dark" ? theme.surfaceElevated : palette.accentWash,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pillText: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: "500",
    },
    pressable: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
      ...(elevated
        ? {
            elevation: 3,
            shadowColor: theme.cardShadow,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 12,
          }
        : {}),
    },
    pressableInactive: {
      opacity: 0.72,
    },
    rating: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: "500",
    },
    rowMain: {
      flexDirection: "row",
      gap: mainGap,
    },
    rowTop: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowTopTrailing: {
      alignItems: "center",
      flexDirection: "row",
      flexShrink: 0,
      gap: 8,
      marginLeft: 8,
    },
    thumbColumn: {
      alignItems: "center",
      flexShrink: 0,
    },
    thumb: {
      backgroundColor: theme.surfaceElevated,
      borderRadius: compact ? 10 : 12,
      height: thumbSize,
      width: thumbSize,
    },
    thumbMonogram: {
      color: theme.accent,
      fontSize: 20,
      fontWeight: "600",
    },
    thumbPlaceholder: {
      alignItems: "center",
      backgroundColor:
        theme.scheme === "dark" ? theme.surfaceElevated : palette.accentWash,
      borderRadius: compact ? 10 : 12,
      height: thumbSize,
      justifyContent: "center",
      width: thumbSize,
    },
  });
}
