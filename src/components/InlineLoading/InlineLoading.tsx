import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getInlineLoadingStyles } from "./styles";

/** Spinner para listas / secções dentro de `ScrollView` (não ocupa o ecrã inteiro). */
export function InlineLoading() {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getInlineLoadingStyles(), []);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator
        accessibilityLabel={t("inlineLoading.loading")}
        color={theme.accent}
        size="large"
      />
    </View>
  );
}
