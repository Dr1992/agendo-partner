import { StyleSheet } from "react-native";

import { palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";
import { CONTENT_MIN_PADDING_TOP } from "../../../theme/layout";

/** Espaço entre os dois segmentos (alinhado com o cálculo da animação da pílula). */
export const AGENDA_MODE_TOGGLE_SEGMENT_GAP = 8;

export function getAgendaModeToggleStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      marginBottom: 16,
      paddingHorizontal: 20,
      paddingTop: CONTENT_MIN_PADDING_TOP,
    },
    hitPressed: {
      opacity: 0.92,
    },
    hitSlot: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      paddingVertical: 10,
      zIndex: 1,
    },
    pill: {
      backgroundColor: theme.accent,
      borderRadius: 8,
      bottom: 0,
      left: 0,
      position: "absolute",
      top: 0,
    },
    shell: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      flex: 1,
      flexDirection: "row",
      padding: 6,
    },
    textActive: {
      color: palette.onAccent,
      fontSize: 14,
      fontWeight: "600",
    },
    textInactive: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
    track: {
      flex: 1,
      flexDirection: "row",
      gap: AGENDA_MODE_TOGGLE_SEGMENT_GAP,
      minHeight: 40,
      position: "relative",
    },
  });
}
