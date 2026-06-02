import { StyleSheet } from "react-native";

import { getScreenFormStyles } from "../../../components/ScreenForm";
import type { AppTheme } from "../../../theme";
import { alpha } from "../../../theme/colors";

export function getEstablishmentEditScreenStyles(theme: AppTheme) {
  const base = getScreenFormStyles(theme);
  const local = StyleSheet.create({
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
    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
      marginTop: 24,
    },
    sectionIconWrap: {
      alignItems: "center",
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandMutedOnLight12
          : alpha.brandDeepOnLight08,
      borderRadius: 8,
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    sectionHeaderLabel: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
    sectionCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
    },
    fieldRow: {
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    fieldRowLast: {
      borderBottomWidth: 0,
    },
    fieldRowPressed: {
      backgroundColor:
        theme.scheme === "dark"
          ? alpha.brandMutedOnLight10
          : alpha.brandDeepOnLight06,
    },
    fieldRowDimmed: {
      opacity: 0.45,
    },
    fieldRowLabel: {
      color: theme.textHint,
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.4,
      marginBottom: 4,
      textAlign: "center",
      textTransform: "uppercase",
    },
    fieldRowInput: {
      color: theme.textPrimary,
      fontSize: 15,
      padding: 0,
      textAlign: "center",
    },
    fieldRowMultiline: {
      minHeight: 60,
      textAlignVertical: "top",
    },
    fieldRowSelectBody: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    fieldRowSelectValue: {
      color: theme.textPrimary,
      fontSize: 15,
      textAlign: "center",
    },
    fieldRowSelectPlaceholder: {
      color: theme.textHint,
      fontSize: 15,
      textAlign: "center",
    },
    cepRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    cepInput: {
      flex: 1,
    },
    charCount: {
      color: theme.textHint,
      fontSize: 12,
      marginTop: 4,
      textAlign: "right",
    },
    galleryPad: {
      paddingBottom: 8,
      paddingHorizontal: 12,
      paddingTop: 4,
    },
  });
  return Object.assign({}, base, local) as typeof base & typeof local;
}
