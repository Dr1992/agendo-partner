import { View } from "react-native";

import { Text as AppText } from "../../../components/Text";
import { getBookingScheduleStyles } from "../styles";

type Styles = ReturnType<typeof getBookingScheduleStyles>;

type BookingScheduleInlineNoticesProps = {
  screenStyles: Styles;
  staffAssistedBooking: boolean;
};

export function BookingScheduleInlineNotices({
  screenStyles,
  staffAssistedBooking,
}: BookingScheduleInlineNoticesProps) {
  if (!staffAssistedBooking) {
    return null;
  }

  return (
    <View style={screenStyles.staffOwnAgendaNotice}>
      <AppText
        style={screenStyles.staffOwnAgendaNoticeText}
        variant="bodyTight"
      >
        Você está agendando na sua agenda como profissional deste local. Os
        horários seguem a mesma regra de disponibilidade da app e não se
        sobrepõem a outros atendimentos já reservados.
      </AppText>
    </View>
  );
}
