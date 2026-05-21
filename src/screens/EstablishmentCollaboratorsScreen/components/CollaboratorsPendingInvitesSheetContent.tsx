import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { ProfileStack } from "../../../navigation/routeIds";
import { palette } from "../../../theme/colors";
import type { AppTheme } from "../../../theme";
import type { EstablishmentDetail } from "../../../types/establishment";
import { maskCpfDigits } from "../../../utils/cpf";
import { getEstablishmentCollaboratorsScreenStyles } from "../styles";

type ScreenStyles = ReturnType<
  typeof getEstablishmentCollaboratorsScreenStyles
>;

type CollaboratorsPendingInvitesSheetContentProps = {
  confirmRevokeInvite: () => void;
  deleteInvitePending: boolean;
  establishment: EstablishmentDetail;
  navigation: NavigationProp<ParamListBase>;
  revokeInviteId: string | null;
  screenStyles: ScreenStyles;
  setPendingModalOpen: (open: boolean) => void;
  setRevokeInviteId: (id: string | null) => void;
  theme: AppTheme;
};

export function CollaboratorsPendingInvitesSheetContent({
  confirmRevokeInvite,
  deleteInvitePending,
  establishment,
  navigation,
  revokeInviteId,
  screenStyles,
  setPendingModalOpen,
  setRevokeInviteId,
  theme,
}: CollaboratorsPendingInvitesSheetContentProps) {
  const invites = establishment.pendingInvites ?? [];

  return (
    <View style={screenStyles.pendingModalBodyWrap}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={screenStyles.pendingModalScroll}
      >
        {invites.map((inv, index, arr) => (
          <View key={inv.id}>
            <View style={screenStyles.pendingModalItemBlock}>
              <View style={screenStyles.pendingModalItemTop}>
                <View style={screenStyles.pendingModalItemBody}>
                  <View
                    style={[
                      screenStyles.pendingModalMetaRow,
                      screenStyles.pendingModalMetaRowFirst,
                    ]}
                  >
                    <View style={screenStyles.pendingModalMetaIconLead}>
                      <Ionicons
                        color={theme.accent}
                        name={inv.cpf ? "person-outline" : "mail-outline"}
                        size={20}
                      />
                    </View>
                    <Text
                      style={screenStyles.pendingModalMetaText}
                      variant="bodyTight"
                    >
                      {inv.cpf ? maskCpfDigits(inv.cpf) : (inv.email ?? "—")}
                    </Text>
                  </View>
                  <View style={screenStyles.pendingModalMetaRow}>
                    <View style={screenStyles.pendingModalMetaIconMuted}>
                      <Ionicons
                        color={theme.textMuted}
                        name={
                          inv.intendedRole === "MANAGER"
                            ? "shield-checkmark-outline"
                            : "briefcase-outline"
                        }
                        size={19}
                      />
                    </View>
                    <Text
                      style={screenStyles.pendingModalMetaText}
                      variant="hint"
                    >
                      {inv.intendedRole === "MANAGER"
                        ? "Gestor"
                        : "Colaborador"}
                    </Text>
                  </View>
                  <View style={screenStyles.pendingModalMetaRow}>
                    <View style={screenStyles.pendingModalMetaIconMuted}>
                      <Ionicons
                        color={theme.textMuted}
                        name="calendar-outline"
                        size={19}
                      />
                    </View>
                    <Text
                      style={screenStyles.pendingModalMetaText}
                      variant="hint"
                    >
                      {new Date(inv.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  {inv.plannedPerformerServiceIds.length > 0 ? (
                    <View style={screenStyles.pendingModalMetaRow}>
                      <View style={screenStyles.pendingModalMetaIconMuted}>
                        <Ionicons
                          color={theme.textMuted}
                          name="layers-outline"
                          size={19}
                        />
                      </View>
                      <Text
                        style={screenStyles.pendingModalMetaText}
                        variant="hint"
                      >
                        {inv.plannedPerformerServiceIds.length} serviço(s)
                        planejado(s)
                      </Text>
                    </View>
                  ) : (
                    <View style={screenStyles.pendingModalMetaRow}>
                      <View style={screenStyles.pendingModalMetaIconMuted}>
                        <Ionicons
                          color={theme.textMuted}
                          name="link-outline"
                          size={19}
                        />
                      </View>
                      <Text
                        style={screenStyles.pendingModalMetaText}
                        variant="hint"
                      >
                        Nenhum serviço vinculado ainda
                      </Text>
                    </View>
                  )}
                </View>
                <Pressable
                  accessibilityLabel="Revogar convite"
                  accessibilityRole="button"
                  hitSlop={12}
                  style={({ pressed }) => [
                    screenStyles.pendingModalTrashBtn,
                    pressed && screenStyles.pressed,
                  ]}
                  onPress={() => setRevokeInviteId(inv.id)}
                >
                  <Ionicons
                    color={theme.textDestructive}
                    name="trash-outline"
                    size={22}
                  />
                </Pressable>
              </View>
              <Button
                style={screenStyles.pendingModalLinkBtn}
                variant="outline"
                onPress={() => {
                  setRevokeInviteId(null);
                  setPendingModalOpen(false);
                  navigation.navigate(ProfileStack.PendingInviteLinkServices, {
                    establishmentId: establishment.id,
                    establishmentName: establishment.name,
                    inviteId: inv.id,
                    afterInviteFlow: false,
                  });
                }}
              >
                Vincular serviços
              </Button>
            </View>
            {index < arr.length - 1 ? (
              <View style={screenStyles.pendingModalSectionDivider} />
            ) : null}
          </View>
        ))}
      </ScrollView>
      {revokeInviteId ? (
        <View
          pointerEvents="box-none"
          style={screenStyles.pendingRevokeOverlay}
        >
          <Pressable
            accessibilityRole="button"
            style={screenStyles.pendingRevokeBackdrop}
            disabled={deleteInvitePending}
            onPress={() => {
              if (!deleteInvitePending) {
                setRevokeInviteId(null);
              }
            }}
          />
          <View accessibilityRole="none" style={screenStyles.pendingRevokeCard}>
            <Text style={screenStyles.pendingRevokeTitle} variant="listTitle">
              Revogar convite?
            </Text>
            <Text style={screenStyles.pendingRevokeMessage} variant="bodyTight">
              A pessoa deixa de poder ativar este convite ao completar o perfil
              com o mesmo CPF. Pode convidar de novo depois, se precisar.
            </Text>
            <View style={screenStyles.pendingRevokeActions}>
              <Pressable
                accessibilityRole="button"
                disabled={deleteInvitePending}
                style={({ pressed }) => [
                  screenStyles.pendingRevokeOutlineBtn,
                  pressed && !deleteInvitePending && screenStyles.pressed,
                ]}
                onPress={() => setRevokeInviteId(null)}
              >
                <Text variant="ctaOutline">Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={deleteInvitePending}
                style={({ pressed }) => [
                  screenStyles.pendingRevokeDestructiveBtn,
                  pressed && !deleteInvitePending && screenStyles.pressed,
                ]}
                onPress={() => void confirmRevokeInvite()}
              >
                {deleteInvitePending ? (
                  <ActivityIndicator color={palette.white} size="small" />
                ) : (
                  <Text
                    style={screenStyles.pendingRevokeDestructiveLabel}
                    variant="bodyTight"
                  >
                    Revogar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
