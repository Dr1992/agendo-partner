import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, Text } from "react-native";

import { Text as AppText } from "../../../components/Text";
import type { TimeSlotOption } from "../../../types/timeSlot";
import type { AppTheme } from "../../../theme";
import { getBookingScheduleStyles } from "../styles";

import { slotTimeLabel } from "../bookingScheduleHelpers";

type Styles = ReturnType<typeof getBookingScheduleStyles>;

type BookingScheduleTimeSlotsSectionProps = {
  onSelectSlot: (slot: TimeSlotOption) => void;
  screenStyles: Styles;
  selectedSlot: TimeSlotOption | null;
  showClosedDayHint: boolean;
  showNoSlotsHint: boolean;
  showTimeSlotsError: boolean;
  showTimeSlotsLoader: boolean;
  slotsErrorMessage: string | undefined;
  slotsForSelectedDay: TimeSlotOption[];
  theme: AppTheme;
};

export function BookingScheduleTimeSlotsSection({
  onSelectSlot,
  screenStyles,
  selectedSlot,
  showClosedDayHint,
  showNoSlotsHint,
  showTimeSlotsError,
  showTimeSlotsLoader,
  slotsErrorMessage,
  slotsForSelectedDay,
  theme,
}: BookingScheduleTimeSlotsSectionProps) {
  const { t } = useTranslation("booking");

  return (
    <>
      <Text style={screenStyles.timeSectionTitle}>
        {t("schedule.timeSectionTitle")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={screenStyles.timeRow}
        contentContainerStyle={screenStyles.timeRowContent}
      >
        {showTimeSlotsLoader ? (
          <ActivityIndicator color={theme.accent} size="small" />
        ) : showTimeSlotsError ? (
          <Text style={screenStyles.errorText}>
            {slotsErrorMessage ?? t("schedule.slotsLoadError")}
          </Text>
        ) : showClosedDayHint || showNoSlotsHint ? null : (
          slotsForSelectedDay.map((slot) => {
            const selected = selectedSlot?.startsAt === slot.startsAt;
            return (
              <Pressable
                key={slot.startsAt}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  screenStyles.timeChip,
                  selected && screenStyles.timeChipSelected,
                  pressed && screenStyles.timeChipPressed,
                ]}
                onPress={() => onSelectSlot(slot)}
              >
                <Text
                  style={[
                    screenStyles.timeChipText,
                    selected && screenStyles.timeChipTextSelected,
                  ]}
                >
                  {slotTimeLabel(slot.startsAt)}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
      {showClosedDayHint || showNoSlotsHint ? (
        <AppText style={screenStyles.timeSlotsEmptyHint} variant="hint">
          {showClosedDayHint
            ? t("schedule.closedDayHint")
            : t("schedule.noSlotsHint")}
        </AppText>
      ) : null}
    </>
  );
}
