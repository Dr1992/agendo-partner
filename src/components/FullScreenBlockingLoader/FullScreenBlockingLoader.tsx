import { useMemo } from "react";
import { ActivityIndicator, Modal, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getFullScreenBlockingLoaderStyles } from "./styles";

type FullScreenBlockingLoaderProps = {
  visible: boolean;
};

/**
 * Bloqueia o ecrã com um indicador de carregamento (ex.: enquanto o picker de fotos prepara abertura).
 * Usa `Modal` nativo para ficar acima do restante da hierarquia do ecrã.
 */
export function FullScreenBlockingLoader({
  visible,
}: FullScreenBlockingLoaderProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getFullScreenBlockingLoaderStyles(theme),
    [theme],
  );

  return (
    <Modal
      animationType="none"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={[styles.modalRoot, styles.scrim]}>
        <View style={styles.fill}>
          <ActivityIndicator color={theme.accent} size="large" />
        </View>
      </View>
    </Modal>
  );
}
