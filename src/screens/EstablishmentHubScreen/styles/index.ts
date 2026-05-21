import { StyleSheet } from "react-native";

import { alpha } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";

export function getEstablishmentHubScreenStyles(theme: AppTheme) {
  const iconWash =
    theme.scheme === "dark"
      ? alpha.brandVioletOnDark20
      : alpha.brandDeepOnLight08;

  return StyleSheet.create({
    iconCircle: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: iconWash,
      borderRadius: 22,
      height: 44,
      justifyContent: "center",
      marginRight: 14,
      width: 44,
    },
    menuCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
    },
    menuRow: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    menuRowDisabled: {
      opacity: 0.42,
    },
    menuRowPressed: {
      opacity: 0.92,
    },
    menuRowText: {
      flex: 1,
      marginRight: 8,
    },
    menuRowTitleDisabled: {
      color: theme.textMuted,
    },
    menuCardSpacing: {
      marginTop: 10,
    },
    menuSubtitle: {
      marginTop: 3,
    },
    readOnlyHint: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    footerUnlockBar: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    inactiveManagerHint: {
      marginTop: 16,
      paddingHorizontal: 4,
    },
    staffSection: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      gap: 12,
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    leaveButton: {
      alignItems: "center",
      borderColor: theme.textDestructive,
      borderRadius: 10,
      borderWidth: 1.5,
      paddingVertical: 13,
    },
    leaveButtonPressed: {
      opacity: 0.7,
    },
    leaveButtonDisabled: {
      opacity: 0.4,
    },
    leaveButtonLabel: {
      color: theme.textDestructive,
    },
    unlockLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      backgroundColor: alpha.overlayScrim,
      justifyContent: "center",
      zIndex: 50,
    },
    scrollWrapper: {
      flex: 1,
    },
    scrollContentPadBottom: {
      paddingBottom: 8,
    },
  });
}
