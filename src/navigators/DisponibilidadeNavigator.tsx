import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import type { DisponibilidadeStackParamList } from "../navigation/disponibilidadeNavigation.types";
import { DisponibilidadeListScreen } from "../screens/DisponibilidadeListScreen/DisponibilidadeListScreen";
import { StaffAgendaDetailScreen } from "../screens/StaffAgendaDetailScreen/StaffAgendaDetailScreen";

const Stack = createNativeStackNavigator<DisponibilidadeStackParamList>();

export function DisponibilidadeNavigator() {
  const { theme } = useAppTheme();
  const navTheme = useTheme();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator
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
        component={DisponibilidadeListScreen}
        name="DisponibilidadeList"
        options={{ title: t("availability.listTitle") }}
      />
      <Stack.Screen
        component={StaffAgendaDetailScreen}
        name="StaffAgendaDetail"
        options={{ title: t("availability.detailTitle") }}
      />
    </Stack.Navigator>
  );
}
