import { useTranslation } from "react-i18next";
import { ScrollView, Pressable, Text, View } from "react-native";

import type { Professional } from "../../../types/professional";
import { getBookingScheduleStyles } from "../styles";

import { initials } from "../bookingScheduleHelpers";

type Styles = ReturnType<typeof getBookingScheduleStyles>;

type BookingScheduleProfessionalStripProps = {
  onSelectStaff: (staffId: string) => void;
  professionalIdResolved: string;
  screenStyles: Styles;
  staffList: Professional[];
};

export function BookingScheduleProfessionalStrip({
  onSelectStaff,
  professionalIdResolved,
  screenStyles,
  staffList,
}: BookingScheduleProfessionalStripProps) {
  const { t } = useTranslation("booking");

  if (staffList.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={screenStyles.sectionTitle}>
        {t("schedule.professionalSectionTitle")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={screenStyles.professionalStrip}
        contentContainerStyle={screenStyles.professionalStripContent}
      >
        {staffList.map((participant) => (
          <Pressable
            key={participant.id}
            accessibilityRole="button"
            style={screenStyles.professionalStripItem}
            onPress={() => onSelectStaff(participant.id)}
          >
            <View
              style={[
                screenStyles.professionalAvatar,
                professionalIdResolved === participant.id &&
                  screenStyles.professionalAvatarSelected,
              ]}
            >
              <Text style={screenStyles.professionalInitials}>
                {initials(participant.name)}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={[
                screenStyles.professionalName,
                professionalIdResolved === participant.id &&
                  screenStyles.professionalNameSelected,
              ]}
            >
              {participant.name.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
