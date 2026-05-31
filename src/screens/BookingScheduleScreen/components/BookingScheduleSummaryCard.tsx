import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Text as AppText } from "../../../components/Text";
import { SERVICE_IONICON } from "../../../constants/serviceIonicon";
import type { AppTheme } from "../../../theme";
import { getBookingScheduleStyles } from "../styles";

type Styles = ReturnType<typeof getBookingScheduleStyles>;

type BookingScheduleSummaryCardProps = {
  priceAmountLabel: string;
  screenStyles: Styles;
  selectedProfessionalLabel: string;
  serviceName: string;
  slotRangeLabel: string;
  theme: AppTheme;
};

export function BookingScheduleSummaryCard({
  priceAmountLabel,
  screenStyles,
  selectedProfessionalLabel,
  serviceName,
  slotRangeLabel,
  theme,
}: BookingScheduleSummaryCardProps) {
  const { t } = useTranslation("booking");

  return (
    <View style={screenStyles.summaryCard}>
      <View
        style={[screenStyles.summaryGridRow, screenStyles.summaryGridRowFirst]}
      >
        <View style={screenStyles.summaryCell}>
          <View style={screenStyles.summaryCellHeader}>
            <Ionicons color={theme.accent} name={SERVICE_IONICON} size={18} />
            <AppText style={screenStyles.summaryCellLabel} variant="caption">
              {t("schedule.summaryService")}
            </AppText>
          </View>
          <AppText
            numberOfLines={2}
            style={screenStyles.summaryCellValue}
            variant="bodyTight"
          >
            {serviceName}
          </AppText>
        </View>
        <View style={screenStyles.summaryCell}>
          <View style={screenStyles.summaryCellHeader}>
            <Ionicons color={theme.accent} name="cash-outline" size={18} />
            <AppText style={screenStyles.summaryCellLabel} variant="caption">
              {t("schedule.summaryPrice")}
            </AppText>
          </View>
          <AppText
            style={screenStyles.summaryCellValueEmphasis}
            variant="listTitle"
          >
            {priceAmountLabel}
          </AppText>
        </View>
      </View>
      <View style={screenStyles.summaryGridRow}>
        <View style={screenStyles.summaryCell}>
          <View style={screenStyles.summaryCellHeader}>
            <Ionicons color={theme.accent} name="time-outline" size={18} />
            <AppText style={screenStyles.summaryCellLabel} variant="caption">
              {t("schedule.summaryTime")}
            </AppText>
          </View>
          <AppText style={screenStyles.summaryCellValue} variant="bodyTight">
            {slotRangeLabel}
          </AppText>
        </View>
        <View style={screenStyles.summaryCell}>
          <View style={screenStyles.summaryCellHeader}>
            <Ionicons color={theme.accent} name="person-outline" size={18} />
            <AppText style={screenStyles.summaryCellLabel} variant="caption">
              {t("schedule.summaryCollaborator")}
            </AppText>
          </View>
          <AppText
            numberOfLines={2}
            style={screenStyles.summaryCellValue}
            variant="bodyTight"
          >
            {selectedProfessionalLabel}
          </AppText>
        </View>
      </View>
    </View>
  );
}
