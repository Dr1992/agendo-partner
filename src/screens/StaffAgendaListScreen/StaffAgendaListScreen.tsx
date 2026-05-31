import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getStaffAgendaListStyles } from "./styles";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { StaffAgendaEstablishmentsSection } from "../../components/StaffAgendaEstablishmentsSection/StaffAgendaEstablishmentsSection";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { AppointmentsStack } from "../../navigation/routeIds";
import { useAuth } from "../../providers/AuthProvider";

export function StaffAgendaListScreen({
  navigation,
}: ProfileScreenProps<"StaffAgendaList">) {
  const { t } = useTranslation("staff");
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const screenStyles = useMemo(() => getStaffAgendaListStyles(theme), [theme]);
  const { session, signIn } = useAuth();
  const [loginError, setLoginError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const onLogin = useCallback(async () => {
    try {
      await signIn();
    } catch (e) {
      setLoginError({
        title: t("agendaList.loginErrorTitle"),
        message:
          e instanceof Error ? e.message : t("agendaList.loginErrorDefault"),
      });
    }
  }, [signIn, t]);

  const onSelectEstablishment = useCallback(
    (establishmentId: string, establishmentName: string) => {
      navigation.navigate(AppointmentsStack.StaffAgendaCalendar, {
        establishmentId,
        establishmentName,
      });
    },
    [navigation],
  );

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {loginError ? (
        <AlertDialog
          buttons={[
            {
              label: t("agendaList.ok"),
              onPress: () => setLoginError(null),
              variant: "primary",
            },
          ]}
          message={loginError.message}
          title={loginError.title}
          visible
          onRequestClose={() => setLoginError(null)}
        />
      ) : null}
      {!session ? (
        <View style={styles.center}>
          <Text style={screenStyles.gateText} variant="body">
            {t("agendaList.gateText")}
          </Text>
          <Button
            style={styles.ctaRetryFullWidth}
            onPress={() => void onLogin()}
          >
            {t("agendaList.login")}
          </Button>
        </View>
      ) : (
        <StaffAgendaEstablishmentsSection
          showDistanceKm={false}
          onSelectEstablishment={onSelectEstablishment}
        />
      )}
    </SafeAreaView>
  );
}
