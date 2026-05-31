import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("team");
  return (
    <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
      <Text variant="body">
        {error instanceof Error
          ? error.message
          : t("collaborators.errorFallback")}
      </Text>
      {isError ? (
        <Button style={styles.ctaRetryFullWidth} onPress={() => void onRetry()}>
          {t("common.retry")}
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
  const { t } = useTranslation("team");
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <Text style={styles.body} variant="body">
        {t("collaborators.noAccess")}
      </Text>
    </SafeAreaView>
  );
}
