import { useCallback } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedListItem } from "../../components/AnimatedListItem/AnimatedListItem";
import { ServiceCard } from "../../components/ServiceCard";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ServiceOffering } from "../../types/service";
import { formatMoneyPtBr } from "../../utils/formatMoneyPtBr";
import { useServiceSelectScreen } from "./hooks/useServiceSelectScreen";
import { getServiceSelectStyles } from "./styles";
import type { ServiceSelectScreenProps } from "./types";

export type { ServiceSelectScreenProps } from "./types";

export function ServiceSelectScreen(props: ServiceSelectScreenProps) {
  const { theme } = useAppTheme();
  const styles = getServiceSelectStyles(theme);
  const { detailQuery, headerHint, onServicePress, services } =
    useServiceSelectScreen(props);

  const { error, isError, isPending } = detailQuery;

  const renderItem = useCallback(
    ({ index, item }: { index: number; item: ServiceOffering }) => (
      <AnimatedListItem index={index} itemKey={item.id}>
        <ServiceCard
          description={item.description}
          durationMinutes={item.durationMinutes}
          mode="select"
          name={item.name}
          priceLabel={formatMoneyPtBr(item.priceFrom, item.currency)}
          onPress={() => onServicePress(item.id)}
        />
      </AnimatedListItem>
    ),
    [onServicePress],
  );

  if (isPending) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <ActivityIndicator color={theme.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !detailQuery.data) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text style={styles.errorText} variant="bodyTight">
          {error?.message ?? "Não foi possível carregar serviços."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <Text style={styles.hint} variant="bodyTight">
            {headerHint}
          </Text>
        }
        contentContainerStyle={styles.list}
        data={services}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty} variant="bodyTight">
            Nenhum serviço ativo listado.
          </Text>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
