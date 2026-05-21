import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getPendingInviteLinkServicesScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    hint: {
      marginBottom: 16,
    },
    row: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
      marginBottom: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowPressed: {
      opacity: 0.92,
    },
    rowText: {
      flex: 1,
    },
    saveBlock: {
      marginTop: 20,
    },
  });
}
