import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppointmentsStackParamList } from "../navigation/appointmentsNavigation.types";
import { AppointmentsStack } from "../navigation/routeIds";
import { BookingConfirmScreen } from "../screens/BookingConfirmScreen/BookingConfirmScreen";
import { BookingScheduleScreen } from "../screens/BookingScheduleScreen/BookingScheduleScreen";
import { ServiceSelectScreen } from "../screens/ServiceSelectScreen/ServiceSelectScreen";
import { StaffAgendaCalendarScreen } from "../screens/StaffAgendaCalendarScreen/StaffAgendaCalendarScreen";
import { StaffAgendaDetailScreen } from "../screens/StaffAgendaDetailScreen/StaffAgendaDetailScreen";
import { StaffAgendaListScreen } from "../screens/StaffAgendaListScreen/StaffAgendaListScreen";
import { StaffNewBookingTypeScreen } from "../screens/StaffNewBookingTypeScreen/StaffNewBookingTypeScreen";
import { StaffPersonalCommitmentScreen } from "../screens/StaffPersonalCommitmentScreen/StaffPersonalCommitmentScreen";

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export function AgendaNavigator() {
  const { theme } = useAppTheme();
  const navTheme = useTheme();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator
      initialRouteName={AppointmentsStack.StaffAgendaList}
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerBackButtonDisplayMode: "minimal",
        headerBackTitle: "",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: navTheme.colors.primary,
        headerTitleStyle: { color: theme.textPrimary, fontSize: 16 },
      }}
    >
      <Stack.Screen
        component={StaffAgendaListScreen}
        name={AppointmentsStack.StaffAgendaList}
        options={{ title: t("agenda.listTitle") }}
      />
      <Stack.Screen
        component={StaffAgendaCalendarScreen}
        name={AppointmentsStack.StaffAgendaCalendar}
        options={{ title: t("agenda.calendarTitle") }}
      />
      <Stack.Screen
        component={StaffAgendaDetailScreen}
        name={AppointmentsStack.StaffAgendaDetail}
        options={{ title: t("agenda.detailTitle") }}
      />
      <Stack.Screen
        component={StaffNewBookingTypeScreen}
        name={AppointmentsStack.StaffNewBookingType}
        options={{ title: t("agenda.newBookingTypeTitle") }}
      />
      <Stack.Screen
        component={StaffPersonalCommitmentScreen}
        name={AppointmentsStack.StaffPersonalCommitment}
        options={{ title: t("agenda.personalCommitmentTitle") }}
      />
      <Stack.Screen
        component={ServiceSelectScreen}
        name={AppointmentsStack.StaffBookingServiceSelect}
        options={{ title: t("agenda.bookingServiceSelectTitle") }}
      />
      <Stack.Screen
        component={BookingScheduleScreen}
        name={AppointmentsStack.StaffBookingSchedule}
        options={{ title: t("agenda.bookingScheduleTitle") }}
      />
      <Stack.Screen
        component={BookingConfirmScreen}
        name={AppointmentsStack.StaffBookingConfirm}
        options={{ title: t("agenda.bookingConfirmTitle") }}
      />
    </Stack.Navigator>
  );
}
