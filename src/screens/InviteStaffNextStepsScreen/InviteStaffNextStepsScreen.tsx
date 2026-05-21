import { useMemo } from "react";
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
  const formStyles = getScreenFormStyles(theme);
  const local = useMemo(() => getInviteStaffNextStepsStyles(theme), [theme]);

  const body = autoAccepted
    ? "Este CPF já tem cadastro na nossa base, por isso esse membro já faz parte da equipe. Associe serviços abaixo para esse colaborador passe a "
    : "Registramos este CPF para a equipe. A pessoa precisa criar conta no app e completar o perfil com o mesmo CPF: aí o acesso ao local fica ativo e ela passa a aparecer na equipe e na agenda. Pode já vincular serviços ao convite; os vínculos passam a valer quando o cadastro for concluído.";

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
            Vincular a serviços
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              navigation.pop(2);
            }}
          >
            Fazer depois
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
