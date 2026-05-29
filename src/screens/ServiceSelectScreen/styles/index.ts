import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { CONTENT_MIN_PADDING_TOP } from "../../../theme/layout";

export function getServiceSelectStyles(theme: AppTheme) {
  return StyleSheet.create({
    center: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    empty: {
      color: theme.textSecondary,
      padding: 24,
      textAlign: "center",
    },
    errorText: {
      color: theme.textSecondary,
      textAlign: "center",
    },
    hint: {
      color: theme.textHint,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 14,
    },
    list: {
      paddingBottom: 24,
      paddingHorizontal: 20,
      paddingTop: CONTENT_MIN_PADDING_TOP,
    },
  });
}
