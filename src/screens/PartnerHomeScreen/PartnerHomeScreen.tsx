import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { EstablishmentRowCard } from "../../components/EstablishmentRowCard/EstablishmentRowCard";
import { InlineLoading } from "../../components/InlineLoading";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { ProfileStack } from "../../navigation/routeIds";
import { useAuth } from "../../providers/AuthProvider";
import { usePartnerHomeScreen } from "./hooks/usePartnerHomeScreen";
import { getPartnerHomeStyles } from "./styles";
import { establishmentAddressFallback } from "./utils/establishmentAddressFallback";

export function PartnerHomeScreen(props: ProfileScreenProps<"PartnerHome">) {
  const { navigation } = props;
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const homeStyles = useMemo(
    () =>
      getPartnerHomeStyles(theme, {
        footerPadBottom: insets.bottom + 16,
      }),
    [insets.bottom, theme],
  );
  const { profileComplete, session } = useAuth();

  const {
    activeRows,
    dismissLoginError,
    hasInactive,
    inactiveRows,
    isCollaboratorOnly,
    listEnabled,
    listPending,
    listRes,
    loginError,
    onLogin,
    partnerRows,
    staffRows,
    showFixedRegisterButton,
  } = usePartnerHomeScreen(props);

  const renderEstablishmentCard = useCallback(
    (row: (typeof partnerRows)[0]) => {
      const detail = row.detail;
      const inactive = detail.isActive === false;
      const addressShort =
        detail.addressShort?.trim() ||
        establishmentAddressFallback(
          detail.addressFull,
          detail.cityName,
          detail.stateUf,
        );
      const categoryLabel = detail.categoryLabel?.trim()
        ? detail.categoryLabel.trim()
        : "Sem categoria";

      return (
        <EstablishmentRowCard
          key={detail.id}
          addressShort={addressShort}
          categoryLabel={categoryLabel}
          containerStyle={homeStyles.establishmentListCardSpacing}
          inactive={inactive}
          showEditIcon
          theme={theme}
          thumbnailUrl={detail.galleryPhotoUrls?.[0]}
          title={detail.name}
          onPress={() =>
            navigation.navigate(ProfileStack.EstablishmentHub, {
              establishmentId: detail.id,
            })
          }
        />
      );
    },
    [homeStyles.establishmentListCardSpacing, navigation, theme],
  );

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {loginError ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: dismissLoginError,
              variant: "primary",
            },
          ]}
          message={loginError.message}
          title={loginError.title}
          visible
          onRequestClose={dismissLoginError}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          showFixedRegisterButton && homeStyles.scrollContentWithFixedFooter,
          (!session ||
            !profileComplete ||
            (listEnabled &&
              !listPending &&
              partnerRows.length === 0 &&
              staffRows.length === 0)) &&
            homeStyles.scrollContentCenteredEmpty,
        ]}
        style={styles.scroll}
      >
        {!session ? (
          <>
            <Text style={homeStyles.gateText} variant="hint">
              Entre para gerenciar seus locais.
            </Text>
            <Button
              style={styles.ctaRetryFullWidth}
              onPress={() => void onLogin()}
            >
              Login
            </Button>
          </>
        ) : !profileComplete ? (
          <>
            <Text style={homeStyles.gateText} variant="hint">
              Complete seu cadastro para liberar o gerenciamento do local.
            </Text>
            <Button
              style={styles.ctaRetryFullWidth}
              onPress={() => navigation.navigate(ProfileStack.CompleteProfile)}
            >
              Completar cadastro
            </Button>
          </>
        ) : (
          <>
            {listPending && listRes === undefined ? (
              <>
                <Text variant="fieldLabel">Meus estabelecimentos</Text>
                <InlineLoading />
              </>
            ) : isCollaboratorOnly ? (
              <>
                <Text variant="fieldLabel">
                  Estabelecimentos que faço parte
                </Text>
                {staffRows.map((row) => (
                  <EstablishmentRowCard
                    key={row.id}
                    addressShort={
                      row.addressShort?.trim() ||
                      [row.cityName, row.stateUf].filter(Boolean).join(" — ") ||
                      "—"
                    }
                    categoryLabel={row.categoryLabel?.trim() || "Sem categoria"}
                    containerStyle={homeStyles.establishmentListCardSpacing}
                    showEditIcon
                    theme={theme}
                    thumbnailUrl={row.thumbnailUrl}
                    title={row.name}
                    onPress={() =>
                      navigation.navigate(ProfileStack.EstablishmentHub, {
                        establishmentId: row.id,
                      })
                    }
                  />
                ))}
              </>
            ) : partnerRows.length === 0 ? (
              <Text style={homeStyles.emptyPartnerMessage} variant="body">
                Você não tem nenhum estabelecimento no qual você é dono ou
                gestor.
              </Text>
            ) : (
              <>
                <Text variant="fieldLabel">Meus estabelecimentos</Text>
                {hasInactive && activeRows.length > 0 ? (
                  <Text variant="fieldLabel">Ativos</Text>
                ) : null}
                {activeRows.map(renderEstablishmentCard)}
                {hasInactive && inactiveRows.length > 0 ? (
                  <>
                    <Text
                      variant="fieldLabel"
                      style={homeStyles.sectionHeading}
                    >
                      Desativados
                    </Text>
                    {inactiveRows.map(renderEstablishmentCard)}
                  </>
                ) : null}
              </>
            )}
          </>
        )}
      </ScrollView>

      {showFixedRegisterButton ? (
        <View style={homeStyles.fixedFooter}>
          <Button
            style={homeStyles.fixedFooterButton}
            onPress={() =>
              navigation.navigate(ProfileStack.EstablishmentRegister)
            }
          >
            Cadastrar estabelecimento
          </Button>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
