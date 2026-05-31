import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("partner");
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
            : t("establishmentHub.notFound")}
        </Text>
        {isError ? (
          <Button
            style={styles.ctaRetryFullWidth}
            onPress={() => void refetch()}
          >
            {t("common.retry")}
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
              label: t("common.ok"),
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
            label: t("common.cancel"),
            variant: "secondary",
            onPress: () => {
              if (!leavePending) {
                setShowLeaveAlert(false);
              }
            },
          },
          {
            label: leavePending
              ? t("establishmentHub.leavingButton")
              : t("establishmentHub.leaveButton"),
            variant: "destructive",
            onPress: confirmLeave,
          },
        ]}
        message={t("establishmentHub.leaveMessage")}
        title={t("establishmentHub.leaveTitle")}
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
              label: t("common.ok"),
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
                  subtitle={t("establishmentHub.cardDataSubtitle")}
                  theme={theme}
                  title={t("establishmentHub.cardDataTitle")}
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
                      subtitle={t("establishmentHub.cardCollaboratorsSubtitle")}
                      theme={theme}
                      title={t("establishmentHub.cardCollaboratorsTitle")}
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
                      subtitle={t("establishmentHub.cardServicesSubtitle")}
                      theme={theme}
                      title={t("establishmentHub.cardServicesTitle")}
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
              <Text variant="hint">{t("establishmentHub.staffHint")}</Text>
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
                  {t("establishmentHub.leaveButton")}
                </Text>
              </Pressable>
            </View>
          ) : !canManage ? (
            <View style={hub.readOnlyHint}>
              <Text variant="hint">
                {t("establishmentHub.readOnlyHint")}
              </Text>
            </View>
          ) : null}

          {isEstablishmentInactive && canManage && !canToggleActive ? (
            <View style={hub.inactiveManagerHint}>
              <Text variant="hint">
                {t("establishmentHub.inactiveManagerHint")}
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
              {t("establishmentHub.unlockButton")}
            </Button>
          </View>
        ) : null}

        {unlockBusy ? (
          <View accessibilityViewIsModal style={hub.unlockLoadingOverlay}>
            <ActivityIndicator
              accessibilityLabel={t("establishmentHub.reactivatingAccessibility")}
              color={theme.accent}
              size="large"
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
