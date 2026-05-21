import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
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
  const pending = establishment.pendingInvites ?? [];

  return (
    <View>
      {pending.length > 0 ? (
        <View style={screenStyles.pendingCard}>
          <View style={screenStyles.pendingHeaderRow}>
            <Ionicons color={theme.accent} name="hourglass-outline" size={22} />
            <Text style={screenStyles.pendingTitle} variant="listTitle">
              Cadastro pendente
            </Text>
          </View>
          <Text variant="hint">
            Pessoas convidadas que ainda não completaram o cadastro no app.
          </Text>
          <Text style={screenStyles.pendingCardSummary} variant="bodyTight">
            {pending.length === 1
              ? "1 convite aguardando cadastro"
              : `${pending.length} convites aguardando cadastro`}
          </Text>
          <Button
            style={screenStyles.pendingOpenModalBtn}
            variant="outline"
            onPress={openPendingInvitesSheet}
          >
            Ver convites pendentes
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
              <Text variant="listTitle">Você também atende neste local?</Text>
            </View>
          </View>
          <View style={screenStyles.ownerCardBody}>
            <Text variant="hint">
              Assim você aparece na equipe, pode ser escolhido nos agendamentos
              e associado aos serviços.
            </Text>
            {!ownerHasValidCpf ? (
              <Text style={screenStyles.ownerCardCpfHint} variant="hint">
                Cadastre um CPF válido no perfil (o mesmo da conta) para constar
                como prestador.
              </Text>
            ) : null}
          </View>
          {ownerHasValidCpf ? (
            <Button
              loading={includeOwnerPending}
              style={screenStyles.ownerCardButton}
              onPress={onIncludeOwnerAsStaffPress}
            >
              Incluir-me como prestador
            </Button>
          ) : (
            <Button
              style={screenStyles.ownerCardButton}
              variant="outline"
              onPress={() => navigation.navigate(ProfileStack.EditProfile)}
            >
              Atualizar perfil
            </Button>
          )}
        </View>
      ) : null}
      <View style={screenStyles.teamBlock}>
        <View
          accessibilityLabel="Equipe, colaboradores"
          accessibilityRole="header"
          style={screenStyles.teamSectionHeaderRow}
        >
          <Text style={screenStyles.teamSectionTitle} variant="listTitle">
            Equipe
          </Text>
          <Ionicons
            accessibilityElementsHidden
            color={theme.accent}
            name="people-outline"
            size={22}
          />
        </View>
        <Text style={screenStyles.teamSectionHint} variant="hint">
          Só aparecem aqui quem já tem conta no app com o CPF cadastrado neste
          local. Quem ainda não completou o cadastro não entra na agenda.
        </Text>
      </View>
    </View>
  );
}
