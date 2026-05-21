import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getLoadingCenteredStyles } from "./styles";

type LoadingCenteredProps = {
  edges?: readonly Edge[];
};

export function LoadingCentered({ edges }: LoadingCenteredProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getLoadingCenteredStyles(theme), [theme]);
  const body = <ActivityIndicator color={theme.accent} size="large" />;
  if (edges && edges.length > 0) {
    return (
      <SafeAreaView edges={edges} style={styles.outer}>
        {body}
      </SafeAreaView>
    );
  }
  return <View style={styles.outer}>{body}</View>;
}
