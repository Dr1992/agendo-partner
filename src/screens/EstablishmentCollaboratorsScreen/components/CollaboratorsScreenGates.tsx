import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../../components/Button";
import { LoadingCentered } from "../../../components/LoadingCentered";
import { Text } from "../../../components/Text";
import { getScreenFormStyles } from "../../../components/ScreenForm";

type FormStyles = ReturnType<typeof getScreenFormStyles>;

type CollaboratorsLoadingGateProps = {
  styles: FormStyles;
};

export function CollaboratorsLoadingGate({
  styles,
}: CollaboratorsLoadingGateProps) {
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <LoadingCentered />
    </SafeAreaView>
  );
}

type CollaboratorsErrorGateProps = {
  error: unknown;
  isError: boolean;
  onRetry: () => void;
  styles: FormStyles;
};

export function CollaboratorsErrorGate({
  error,
  isError,
  onRetry,
  styles,
}: CollaboratorsErrorGateProps) {
  return (
    <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
      <Text variant="body">
        {error instanceof Error
          ? error.message
          : "Local não encontrado ou sem permissão."}
      </Text>
      {isError ? (
        <Button style={styles.ctaRetryFullWidth} onPress={() => void onRetry()}>
          Tentar novamente
        </Button>
      ) : null}
    </SafeAreaView>
  );
}

type CollaboratorsNoAccessGateProps = {
  styles: FormStyles;
};

export function CollaboratorsNoAccessGate({
  styles,
}: CollaboratorsNoAccessGateProps) {
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <Text style={styles.body} variant="body">
        Só o dono ou o gestor pode gerir colaboradores neste local.
      </Text>
    </SafeAreaView>
  );
}
