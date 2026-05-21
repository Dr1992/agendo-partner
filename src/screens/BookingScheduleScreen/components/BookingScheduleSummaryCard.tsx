import { Ionicons } from "@expo/vector-icons";
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
  return (
    <View style={screenStyles.summaryCard}>
      <View
        style={[screenStyles.summaryGridRow, screenStyles.summaryGridRowFirst]}
      >
        <View style={screenStyles.summaryCell}>
          <View style={screenStyles.summaryCellHeader}>
            <Ionicons color={theme.accent} name={SERVICE_IONICON} size={18} />
            <AppText style={screenStyles.summaryCellLabel} variant="caption">
              Serviço
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
              Preço
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
              Horário
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
              Colaborador
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
