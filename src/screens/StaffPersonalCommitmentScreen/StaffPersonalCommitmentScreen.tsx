import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { renderAgendoCalendarDay } from "../../components/AgendoCalendarDay";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { HourMinutePickerModal } from "../../components/HourMinutePickerModal/HourMinutePickerModal";
import { MonthCalendar } from "../../components/MonthCalendar/MonthCalendar";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppointmentsScreenProps } from "../../navigation/appointmentsNavigation.types";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";

import { useStaffPersonalCommitmentScreen } from "./hooks/useStaffPersonalCommitmentScreen";
import { getStaffPersonalCommitmentStyles } from "./styles";

export type StaffPersonalCommitmentScreenProps =
  | AppointmentsScreenProps<"StaffPersonalCommitment">
  | ProfileScreenProps<"StaffPersonalCommitment">;

export function StaffPersonalCommitmentScreen({
  route,
}: StaffPersonalCommitmentScreenProps) {
  const { establishmentId } = route.params;
  const { t } = useTranslation("staff");
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getStaffPersonalCommitmentStyles(theme),
    [theme],
  );

  const {
    calendarDayCtx,
    canSave,
    description,
    endHHMM,
    markedDates,
    onConfirmTime,
    onConfirmOverlap,
    onDayPress,
    onMonthChange,
    onSavePress,
    setDescription,
    setTimePickerTarget,
    showOverlapAlert,
    setShowOverlapAlert,
    startHHMM,
    timeError,
    timePickerTarget,
    viewMonth,
    viewYear,
  } = useStaffPersonalCommitmentScreen(establishmentId);

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <View style={styles.calendarSection}>
          <MonthCalendar
            markedDates={markedDates}
            minDate={`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`}
            monthIndex={viewMonth}
            renderDay={(args) => renderAgendoCalendarDay(args, calendarDayCtx)}
            weekStartsOn="monday"
            year={viewYear}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel} variant="fieldLabel">
            {t("personalCommitment.scheduleLabel")}
          </Text>
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              style={styles.timeRow}
              onPress={() => setTimePickerTarget("start")}
            >
              <View style={styles.timeRowIcon}>
                <Ionicons color={theme.accent} name="time-outline" size={18} />
              </View>
              <Text style={styles.timeRowLabel} variant="caption">
                {t("personalCommitment.startLabel")}
              </Text>
              <Text
                style={
                  startHHMM ? styles.timeRowValue : styles.timeRowValueEmpty
                }
                variant="bodyTight"
              >
                {startHHMM ?? "00:00"}
              </Text>
              <Ionicons
                color={theme.textHint}
                name="chevron-forward"
                size={18}
              />
            </Pressable>

            <View style={styles.timeRowDivider} />

            <Pressable
              accessibilityRole="button"
              style={styles.timeRow}
              onPress={() => setTimePickerTarget("end")}
            >
              <View style={styles.timeRowIcon}>
                <Ionicons color={theme.accent} name="time-outline" size={18} />
              </View>
              <Text style={styles.timeRowLabel} variant="caption">
                {t("personalCommitment.endLabel")}
              </Text>
              <Text
                style={endHHMM ? styles.timeRowValue : styles.timeRowValueEmpty}
                variant="bodyTight"
              >
                {endHHMM ?? "00:00"}
              </Text>
              <Ionicons
                color={theme.textHint}
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          </View>

          {timeError ? (
            <Text style={styles.errorText} variant="caption">
              {timeError}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel} variant="fieldLabel">
            {t("personalCommitment.descriptionLabel")}
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder={t("personalCommitment.descriptionPlaceholder")}
            placeholderTextColor={theme.textHint}
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          disabled={!canSave}
          style={({ pressed }) => [
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
            pressed && canSave && styles.saveButtonPressed,
          ]}
          onPress={onSavePress}
        >
          <Text style={styles.saveButtonLabel} variant="bodyTight">
            {t("personalCommitment.save")}
          </Text>
        </Pressable>
      </View>

      <HourMinutePickerModal
        initialHHMM={
          timePickerTarget === "start"
            ? (startHHMM ?? "09:00")
            : (endHHMM ?? "10:00")
        }
        mode="clock"
        title={
          timePickerTarget === "start"
            ? t("personalCommitment.startTimeTitle")
            : t("personalCommitment.endTimeTitle")
        }
        visible={timePickerTarget !== null}
        onClose={() => setTimePickerTarget(null)}
        onConfirm={onConfirmTime}
      />

      <AlertDialog
        buttons={[
          {
            label: t("personalCommitment.overlapCancel"),
            variant: "secondary",
            onPress: () => setShowOverlapAlert(false),
          },
          {
            label: t("personalCommitment.overlapConfirm"),
            variant: "primary",
            onPress: onConfirmOverlap,
          },
        ]}
        message={t("personalCommitment.overlapMessage")}
        title={t("personalCommitment.overlapTitle")}
        visible={showOverlapAlert}
        onRequestClose={() => setShowOverlapAlert(false)}
      />
    </SafeAreaView>
  );
}
