import { Platform, StyleSheet } from "react-native";

import type { AppTheme } from "../../../../theme";
import { alpha } from "../../../../theme/colors";

export function getEstablishmentPlaceReviewStepStyles(theme: AppTheme) {
  const cardShadow =
    Platform.OS === "ios"
      ? {
          shadowColor: theme.cardShadow,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }
      : { elevation: 3 };

  return StyleSheet.create({
    actions: {
      gap: 12,
      marginTop: 24,
    },
    heroRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 14,
      marginBottom: 16,
    },
    intro: {
      color: theme.textSecondary,
      flex: 1,
      minWidth: 0,
      paddingTop: 2,
    },
    photoCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 18,
      borderWidth: 1,
      marginTop: 8,
      overflow: "hidden",
      paddingBottom: 14,
      paddingHorizontal: 16,
      paddingTop: 12,
      ...cardShadow,
    },
    photoCardHeader: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
      marginBottom: 12,
    },
    photoCardTitle: {
      color: theme.textHint,
      flex: 1,
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.35,
      textAlign: "left",
      textTransform: "uppercase",
    },
    photoEmpty: {
      color: theme.textHint,
      fontSize: 15,
    },
    photoRow: {
      flexDirection: "row",
      flexGrow: 0,
    },
    photoRowContent: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
      paddingVertical: 2,
    },
    photoThumb: {
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      height: 72,
      width: 96,
    },
    photoThumbWrap: {
      borderRadius: 12,
      overflow: "hidden",
    },
    titleIconWrap: {
      alignItems: "center",
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandMutedOnLight12
          : alpha.brandDeepOnLight08,
      borderRadius: 12,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
  });
}
