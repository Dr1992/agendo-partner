import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Button } from "../../components/Button";
import { EstablishmentRowCard } from "../../components/EstablishmentRowCard/EstablishmentRowCard";
import { InlineLoading } from "../../components/InlineLoading";
import { SignedOutGate } from "../../components/SignedOutGate";
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
  const { t } = useTranslation("partner");
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
    hasInactive,
    inactiveRows,
    isCollaboratorOnly,
    listEnabled,
    listPending,
    listRes,
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
        : t("home.noCategory");

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
    [homeStyles.establishmentListCardSpacing, navigation, t, theme],
  );

  if (!session) {
    return (
      <SignedOutGate
        buttonText={t("home.gateButton")}
        subtitle={t("home.gateSubtitle")}
        title={t("home.gateTitle")}
      />
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          showFixedRegisterButton && homeStyles.scrollContentWithFixedFooter,
          (!profileComplete ||
            (listEnabled &&
              !listPending &&
              partnerRows.length === 0 &&
              staffRows.length === 0)) &&
            homeStyles.scrollContentCenteredEmpty,
        ]}
        style={styles.scroll}
      >
        {!profileComplete ? (
          <>
            <Text style={homeStyles.gateText} variant="hint">
              {t("home.gateIncompleteProfile")}
            </Text>
            <Button
              style={styles.ctaRetryFullWidth}
              onPress={() => navigation.navigate(ProfileStack.CompleteProfile)}
            >
              {t("home.completeProfileButton")}
            </Button>
          </>
        ) : (
          <>
            {listPending && listRes === undefined ? (
              <>
                <Text variant="fieldLabel">{t("home.myEstablishments")}</Text>
                <InlineLoading />
              </>
            ) : isCollaboratorOnly ? (
              <>
                <Text variant="fieldLabel">
                  {t("home.establishmentsImPartOf")}
                </Text>
                {staffRows.map((row) => (
                  <EstablishmentRowCard
                    key={row.id}
                    addressShort={
                      row.addressShort?.trim() ||
                      [row.cityName, row.stateUf].filter(Boolean).join(" — ") ||
                      "—"
                    }
                    categoryLabel={
                      row.categoryLabel?.trim() || t("home.noCategory")
                    }
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
                {t("home.noOwnedEstablishments")}
              </Text>
            ) : (
              <>
                <Text variant="fieldLabel">{t("home.myEstablishments")}</Text>
                {hasInactive && activeRows.length > 0 ? (
                  <Text variant="fieldLabel">{t("home.activeSection")}</Text>
                ) : null}
                {activeRows.map(renderEstablishmentCard)}
                {hasInactive && inactiveRows.length > 0 ? (
                  <>
                    <Text
                      variant="fieldLabel"
                      style={homeStyles.sectionHeading}
                    >
                      {t("home.inactiveSection")}
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
            {t("home.registerButton")}
          </Button>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
