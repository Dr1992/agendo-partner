import { useCallback } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../hooks/useAppTheme";
import { PartnerMainTab, ProfileStack } from "../../navigation/routeIds";
import { rootNavigationRef } from "../../navigation/rootNavigationRef";
import { Text } from "../Text";
import { getSignedOutGateStyles } from "./styles";

type SignedOutGateProps = {
  buttonText: string;
  subtitle: string;
  title: string;
};

export function SignedOutGate({
  buttonText,
  subtitle,
  title,
}: SignedOutGateProps) {
  const { theme } = useAppTheme();
  const styles = getSignedOutGateStyles(theme);

  const goToProfile = useCallback(() => {
    const navigate = (): void => {
      if (!rootNavigationRef.isReady()) {
        setTimeout(navigate, 32);
        return;
      }
      rootNavigationRef.navigate(PartnerMainTab.Perfil, {
        screen: ProfileStack.ProfileMain,
      });
    };
    navigate();
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Text style={styles.title} variant="listTitle">
        {title}
      </Text>
      <Text style={styles.subtitle} variant="bodyTight">
        {subtitle}
      </Text>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={goToProfile}
      >
        <Text style={styles.buttonText} variant="bodyTight">
          {buttonText}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
