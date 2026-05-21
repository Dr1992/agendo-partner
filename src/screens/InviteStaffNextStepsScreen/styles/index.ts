import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getInviteStaffNextStepsStyles(_theme: AppTheme) {
  return StyleSheet.create({
    actions: {
      gap: 12,
      marginTop: 24,
    },
    body: {
      marginTop: 4,
    },
  });
}
