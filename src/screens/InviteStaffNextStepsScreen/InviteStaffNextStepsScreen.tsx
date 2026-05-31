import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/Button";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { ProfileStack } from "../../navigation/routeIds";

import { getInviteStaffNextStepsStyles } from "./styles";

export function InviteStaffNextStepsScreen({
  navigation,
  route,
}: ProfileScreenProps<"InviteStaffNextSteps">) {
  const { establishmentId, establishmentName, inviteId, autoAccepted } =
    route.params;
  const { theme } = useAppTheme();
  const { t } = useTranslation("team");
  const formStyles = getScreenFormStyles(theme);
  const local = useMemo(() => getInviteStaffNextStepsStyles(theme), [theme]);

  const body = autoAccepted
    ? t("nextSteps.bodyAutoAccepted")
    : t("nextSteps.bodyPending");

  return (
    <SafeAreaView edges={[]} style={formStyles.container}>
      <ScrollView
        contentContainerStyle={formStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={formStyles.scroll}
      >
        <Text style={local.body} variant="body">
          {body}
        </Text>
        <View style={local.actions}>
          <Button
            onPress={() =>
              navigation.navigate(ProfileStack.PendingInviteLinkServices, {
                establishmentId,
                establishmentName,
                inviteId,
                afterInviteFlow: true,
              })
            }
          >
            {t("nextSteps.linkServicesButton")}
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              navigation.pop(2);
            }}
          >
            {t("nextSteps.laterButton")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
