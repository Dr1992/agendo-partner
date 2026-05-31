import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import type { ProfileStackParamList } from "../navigation/profileNavigation.types";
import { ProfileStack } from "../navigation/routeIds";
import { EstablishmentCollaboratorsScreen } from "../screens/EstablishmentCollaboratorsScreen/EstablishmentCollaboratorsScreen";
import { EstablishmentEditScreen } from "../screens/EstablishmentEditScreen/EstablishmentEditScreen";
import { EstablishmentHubScreen } from "../screens/EstablishmentHubScreen/EstablishmentHubScreen";
import { EstablishmentRegisterScreen } from "../screens/EstablishmentRegisterScreen/EstablishmentRegisterScreen";
import { EstablishmentServiceFormScreen } from "../screens/EstablishmentServiceFormScreen/EstablishmentServiceFormScreen";
import { EstablishmentServicesScreen } from "../screens/EstablishmentServicesScreen/EstablishmentServicesScreen";
import { InviteStaffNextStepsScreen } from "../screens/InviteStaffNextStepsScreen/InviteStaffNextStepsScreen";
import { InviteStaffScreen } from "../screens/InviteStaffScreen/InviteStaffScreen";
import { PartnerHomeScreen } from "../screens/PartnerHomeScreen/PartnerHomeScreen";
import { PartnerPlaceholderScreen } from "../screens/PartnerPlaceholderScreen/PartnerPlaceholderScreen";
import { PendingInviteLinkServicesScreen } from "../screens/PendingInviteLinkServicesScreen/PendingInviteLinkServicesScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function EstabelecimentosNavigator() {
  const { theme } = useAppTheme();
  const navTheme = useTheme();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator
      initialRouteName={ProfileStack.PartnerHome}
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
        component={PartnerHomeScreen}
        name={ProfileStack.PartnerHome}
        options={{ title: t("establishments.homeTitle") }}
      />
      <Stack.Screen
        component={EstablishmentRegisterScreen}
        name={ProfileStack.EstablishmentRegister}
        options={{ title: t("establishments.registerTitle") }}
      />
      <Stack.Screen
        component={EstablishmentHubScreen}
        name={ProfileStack.EstablishmentHub}
        options={{ title: t("establishments.hubTitle") }}
      />
      <Stack.Screen
        component={EstablishmentEditScreen}
        name={ProfileStack.EstablishmentEdit}
        options={{ title: t("establishments.editTitle") }}
      />
      <Stack.Screen
        component={EstablishmentCollaboratorsScreen}
        name={ProfileStack.EstablishmentCollaborators}
        options={{ title: t("establishments.collaboratorsTitle") }}
      />
      <Stack.Screen
        component={EstablishmentServicesScreen}
        name={ProfileStack.EstablishmentServices}
        options={{ title: t("establishments.servicesTitle") }}
      />
      <Stack.Screen
        component={EstablishmentServiceFormScreen}
        name={ProfileStack.EstablishmentServiceForm}
        options={({ route }) => ({
          title: route.params.serviceId
            ? t("establishments.serviceFormEditTitle")
            : t("establishments.serviceFormNewTitle"),
        })}
      />
      <Stack.Screen
        component={InviteStaffScreen}
        name={ProfileStack.InviteStaff}
        options={{ title: t("establishments.inviteStaffTitle") }}
      />
      <Stack.Screen
        component={InviteStaffNextStepsScreen}
        name={ProfileStack.InviteStaffNextSteps}
        options={{
          title: t("establishments.inviteStaffNextStepsTitle"),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        component={PendingInviteLinkServicesScreen}
        name={ProfileStack.PendingInviteLinkServices}
        options={{ title: t("establishments.pendingInviteLinkServicesTitle") }}
      />
      <Stack.Screen
        component={PartnerPlaceholderScreen}
        name={ProfileStack.PartnerPlaceholder}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
