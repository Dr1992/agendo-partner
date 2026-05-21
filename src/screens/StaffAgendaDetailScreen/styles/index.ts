import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getStaffAgendaDetailScreenStyles(_theme: AppTheme) {
  return StyleSheet.create({
    actions: {
      marginTop: 20,
    },
    editor: {
      marginTop: 8,
    },
    intro: {
      marginTop: 16,
    },
    retryBar: {
      alignSelf: "stretch",
      width: "100%",
    },
    noEstablishmentHoursHint: {
      marginTop: 12,
    },
  });
}
