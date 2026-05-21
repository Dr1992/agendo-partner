import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getEstablishmentServiceFormScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    fieldLabelRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
      marginTop: 20,
    },
    fieldLabelText: {
      marginTop: 0,
    },
    durationRowInner: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    choosePerformersRow: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    choosePerformersRowPressed: {
      opacity: 0.92,
    },
    descriptionField: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    fieldHint: {
      marginBottom: 6,
      marginTop: 4,
    },
    fieldHintTight: {
      marginBottom: 8,
      marginTop: 4,
    },
    collaboratorRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    collaboratorRowLabel: {
      flex: 1,
      marginRight: 12,
    },
    footer: {
      marginTop: 24,
    },
    sectionHint: {
      marginBottom: 8,
      marginTop: 8,
    },
    switchRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      marginTop: 16,
      overflow: "visible",
    },
    switchRowLabel: {
      flex: 1,
      flexShrink: 1,
      marginRight: 12,
      minWidth: 0,
    },
    switchWrap: {
      flexShrink: 0,
    },
  });
}
