import { StyleSheet } from "react-native";

import { alpha, palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";

export function getBookingScheduleStyles(theme: AppTheme) {
  return StyleSheet.create({
    calendarMonthBlock: {
      marginTop: 20,
    },
    bodyScroll: {
      flex: 1,
    },
    bodyScrollContent: {
      paddingBottom: 24,
      paddingTop: 8,
    },
    staffOwnAgendaNotice: {
      backgroundColor:
        theme.scheme === "dark" ? "rgba(245, 158, 11, 0.14)" : "#FEF3C7",
      borderColor:
        theme.scheme === "dark"
          ? "rgba(245, 158, 11, 0.42)"
          : "rgba(245, 158, 11, 0.4)",
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 12,
      marginHorizontal: 12,
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    staffOwnAgendaNoticeText: {
      color: theme.scheme === "dark" ? theme.textPrimary : palette.slate800,
    },
    collaboratorSelfBookNotice: {
      backgroundColor:
        theme.scheme === "dark" ? "rgba(245, 158, 11, 0.14)" : "#FEF3C7",
      borderColor:
        theme.scheme === "dark"
          ? "rgba(245, 158, 11, 0.42)"
          : "rgba(245, 158, 11, 0.4)",
      borderRadius: 12,
      borderWidth: 1,
      marginHorizontal: 20,
      maxWidth: 520,
      paddingHorizontal: 14,
      paddingVertical: 12,
      width: "100%",
    },
    collaboratorSelfBookNoticeText: {
      color: theme.scheme === "dark" ? theme.textPrimary : palette.slate800,
      textAlign: "center",
    },
    calendarSection: {
      marginTop: 8,
      paddingHorizontal: 12,
    },
    center: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    errorText: {
      color: theme.textDestructive,
      fontSize: 16,
      textAlign: "center",
    },
    flexMain: {
      flex: 1,
    },
    footerBar: {
      alignSelf: "stretch",
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      paddingBottom: 16,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    footerCta: {
      alignItems: "center",
      alignSelf: "stretch",
      backgroundColor: theme.accent,
      borderRadius: 14,
      paddingVertical: 14,
    },
    footerCtaDisabled: {
      opacity: 0.45,
    },
    footerCtaPressed: {
      opacity: 0.92,
    },
    footerCtaText: {
      color: palette.onAccent,
      fontSize: 16,
      fontWeight: "600",
    },
    professionalAvatar: {
      alignItems: "center",
      backgroundColor: alpha.brandDeepOnLight11,
      borderRadius: 28,
      height: 56,
      justifyContent: "center",
      width: 56,
    },
    professionalAvatarSelected: {
      borderColor: theme.accent,
      borderWidth: 2,
    },
    professionalInitials: {
      color: theme.accent,
      fontSize: 14,
      fontWeight: "600",
    },
    professionalName: {
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: "600",
      marginTop: 4,
      maxWidth: 56,
      textAlign: "center",
    },
    professionalNameSelected: {
      color: theme.textPrimary,
      fontWeight: "600",
    },
    professionalStrip: {
      flexGrow: 0,
    },
    professionalStripContent: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    professionalStripItem: {
      alignItems: "center",
      marginRight: 10,
      width: 60,
    },
    sectionTitle: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.28,
      marginTop: 16,
      paddingHorizontal: 20,
      textTransform: "uppercase",
    },
    summaryCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    summaryCell: {
      flex: 1,
      minWidth: 0,
    },
    summaryCellHeader: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
      marginBottom: 6,
    },
    summaryCellLabel: {
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.2,
      textTransform: "uppercase",
    },
    summaryCellValue: {
      color: theme.textPrimary,
    },
    summaryCellValueEmphasis: {
      color: theme.textPrimary,
    },
    summaryGridRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },
    summaryGridRowFirst: {
      marginTop: 0,
    },
    timeChip: {
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    timeChipPressed: {
      opacity: 0.9,
    },
    timeChipSelected: {
      borderColor: theme.accent,
      borderWidth: 2,
    },
    timeChipText: {
      color: theme.textSecondary,
      fontSize: 15,
      fontWeight: "600",
    },
    timeChipTextSelected: {
      color: theme.textPrimary,
      fontWeight: "600",
    },
    timeRow: {
      flexGrow: 0,
      marginTop: 8,
      maxHeight: 52,
    },
    timeRowContent: {
      paddingHorizontal: 20,
      paddingVertical: 4,
    },
    timeSectionTitle: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 20,
      paddingHorizontal: 20,
      textTransform: "uppercase",
    },
    timeSlotsEmptyHint: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 10,
      paddingHorizontal: 20,
    },
  });
}
