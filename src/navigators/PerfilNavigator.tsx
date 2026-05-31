import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import type { ProfileStackParamList } from "../navigation/profileNavigation.types";
import { ProfileStack } from "../navigation/routeIds";
import { CompleteProfileScreen } from "../screens/CompleteProfileScreen/CompleteProfileScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen/EditProfileScreen";
import { ProfileScreen } from "../screens/ProfileScreen/ProfileScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function PerfilNavigator() {
  const { theme } = useAppTheme();
  const navTheme = useTheme();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator
      initialRouteName={ProfileStack.ProfileMain}
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
        component={ProfileScreen}
        name={ProfileStack.ProfileMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={CompleteProfileScreen}
        name={ProfileStack.CompleteProfile}
        options={{ title: t("profile.completeTitle") }}
      />
      <Stack.Screen
        component={EditProfileScreen}
        name={ProfileStack.EditProfile}
        options={{ title: t("profile.editTitle") }}
      />
    </Stack.Navigator>
  );
}
