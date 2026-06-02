import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormSelectRow } from "../../components/FormSelectRow";
import { LoadingCentered } from "../../components/LoadingCentered";
import { PickerModal } from "../../components/PickerModal/PickerModal";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import { palette } from "../../theme/colors";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { formatCpfDisplay, normalizeCpfDigits } from "../../utils/cpf";
import { useInviteStaffScreen } from "./hooks/useInviteStaffScreen";

export function InviteStaffScreen(props: ProfileScreenProps<"InviteStaff">) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("team");
  const styles = getScreenFormStyles(theme);

  const inviteRoleOptions = [
    {
      role: "STAFF" as const,
      subtitle: t("invite.roleOptions.staffSubtitle"),
      title: t("common.staff"),
    },
    {
      role: "MANAGER" as const,
      subtitle: t("invite.roleOptions.managerSubtitle"),
      title: t("common.manager"),
    },
  ];
  const {
    busy,
    canManage,
    closeInviteDialog,
    cpfDigits,
    cpfValid,
    establishmentQuery,
    inviteDialog,
    inviteRole,
    onSend,
    rolePickerOpen,
    setCpfDigits,
    setInviteRole,
    setRolePickerOpen,
  } = useInviteStaffScreen(props);

  const est = establishmentQuery.data;
  const isPending = establishmentQuery.isPending;

  if (isPending || !est) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (!canManage) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text style={styles.body} variant="body">
          {t("invite.noAccess")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {inviteDialog ? (
        <AlertDialog
          buttons={[
            {
              label: t("common.ok"),
              onPress: closeInviteDialog,
              variant: "primary",
            },
          ]}
          message={inviteDialog.message}
          title={inviteDialog.title}
          visible
          onRequestClose={closeInviteDialog}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <Text style={styles.body} variant="body">
          {t("invite.intro")}
        </Text>
        {est.viewerMemberRole === "OWNER" ? (
          <>
            <Text style={styles.fieldLabel} variant="fieldLabel">
              {t("invite.roleLabel")}
            </Text>
            <FormSelectRow
              displayText={
                inviteRole === "MANAGER"
                  ? t("common.manager")
                  : t("common.staff")
              }
              empty={false}
              onPress={() => setRolePickerOpen(true)}
            />
          </>
        ) : (
          <>
            <Text style={styles.fieldLabel} variant="fieldLabel">
              {t("invite.roleLabel")}
            </Text>
            <Text style={styles.hint} variant="hint">
              {t("invite.managerOnlyByOwnerHint")}
            </Text>
          </>
        )}
        <Text style={styles.fieldLabel} variant="fieldLabel">
          {t("invite.cpfLabel")}
        </Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={14}
          placeholder={t("invite.cpfPlaceholder")}
          placeholderTextColor={theme.textHint}
          style={styles.field}
          value={formatCpfDisplay(cpfDigits)}
          onChangeText={(text) =>
            setCpfDigits(normalizeCpfDigits(text).slice(0, 11))
          }
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy || !cpfValid}
          style={({ pressed }) => [
            styles.cta,
            pressed && { opacity: 0.92 },
            (busy || !cpfValid) && { opacity: 0.5 },
          ]}
          onPress={() => void onSend()}
        >
          {busy ? (
            <ActivityIndicator color={palette.onAccent} />
          ) : (
            <Text style={styles.ctaText} variant="ctaPrimary">
              {t("invite.submitButton")}
            </Text>
          )}
        </Pressable>
      </ScrollView>

      {est.viewerMemberRole === "OWNER" ? (
        <PickerModal
          items={inviteRoleOptions}
          keyExtractor={(item) => item.role}
          modalAnimation="slide"
          renderItem={(item) => ({
            subtitle: item.subtitle,
            title: item.title,
          })}
          title={t("invite.roleLabel")}
          visible={rolePickerOpen}
          onClose={() => setRolePickerOpen(false)}
          onSelectItem={(item) => setInviteRole(item.role)}
        />
      ) : null}
    </SafeAreaView>
  );
}
