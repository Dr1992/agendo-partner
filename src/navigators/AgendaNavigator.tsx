import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";

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
        options={{ title: "Agenda" }}
      />
      <Stack.Screen
        component={StaffAgendaCalendarScreen}
        name={AppointmentsStack.StaffAgendaCalendar}
        options={{ title: "Agenda" }}
      />
      <Stack.Screen
        component={StaffAgendaDetailScreen}
        name={AppointmentsStack.StaffAgendaDetail}
        options={{ title: "Disponibilidade" }}
      />
      <Stack.Screen
        component={StaffNewBookingTypeScreen}
        name={AppointmentsStack.StaffNewBookingType}
        options={{ title: "Novo" }}
      />
      <Stack.Screen
        component={StaffPersonalCommitmentScreen}
        name={AppointmentsStack.StaffPersonalCommitment}
        options={{ title: "Compromisso Pessoal" }}
      />
      <Stack.Screen
        component={ServiceSelectScreen}
        name={AppointmentsStack.StaffBookingServiceSelect}
        options={{ title: "Agendar para cliente" }}
      />
      <Stack.Screen
        component={BookingScheduleScreen}
        name={AppointmentsStack.StaffBookingSchedule}
        options={{ title: "Data e hora do atendimento" }}
      />
      <Stack.Screen
        component={BookingConfirmScreen}
        name={AppointmentsStack.StaffBookingConfirm}
        options={{ title: "Registar atendimento" }}
      />
    </Stack.Navigator>
  );
}
