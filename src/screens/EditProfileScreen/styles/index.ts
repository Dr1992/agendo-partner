import { Platform, StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha } from "../../../theme/colors";
import { CONTENT_MIN_PADDING_TOP } from "../../../theme/layout";

const ICON_BOX = 32;
const ICON_GLYPH = 18;

export function getEditProfileStyles(theme: AppTheme) {
  const cardShadow =
    Platform.OS === "ios"
      ? {
          shadowColor: theme.cardShadow,
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        }
      : { elevation: 2 };

  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
      ...cardShadow,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    cta: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 14,
      marginTop: 22,
      paddingVertical: 14,
    },
    ctaDisabled: {
      opacity: 0.55,
    },
    fieldCol: {
      flex: 1,
      minWidth: 0,
    },
    fieldRow: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    fieldRowBorder: {
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    fieldRowLast: {
      borderBottomWidth: 0,
    },
    iconWrap: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandMutedOnLight12
          : alpha.brandDeepOnLight08,
      borderRadius: 10,
      height: ICON_BOX,
      justifyContent: "center",
      marginRight: 12,
      marginTop: 2,
      width: ICON_BOX,
    },
    inputInner: {
      borderWidth: 0,
      color: theme.textPrimary,
      flex: 1,
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 22,
      margin: 0,
      minHeight: 22,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    inputInnerLocked: {
      color: theme.textMuted,
    },
    inputShell: {
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      marginTop: 6,
      minHeight: 46,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    /** Fundo claro “papel” no light; no dark, superfície elevada. */
    inputShellEditable: {
      backgroundColor: theme.surfaceElevated,
    },
    inputShellLocked: {
      backgroundColor: theme.background,
    },
    rowLabel: {
      color: theme.textHint,
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.4,
      marginTop: 0,
      textAlign: "left",
      textTransform: "uppercase",
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
      paddingHorizontal: 20,
      paddingTop: CONTENT_MIN_PADDING_TOP,
    },
  });
}

export const EDIT_PROFILE_ICON_SIZE = ICON_GLYPH;
