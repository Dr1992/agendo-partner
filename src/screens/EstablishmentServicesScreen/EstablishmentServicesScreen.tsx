import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { PartnerServiceRow } from "../../api/public/partner";
import { Button } from "../../components/Button";
import { LoadingCentered } from "../../components/LoadingCentered";
import { ServiceCard } from "../../components/ServiceCard";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { formatCentsAsBrazilReais } from "../../utils/brazilMoney";
import { useEstablishmentServicesScreen } from "./hooks/useEstablishmentServicesScreen";
import { getEstablishmentServicesScreenStyles } from "./styles";

export function EstablishmentServicesScreen(
  props: ProfileScreenProps<"EstablishmentServices">,
) {
  const { route } = props;
  const { establishmentName } = route.params;
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();

  const priceLabel = useCallback(
    (priceCents: number | null): string =>
      priceCents != null
        ? `R$ ${formatCentsAsBrazilReais(priceCents)}`
        : t("services.priceUnset"),
    [t],
  );
  const insets = useSafeAreaInsets();
  const styles = getScreenFormStyles(theme);
  const svcStyles = useMemo(
    () => getEstablishmentServicesScreenStyles(theme),
    [theme],
  );

  const { canManage, establishmentQuery, onEdit, onNewService, servicesQuery } =
    useEstablishmentServicesScreen(props);

  const {
    data: est,
    error: estError,
    isError: isEstError,
    isPending: estPending,
    refetch: refetchEst,
  } = establishmentQuery;

  const {
    data: servicesRes,
    error,
    isError,
    isPending: servicesPending,
    refetch,
  } = servicesQuery;

  const rows = servicesRes?.data ?? [];

  const renderItem = useCallback(
    ({ item }: { item: PartnerServiceRow }) => (
      <ServiceCard
        description={item.description}
        durationMinutes={item.durationMinutes}
        isActive={item.isActive}
        mode="manage"
        name={item.name}
        priceLabel={priceLabel(item.priceCents)}
        onPress={() => onEdit(item)}
      />
    ),
    [onEdit, priceLabel],
  );

  const listEmpty = useMemo(() => {
    if (rows.length > 0) {
      return null;
    }
    return (
      <Text style={svcStyles.hintTop} variant="hint">
        {t("services.emptyList")}
      </Text>
    );
  }, [rows.length, svcStyles.hintTop, t]);

  const footerPaddingBottom = insets.bottom + 16;

  if (estPending && est === undefined) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (isEstError || !est) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">
          {estError instanceof Error
            ? estError.message
            : t("services.notFound")}
        </Text>
        {isEstError ? (
          <Button
            style={styles.ctaRetryFullWidth}
            onPress={() => void refetchEst()}
          >
            {t("common.retry")}
          </Button>
        ) : null}
      </SafeAreaView>
    );
  }

  if (!canManage) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <Text style={styles.body} variant="body">
          {t("services.permissionDenied", { name: establishmentName })}
        </Text>
      </SafeAreaView>
    );
  }

  if (servicesPending && servicesRes === undefined) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (isError && canManage) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">
          {error instanceof Error ? error.message : t("services.loadError")}
        </Text>
        <Button style={styles.ctaRetryFullWidth} onPress={() => void refetch()}>
          {t("common.retry")}
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <View style={svcStyles.screenBody}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={svcStyles.cardSeparator} />
          )}
          ListEmptyComponent={listEmpty}
          ListHeaderComponent={
            <Text style={svcStyles.hintTop} variant="hint">
              {t("services.listHint")}
            </Text>
          }
          contentContainerStyle={styles.scrollContent}
          data={rows}
          keyExtractor={(s) => s.id}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          style={svcStyles.flatList}
        />
        <View
          style={[svcStyles.footer, { paddingBottom: footerPaddingBottom }]}
        >
          <Button style={svcStyles.footerButton} onPress={onNewService}>
            {t("services.newServiceButton")}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
