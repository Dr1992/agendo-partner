import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { OpeningHoursEditor } from "../../components/OpeningHoursEditor/OpeningHoursEditor";
import { LoadingCentered } from "../../components/LoadingCentered";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useStaffAgendaDetailScreen } from "./hooks/useStaffAgendaDetailScreen";
import { getStaffAgendaDetailScreenStyles } from "./styles";
import type { StaffAgendaDetailScreenProps } from "./types";

export type { StaffAgendaDetailScreenProps } from "./types";

export function StaffAgendaDetailScreen(props: StaffAgendaDetailScreenProps) {
  const { t } = useTranslation("staff");
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const local = useMemo(() => getStaffAgendaDetailScreenStyles(theme), [theme]);

  const {
    agendaDialog,
    availabilityQuery,
    dismissAgendaDialog,
    establishmentName,
    onSave,
    saveMutation,
    schedule,
    scheduleOk,
    session,
    setSchedule,
  } = useStaffAgendaDetailScreen(props);

  const { error, isError, isPending, refetch } = availabilityQuery;

  if (!session?.accessToken) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">{t("detail.gateText")}</Text>
      </SafeAreaView>
    );
  }

  if (isPending) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">
          {error instanceof Error ? error.message : t("detail.loadError")}
        </Text>
        <View style={[local.actions, local.retryBar]}>
          <Button
            style={styles.ctaRetryFullWidth}
            onPress={() => void refetch()}
          >
            {t("detail.retry")}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {agendaDialog ? (
        <AlertDialog
          buttons={[
            {
              label: t("detail.ok"),
              onPress: dismissAgendaDialog,
              variant: "primary",
            },
          ]}
          message={agendaDialog.message}
          title={agendaDialog.title}
          visible
          onRequestClose={dismissAgendaDialog}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Text variant="title">{establishmentName}</Text>
        <Text style={local.intro} variant="body">
          {t("detail.intro")}
        </Text>

        <View style={local.editor}>
          <OpeningHoursEditor
            hint={false}
            value={schedule}
            onChange={setSchedule}
          />
        </View>
        <View style={local.actions}>
          <Button
            disabled={!scheduleOk || saveMutation.isPending}
            loading={saveMutation.isPending}
            onPress={onSave}
          >
            {t("detail.save")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
