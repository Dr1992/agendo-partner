import { Ionicons } from "@expo/vector-icons";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppointmentsStackParamList } from "../navigation/appointmentsNavigation.types";
import type { DisponibilidadeStackParamList } from "../navigation/disponibilidadeNavigation.types";
import type { ProfileStackParamList } from "../navigation/profileNavigation.types";
import { PartnerMainTab } from "../navigation/routeIds";
import { AgendaNavigator } from "./AgendaNavigator";
import { DisponibilidadeNavigator } from "./DisponibilidadeNavigator";
import { EstabelecimentosNavigator } from "./EstabelecimentosNavigator";
import { PerfilNavigator } from "./PerfilNavigator";

export type PerfilStackParamList = Pick<
  ProfileStackParamList,
  "ProfileMain" | "CompleteProfile" | "EditProfile"
>;

export type PartnerMainTabParamList = {
  Agenda: NavigatorScreenParams<AppointmentsStackParamList>;
  Disponibilidade: NavigatorScreenParams<DisponibilidadeStackParamList>;
  Estabelecimentos: NavigatorScreenParams<ProfileStackParamList>;
  Perfil: NavigatorScreenParams<PerfilStackParamList>;
};

const Tab = createBottomTabNavigator<PartnerMainTabParamList>();

export function PartnerMainTabNavigator() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabIconActive,
        tabBarInactiveTintColor: theme.tabIconInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          ...(Platform.OS === "android" && { height: 60 }),
        },
      }}
    >
      <Tab.Screen
        component={AgendaNavigator}
        name={PartnerMainTab.Agenda}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="calendar-outline" size={size} />
          ),
          title: "Agenda",
        }}
      />
      <Tab.Screen
        component={DisponibilidadeNavigator}
        name={PartnerMainTab.Disponibilidade}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="time-outline" size={size} />
          ),
          title: "Disponibilidade",
        }}
      />
      <Tab.Screen
        component={EstabelecimentosNavigator}
        name={PartnerMainTab.Estabelecimentos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="storefront-outline" size={size} />
          ),
          title: "Estabelecimentos",
        }}
      />
      <Tab.Screen
        component={PerfilNavigator}
        name={PartnerMainTab.Perfil}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="person-outline" size={size} />
          ),
          title: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}
