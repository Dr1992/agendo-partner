import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { getScreenFormStyles } from "../../components/ScreenForm";
import { SignedOutGate } from "../../components/SignedOutGate";
import { StaffAgendaEstablishmentsSection } from "../../components/StaffAgendaEstablishmentsSection/StaffAgendaEstablishmentsSection";
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
  const { session } = useAuth();

  const onSelectEstablishment = useCallback(
    (establishmentId: string, establishmentName: string) => {
      navigation.navigate(AppointmentsStack.StaffAgendaCalendar, {
        establishmentId,
        establishmentName,
      });
    },
    [navigation],
  );

  if (!session) {
    return (
      <SignedOutGate
        buttonText={t("agendaList.gateLogin")}
        subtitle={t("agendaList.gateSubtitle")}
        title={t("agendaList.gateTitle")}
      />
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <StaffAgendaEstablishmentsSection
        showDistanceKm={false}
        onSelectEstablishment={onSelectEstablishment}
      />
    </SafeAreaView>
  );
}
