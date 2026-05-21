import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getInlineLoadingStyles } from "./styles";

/** Spinner para listas / secções dentro de `ScrollView` (não ocupa o ecrã inteiro). */
export function InlineLoading() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getInlineLoadingStyles(), []);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator
        accessibilityLabel="Carregando"
        color={theme.accent}
        size="large"
      />
    </View>
  );
}
