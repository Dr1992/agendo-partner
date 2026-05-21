import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getStaffAgendaEstablishmentsSectionStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      marginTop: 12,
      /** Evita somar com o `padding` interno do `EstablishmentRowCard`. */
      padding: 0,
    },
    cardPressed: {
      opacity: 0.92,
    },
    centeredMessage: {
      marginTop: 0,
      paddingHorizontal: 12,
      textAlign: "center",
    },
    scrollContentCentered: {
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "center",
      paddingBottom: 32,
      paddingHorizontal: 20,
      paddingTop: 0,
    },
    inactiveHint: {
      marginTop: 6,
    },
  });
}
