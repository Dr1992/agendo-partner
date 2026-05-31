import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("booking");

  if (!staffAssistedBooking) {
    return null;
  }

  return (
    <View style={screenStyles.staffOwnAgendaNotice}>
      <AppText
        style={screenStyles.staffOwnAgendaNoticeText}
        variant="bodyTight"
      >
        {t("schedule.staffOwnAgendaNotice")}
      </AppText>
    </View>
  );
}
