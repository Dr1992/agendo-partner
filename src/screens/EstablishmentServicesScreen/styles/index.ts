import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getEstablishmentServicesScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    cardSeparator: {
      height: 12,
    },
    flatList: {
      flex: 1,
    },
    footer: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    footerButton: {
      marginTop: 0,
    },
    hintTop: {
      marginBottom: 4,
    },
    screenBody: {
      flex: 1,
    },
  });
}
