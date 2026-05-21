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
  return (
    <>
      <Text style={screenStyles.timeSectionTitle}>Horários</Text>
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
            {slotsErrorMessage ?? "Não foi possível carregar horários."}
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
            ? "O estabelecimento não abre neste dia da semana."
            : "Não há horários disponíveis para esta data."}
        </AppText>
      ) : null}
    </>
  );
}
