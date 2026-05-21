import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/Button";
import { LoadingCentered } from "../../components/LoadingCentered";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { usePendingInviteLinkServicesScreen } from "./hooks/usePendingInviteLinkServicesScreen";
import { getPendingInviteLinkServicesScreenStyles } from "./styles";

export function PendingInviteLinkServicesScreen(
  props: ProfileScreenProps<"PendingInviteLinkServices">,
) {
  const { theme } = useAppTheme();
  const formStyles = getScreenFormStyles(theme);
  const local = useMemo(
    () => getPendingInviteLinkServicesScreenStyles(theme),
    [theme],
  );

  const { onSave, saveMutation, selected, services, servicesQuery, toggle } =
    usePendingInviteLinkServicesScreen(props);

  const servicesPending = servicesQuery.isPending;
  const servicesRes = servicesQuery.data;

  if (servicesPending && !servicesRes) {
    return (
      <SafeAreaView edges={[]} style={formStyles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={formStyles.container}>
      <ScrollView
        contentContainerStyle={formStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={formStyles.scroll}
      >
        <Text style={local.hint} variant="hint">
          Toque para marcar ou desmarcar. Só serviços com lista explícita de
          prestadores passam a incluir esta pessoa automaticamente; em serviços
          em que “todos” atendem, não é necessário vincular.
        </Text>
        {services.length === 0 ? (
          <Text variant="body">Não há serviços activos neste local.</Text>
        ) : (
          services.map((s) => {
            const on = selected.has(s.id);
            return (
              <Pressable
                key={s.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                style={({ pressed }) => [
                  local.row,
                  pressed && local.rowPressed,
                ]}
                onPress={() => toggle(s.id)}
              >
                <Ionicons
                  color={on ? theme.accent : theme.textMuted}
                  name={on ? "checkbox" : "square-outline"}
                  size={22}
                />
                <View style={local.rowText}>
                  <Text variant="bodyTight">{s.name}</Text>
                  {s.durationMinutes ? (
                    <Text variant="hint">{s.durationMinutes} min</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })
        )}
        <View style={local.saveBlock}>
          {saveMutation.isPending ? (
            <ActivityIndicator color={theme.accent} />
          ) : (
            <Button
              disabled={services.length === 0}
              onPress={() => void onSave()}
            >
              Confirmar
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
