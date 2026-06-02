import { Platform, StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { palette } from "../../../theme/colors";
import { CONTENT_MIN_PADDING_TOP } from "../../../theme/layout";

export function getBookingConfirmStyles(theme: AppTheme) {
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
    center: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    customerEmailInput: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      color: theme.textPrimary,
      fontSize: 16,
      marginTop: 8,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === "ios" ? 14 : 12,
    },
    customerEmailSection: {
      marginBottom: 20,
      marginTop: 4,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    cta: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 16,
      paddingVertical: 17,
      ...cardShadow,
    },
    ctaBusy: {
      opacity: 0.55,
    },
    ctaPressed: {
      opacity: 0.92,
    },
    ctaText: {
      color: palette.onAccent,
      fontSize: 16,
      fontWeight: "600",
    },
    ctaInFooter: {
      marginTop: 0,
    },
    errorText: {
      color: theme.textSecondary,
      textAlign: "center",
    },
    footerBar: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingBottom: Platform.OS === "ios" ? 28 : 20,
      paddingHorizontal: 20,
      paddingTop: 16,
      ...Platform.select({
        ios: {
          shadowColor: palette.blackPure,
          shadowOffset: { height: -3, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        default: { elevation: 8 },
      }),
    },
    intro: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 22,
      marginTop: 8,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 28,
      paddingHorizontal: 20,
      paddingTop: CONTENT_MIN_PADDING_TOP,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: "600",
      letterSpacing: -0.3,
    },
  });
}
