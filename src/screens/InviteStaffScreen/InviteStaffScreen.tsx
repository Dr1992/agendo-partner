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

const INVITE_ROLE_OPTIONS = [
  {
    role: "STAFF" as const,
    subtitle: "Atende clientes neste estabelecimento.",
    title: "Colaborador",
  },
  {
    role: "MANAGER" as const,
    subtitle: "Pode gerir equipe e configurações do local.",
    title: "Gestor",
  },
];

export function InviteStaffScreen(props: ProfileScreenProps<"InviteStaff">) {
  const { theme } = useAppTheme();
  const styles = getScreenFormStyles(theme);
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
          Apenas dono ou gestor pode adicionar colaboradores neste local.
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
              label: "OK",
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
          Digite o CPF da pessoa que vai integrar a equipe. Não há passo de
          “aceitar convite”: quando ela criar conta no app e completar o perfil
          com o mesmo CPF, o acesso ao local fica ativo e ela passa a aparecer
          na equipe e na agenda deste estabelecimento.
        </Text>
        {est.viewerMemberRole === "OWNER" ? (
          <>
            <Text style={styles.fieldLabel} variant="fieldLabel">
              Função neste local
            </Text>
            <FormSelectRow
              displayText={inviteRole === "MANAGER" ? "Gestor" : "Colaborador"}
              empty={false}
              onPress={() => setRolePickerOpen(true)}
            />
          </>
        ) : (
          <>
            <Text style={styles.fieldLabel} variant="fieldLabel">
              Função neste local
            </Text>
            <Text style={styles.hint} variant="hint">
              Gestores só podem adicionar colaboradores com função de
              colaborador. Só o dono pode atribuir gestor.
            </Text>
          </>
        )}
        <Text style={styles.fieldLabel} variant="fieldLabel">
          CPF
        </Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={14}
          placeholder="000.000.000-00"
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={formatCpfDisplay(cpfDigits)}
          onChangeText={(t) => setCpfDigits(normalizeCpfDigits(t).slice(0, 11))}
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
              Adicionar à equipe
            </Text>
          )}
        </Pressable>
      </ScrollView>

      {est.viewerMemberRole === "OWNER" ? (
        <PickerModal
          items={INVITE_ROLE_OPTIONS}
          keyExtractor={(item) => item.role}
          modalAnimation="slide"
          renderItem={(item) => ({
            subtitle: item.subtitle,
            title: item.title,
          })}
          title="Função neste local"
          visible={rolePickerOpen}
          onClose={() => setRolePickerOpen(false)}
          onSelectItem={(item) => setInviteRole(item.role)}
        />
      ) : null}
    </SafeAreaView>
  );
}
