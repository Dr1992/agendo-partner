import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { renderAgendoCalendarDay } from "../../components/AgendoCalendarDay";
import { MonthCalendar } from "../../components/MonthCalendar/MonthCalendar";
import { Text } from "../../components/Text";
import { SERVICE_IONICON } from "../../constants/serviceIonicon";
import { useStaffAgendaCalendarScreen } from "./hooks/useStaffAgendaCalendarScreen";
import {
  formatBookingRange,
  formatBookingStatusLabel,
} from "./utils/bookingFormat";
import type { StaffAgendaCalendarScreenProps } from "./types";

export type { StaffAgendaCalendarScreenProps } from "./types";

export function StaffAgendaCalendarScreen(
  props: StaffAgendaCalendarScreenProps,
) {
  const { t } = useTranslation("staff");
  const {
    bookingsForSelected,
    cancelDialogBookingId,
    cancelError,
    cancelMutation,
    confirmStaffCancel,
    isPending,
    local,
    onStaffCalendarMonthChange,
    selectedKey,
    setCancelDialogBookingId,
    setCancelError,
    setSelectedKey,
    staffCalendarDayCtx,
    staffMarkedDates,
    styles,
    summaryStyles,
    theme,
    viewMonth,
    viewYear,
  } = useStaffAgendaCalendarScreen(props);

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <AlertDialog
        buttons={[
          {
            label: t("calendar.cancelBack"),
            onPress: () => setCancelDialogBookingId(null),
            variant: "secondary",
          },
          {
            label: cancelMutation.isPending
              ? t("calendar.cancelInProgress")
              : t("calendar.cancelSubmit"),
            onPress: confirmStaffCancel,
            variant: "destructive",
          },
        ]}
        message={t("calendar.cancelConfirmMessage")}
        title={t("calendar.cancelConfirmTitle")}
        visible={cancelDialogBookingId !== null}
        onRequestClose={() => setCancelDialogBookingId(null)}
      />
      {cancelError ? (
        <AlertDialog
          buttons={[
            {
              label: t("calendar.ok"),
              onPress: () => setCancelError(null),
              variant: "primary",
            },
          ]}
          message={cancelError.message}
          title={cancelError.title}
          visible
          onRequestClose={() => setCancelError(null)}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Text style={local.intro} variant="hint">
          {t("calendar.intro")}
        </Text>

        <MonthCalendar
          footerBelowGrid={
            <View style={local.legendRow}>
              <View style={local.legendDot} />
              <Text style={local.legendLabel} variant="caption">
                {t("calendar.legendLabel")}
              </Text>
            </View>
          }
          loading={isPending}
          loadingHint={t("calendar.loadingHint")}
          markedDates={staffMarkedDates}
          monthIndex={viewMonth}
          renderDay={(args) =>
            renderAgendoCalendarDay(args, staffCalendarDayCtx)
          }
          weekStartsOn="monday"
          weekVerticalMargin={4}
          year={viewYear}
          onDayPress={(d) => setSelectedKey(d.dateString)}
          onMonthChange={onStaffCalendarMonthChange}
        />

        <View style={local.detailSection}>
          <Text style={local.sectionTitle} variant="fieldLabel">
            {selectedKey
              ? t("calendar.slotsForDate", {
                  date: selectedKey.split("-").reverse().join("/"),
                })
              : t("calendar.dayDetailTitle")}
          </Text>
          {!selectedKey ? (
            <Text variant="body">{t("calendar.selectDayHint")}</Text>
          ) : bookingsForSelected.length === 0 ? (
            <Text variant="body">{t("calendar.emptyDay")}</Text>
          ) : (
            bookingsForSelected.map((booking, index) => (
              <View
                key={booking.id}
                style={[
                  summaryStyles.summaryCard,
                  local.staffSummaryCard,
                  index > 0 && local.staffSummaryCardSpacing,
                ]}
              >
                <View
                  style={[
                    summaryStyles.summaryGridRow,
                    summaryStyles.summaryGridRowFirst,
                  ]}
                >
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="time-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        {t("calendar.timeLabel")}
                      </Text>
                    </View>
                    <Text
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {formatBookingRange(booking.startsAt, booking.endsAt)}
                    </Text>
                  </View>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name={SERVICE_IONICON}
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        {t("calendar.serviceLabel")}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {booking.serviceName}
                    </Text>
                  </View>
                </View>
                <View style={summaryStyles.summaryGridRow}>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="person-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        {t("calendar.clientLabel")}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {booking.customerDisplayName}
                    </Text>
                  </View>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="flag-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        {t("calendar.statusLabel")}
                      </Text>
                    </View>
                    <Text
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {formatBookingStatusLabel(booking.status, t)}
                    </Text>
                  </View>
                </View>
                <View style={local.summaryCancelFooter}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: cancelMutation.isPending }}
                    disabled={cancelMutation.isPending}
                    style={({ pressed }) => [
                      local.summaryCancelButton,
                      pressed && local.summaryCancelButtonPressed,
                    ]}
                    onPress={() => setCancelDialogBookingId(booking.id)}
                  >
                    <Text
                      style={local.summaryCancelButtonLabel}
                      variant="bodyTight"
                    >
                      {t("calendar.cancelBooking")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
