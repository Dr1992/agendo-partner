import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import type { AppTheme } from "../../../theme";
import type { EstablishmentDetail } from "../../../types/establishment";
import { ProfileStack } from "../../../navigation/routeIds";
import { getEstablishmentCollaboratorsScreenStyles } from "../styles";

type ScreenStyles = ReturnType<
  typeof getEstablishmentCollaboratorsScreenStyles
>;

type CollaboratorsListHeaderProps = {
  establishment: EstablishmentDetail;
  includeOwnerPending: boolean;
  navigation: NavigationProp<ParamListBase>;
  onIncludeOwnerAsStaffPress: () => void;
  openPendingInvitesSheet: () => void;
  ownerHasValidCpf: boolean;
  screenStyles: ScreenStyles;
  showOwnerSelfServeCard: boolean;
  theme: AppTheme;
};

export function CollaboratorsListHeader({
  establishment,
  includeOwnerPending,
  navigation,
  onIncludeOwnerAsStaffPress,
  openPendingInvitesSheet,
  ownerHasValidCpf,
  screenStyles,
  showOwnerSelfServeCard,
  theme,
}: CollaboratorsListHeaderProps) {
  const { t } = useTranslation("team");
  const pending = establishment.pendingInvites ?? [];

  return (
    <View>
      {pending.length > 0 ? (
        <View style={screenStyles.pendingCard}>
          <View style={screenStyles.pendingHeaderRow}>
            <Ionicons color={theme.accent} name="hourglass-outline" size={22} />
            <Text style={screenStyles.pendingTitle} variant="listTitle">
              {t("collaborators.pendingCard.title")}
            </Text>
          </View>
          <Text variant="hint">
            {t("collaborators.pendingCard.description")}
          </Text>
          <Text style={screenStyles.pendingCardSummary} variant="bodyTight">
            {pending.length === 1
              ? t("collaborators.pendingCard.summaryOne")
              : t("collaborators.pendingCard.summaryOther", {
                  count: pending.length,
                })}
          </Text>
          <Button
            style={screenStyles.pendingOpenModalBtn}
            variant="outline"
            onPress={openPendingInvitesSheet}
          >
            {t("collaborators.pendingCard.openButton")}
          </Button>
        </View>
      ) : null}
      {showOwnerSelfServeCard ? (
        <View style={screenStyles.ownerCard}>
          <View style={screenStyles.ownerCardIconRow}>
            <Ionicons
              color={theme.accent}
              name="person-add-outline"
              size={22}
            />
            <View style={screenStyles.ownerCardTitleBlock}>
              <Text variant="listTitle">
                {t("collaborators.ownerCard.title")}
              </Text>
            </View>
          </View>
          <View style={screenStyles.ownerCardBody}>
            <Text variant="hint">
              {t("collaborators.ownerCard.description")}
            </Text>
            {!ownerHasValidCpf ? (
              <Text style={screenStyles.ownerCardCpfHint} variant="hint">
                {t("collaborators.ownerCard.cpfHint")}
              </Text>
            ) : null}
          </View>
          {ownerHasValidCpf ? (
            <Button
              loading={includeOwnerPending}
              style={screenStyles.ownerCardButton}
              onPress={onIncludeOwnerAsStaffPress}
            >
              {t("collaborators.ownerCard.includeButton")}
            </Button>
          ) : (
            <Button
              style={screenStyles.ownerCardButton}
              variant="outline"
              onPress={() => navigation.navigate(ProfileStack.EditProfile)}
            >
              {t("collaborators.ownerCard.updateProfileButton")}
            </Button>
          )}
        </View>
      ) : null}
      <View style={screenStyles.teamBlock}>
        <View
          accessibilityLabel={t("collaborators.teamSection.accessibilityLabel")}
          accessibilityRole="header"
          style={screenStyles.teamSectionHeaderRow}
        >
          <Text style={screenStyles.teamSectionTitle} variant="listTitle">
            {t("collaborators.teamSection.title")}
          </Text>
          <Ionicons
            accessibilityElementsHidden
            color={theme.accent}
            name="people-outline"
            size={22}
          />
        </View>
        <Text style={screenStyles.teamSectionHint} variant="hint">
          {t("collaborators.teamSection.hint")}
        </Text>
      </View>
    </View>
  );
}
