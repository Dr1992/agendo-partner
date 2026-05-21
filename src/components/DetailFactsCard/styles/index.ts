import { Platform, StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha } from "../../../theme/colors";

const ICON_BOX = 28;
const ICON_GLYPH = 16;

export function getDetailFactsCardStyles(theme: AppTheme) {
  const cardShadow =
    Platform.OS === "ios"
      ? {
          shadowColor: theme.cardShadow,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }
      : {};

  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 18,
      borderWidth: 1,
      marginTop: 8,
      overflow: "hidden",
      paddingHorizontal: 16,
      paddingTop: 4,
      ...cardShadow,
    },
    cardNoTopMargin: {
      marginTop: 0,
    },
    chevron: {
      alignSelf: "center",
      marginLeft: 4,
    },
    detailBody: {
      flex: 1,
      minWidth: 0,
    },
    detailIconWrap: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandMutedOnLight12
          : alpha.brandDeepOnLight08,
      borderRadius: 8,
      height: ICON_BOX,
      justifyContent: "center",
      marginRight: 12,
      width: ICON_BOX,
    },
    detailLabel: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.35,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    detailRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      paddingVertical: 12,
    },
    detailRowLast: {
      paddingBottom: 4,
    },
    detailRowPressable: {
      alignItems: "flex-start",
      flexDirection: "row",
      paddingVertical: 12,
    },
    detailValue: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 22,
    },
    detailValueEmphasis: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 22,
    },
  });
}

export const DETAIL_FACT_ICON_SIZE = ICON_GLYPH;
