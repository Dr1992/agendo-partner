import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { getScreenFormStyles } from "../../../components/ScreenForm";

export function getEstablishmentRegisterScreenStyles(theme: AppTheme) {
  const base = getScreenFormStyles(theme);
  const extra = StyleSheet.create({
    cepField: {
      flex: 1,
      marginRight: 10,
      marginTop: 0,
    },
    cepRow: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 8,
    },
    fieldMultiline: {
      minHeight: 72,
    },
    inactiveBanner: {
      fontWeight: "600",
    },
    legacyGalleryBanner: {
      marginBottom: 4,
      marginTop: 4,
    },
    suggestCategoryButton: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.accent,
      borderRadius: 14,
      borderWidth: 1,
      paddingVertical: 14,
    },
  });
  return Object.assign({}, base, extra) as typeof base & typeof extra;
}

export type EstablishmentRegisterScreenStyles = ReturnType<
  typeof getEstablishmentRegisterScreenStyles
>;
