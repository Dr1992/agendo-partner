import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("team");
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
                        ? t("common.manager")
                        : t("common.staff")}
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
                        {t("collaborators.pendingSheet.plannedServices", {
                          count: inv.plannedPerformerServiceIds.length,
                        })}
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
                        {t("collaborators.pendingSheet.noServicesLinked")}
                      </Text>
                    </View>
                  )}
                </View>
                <Pressable
                  accessibilityLabel={t(
                    "collaborators.pendingSheet.revokeInviteAccessibilityLabel",
                  )}
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
                {t("collaborators.pendingSheet.linkServicesButton")}
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
              {t("collaborators.pendingSheet.revokeTitle")}
            </Text>
            <Text style={screenStyles.pendingRevokeMessage} variant="bodyTight">
              {t("collaborators.pendingSheet.revokeMessage")}
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
                <Text variant="ctaOutline">{t("common.cancel")}</Text>
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
                    {t("collaborators.pendingSheet.revokeButton")}
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
