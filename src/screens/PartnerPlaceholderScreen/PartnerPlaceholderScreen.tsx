import { useTranslation } from "react-i18next";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { getScreenFormStyles } from "../../components/ScreenForm";

export function PartnerPlaceholderScreen({
  navigation,
  route,
}: ProfileScreenProps<"PartnerPlaceholder">) {
  const { subtitle, title } = route.params;
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = getScreenFormStyles(theme);

  return (
    <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.body, { textAlign: "center" }]}>{subtitle}</Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        style={[styles.cta, { marginTop: 24, minWidth: 200 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.ctaText}>{t("placeholder.backButton")}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
