import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme/themes";

export function getStaffNewBookingTypeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
      gap: 14,
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      gap: 14,
    },
    cardPressed: {
      opacity: 0.7,
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    cardTextBlock: {
      flex: 1,
      gap: 4,
    },
    cardDescription: {
      textAlign: "left",
    },
  });
}
