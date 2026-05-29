import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme/themes";

export function getStaffPersonalCommitmentStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    calendarSection: {
      paddingHorizontal: 4,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionLabel: {
      marginBottom: 8,
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 10,
    },
    timeRowDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: 14,
    },
    timeRowIcon: {
      width: 28,
      alignItems: "center",
    },
    timeRowLabel: {
      flex: 1,
    },
    timeRowValue: {
      color: theme.textPrimary,
    },
    timeRowValueEmpty: {
      color: theme.textHint,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    saveButton: {
      alignItems: "center",
      backgroundColor: theme.accent,
      borderRadius: 14,
      paddingVertical: 16,
    },
    saveButtonDisabled: {
      opacity: 0.45,
    },
    saveButtonPressed: {
      opacity: 0.8,
    },
    saveButtonLabel: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    errorText: {
      color: theme.textDestructive,
      marginTop: 6,
    },
    descriptionInput: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      color: theme.textPrimary,
      fontSize: 15,
      minHeight: 80,
      padding: 14,
      textAlignVertical: "top",
    },
  });
}
