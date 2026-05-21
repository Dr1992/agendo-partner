import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { SERVICE_IONICON } from "../../constants/serviceIonicon";
import { LoadingCentered } from "../../components/LoadingCentered";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { ProfileStack } from "../../navigation/routeIds";
import type { AppTheme } from "../../theme";
import { useEstablishmentHubScreen } from "./hooks/useEstablishmentHubScreen";
import { getEstablishmentHubScreenStyles } from "./styles";

type HubMenuRowProps = {
  disabled?: boolean;
  hub: ReturnType<typeof getEstablishmentHubScreenStyles>;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  subtitle: string;
  theme: AppTheme;
  title: string;
};

function HubMenuRow({
  disabled = false,
  hub,
  icon,
  onPress,
  subtitle,
  theme,
  title,
}: HubMenuRowProps) {
  const iconColor = disabled ? theme.textMuted : theme.accent;
  const chevronColor = disabled ? theme.textMuted : theme.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        hub.menuRow,
        disabled && hub.menuRowDisabled,
        !disabled && pressed && hub.menuRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={hub.iconCircle}>
        <Ionicons color={iconColor} name={icon} size={22} />
      </View>
      <View style={hub.menuRowText}>
        <Text
          style={disabled ? hub.menuRowTitleDisabled : undefined}
          variant="bodyTight"
        >
          {title}
        </Text>
        <Text style={hub.menuSubtitle} variant="hint">
          {subtitle}
        </Text>
      </View>
      <Ionicons color={chevronColor} name="chevron-forward" size={22} />
    </Pressable>
  );
}

export function EstablishmentHubScreen(
  props: ProfileScreenProps<"EstablishmentHub">,
) {
  const { navigation } = props;
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const hub = useMemo(() => getEstablishmentHubScreenStyles(theme), [theme]);
  const insets = useSafeAreaInsets();

  const {
    canManage,
    canToggleActive,
    confirmLeave,
    dismissReactivateError,
    establishmentQuery,
    isEstablishmentInactive,
    isStaffMember,
    leaveError,
    leavePending,
    menuDisabled,
    onReactivate,
    reactivateError,
    reactivateMutation,
    setLeaveError,
    setShowLeaveAlert,
    showLeaveAlert,
    showFooterUnlock,
  } = useEstablishmentHubScreen(props);

  const { data: est, error, isError, isPending, refetch } = establishmentQuery;

  const unlockBusy = reactivateMutation.isPending;

  if (isPending && est === undefined) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (isError || !est) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">
          {error instanceof Error
            ? error.message
            : "Local não encontrado ou sem permissão."}
        </Text>
        {isError ? (
          <Button
            style={styles.ctaRetryFullWidth}
            onPress={() => void refetch()}
          >
            Tentar novamente
          </Button>
        ) : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {reactivateError ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: dismissReactivateError,
              variant: "primary",
            },
          ]}
          message={reactivateError.message}
          title={reactivateError.title}
          visible
          onRequestClose={dismissReactivateError}
        />
      ) : null}

      <AlertDialog
        buttons={[
          {
            label: "Cancelar",
            variant: "secondary",
            onPress: () => {
              if (!leavePending) {
                setShowLeaveAlert(false);
              }
            },
          },
          {
            label: leavePending ? "Saindo…" : "Sair do time",
            variant: "destructive",
            onPress: confirmLeave,
          },
        ]}
        message="Você vai deixar de fazer parte desta equipe. Essa ação não pode ser desfeita."
        title="Sair do time"
        visible={showLeaveAlert}
        onRequestClose={() => {
          if (!leavePending) {
            setShowLeaveAlert(false);
          }
        }}
      />

      {leaveError ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              variant: "primary",
              onPress: () => setLeaveError(null),
            },
          ]}
          message={leaveError.message}
          title={leaveError.title}
          visible
          onRequestClose={() => setLeaveError(null)}
        />
      ) : null}
      <View style={hub.scrollWrapper}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            showFooterUnlock ? hub.scrollContentPadBottom : undefined,
          ]}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
        >
          {!isStaffMember ? (
            <>
              <View style={hub.menuCard}>
                <HubMenuRow
                  disabled={menuDisabled}
                  hub={hub}
                  icon="document-text-outline"
                  subtitle="Endereço, horário e categoria"
                  theme={theme}
                  title="Dados do cadastro"
                  onPress={() =>
                    navigation.navigate(ProfileStack.EstablishmentEdit, {
                      establishmentId: est.id,
                    })
                  }
                />
              </View>

              {canManage ? (
                <>
                  <View style={[hub.menuCard, hub.menuCardSpacing]}>
                    <HubMenuRow
                      disabled={menuDisabled}
                      hub={hub}
                      icon="people-outline"
                      subtitle="Equipe, papéis e convites"
                      theme={theme}
                      title="Colaboradores"
                      onPress={() =>
                        navigation.navigate(
                          ProfileStack.EstablishmentCollaborators,
                          {
                            establishmentId: est.id,
                          },
                        )
                      }
                    />
                  </View>
                  <View style={[hub.menuCard, hub.menuCardSpacing]}>
                    <HubMenuRow
                      disabled={menuDisabled}
                      hub={hub}
                      icon={SERVICE_IONICON}
                      subtitle="Preço, duração e quem atende"
                      theme={theme}
                      title="Serviços"
                      onPress={() =>
                        navigation.navigate(
                          ProfileStack.EstablishmentServices,
                          {
                            establishmentId: est.id,
                            establishmentName: est.name,
                          },
                        )
                      }
                    />
                  </View>
                </>
              ) : null}
            </>
          ) : null}

          {isStaffMember ? (
            <View style={hub.staffSection}>
              <Text variant="hint">
                Você faz parte desta equipe como colaborador. Para sair do time,
                use o botão abaixo.
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={leavePending}
                style={({ pressed }) => [
                  hub.leaveButton,
                  pressed && hub.leaveButtonPressed,
                  leavePending && hub.leaveButtonDisabled,
                ]}
                onPress={() => setShowLeaveAlert(true)}
              >
                <Text style={hub.leaveButtonLabel} variant="bodyTight">
                  Sair do time
                </Text>
              </Pressable>
            </View>
          ) : !canManage ? (
            <View style={hub.readOnlyHint}>
              <Text variant="hint">
                Só o dono ou o gestor pode gerir colaboradores e serviços. Use
                Dados do cadastro para ver endereço, horário e categoria.
              </Text>
            </View>
          ) : null}

          {isEstablishmentInactive && canManage && !canToggleActive ? (
            <View style={hub.inactiveManagerHint}>
              <Text variant="hint">
                Só o dono pode reativar este local na busca pública.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {showFooterUnlock ? (
          <View
            style={[
              hub.footerUnlockBar,
              { paddingBottom: Math.max(insets.bottom, 14) },
            ]}
          >
            <Button
              disabled={unlockBusy}
              variant="primary"
              onPress={onReactivate}
            >
              Desbloquear local
            </Button>
          </View>
        ) : null}

        {unlockBusy ? (
          <View accessibilityViewIsModal style={hub.unlockLoadingOverlay}>
            <ActivityIndicator
              accessibilityLabel="A reativar"
              color={theme.accent}
              size="large"
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
