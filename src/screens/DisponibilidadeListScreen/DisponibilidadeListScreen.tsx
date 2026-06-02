import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { getScreenFormStyles } from "../../components/ScreenForm";
import { SignedOutGate } from "../../components/SignedOutGate";
import { StaffAgendaEstablishmentsSection } from "../../components/StaffAgendaEstablishmentsSection/StaffAgendaEstablishmentsSection";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { DisponibilidadeScreenProps } from "../../navigation/disponibilidadeNavigation.types";
import { DisponibilidadeStack } from "../../navigation/routeIds";
import { useAuth } from "../../providers/AuthProvider";

export function DisponibilidadeListScreen({
  navigation,
}: DisponibilidadeScreenProps<"DisponibilidadeList">) {
  const { t } = useTranslation("staff");
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const { session } = useAuth();

  const onSelectEstablishment = useCallback(
    (establishmentId: string, establishmentName: string) => {
      navigation.navigate(DisponibilidadeStack.StaffAgendaDetail, {
        establishmentId,
        establishmentName,
      });
    },
    [navigation],
  );

  if (!session) {
    return (
      <SignedOutGate
        buttonText={t("disponibilidadeList.gateLogin")}
        subtitle={t("disponibilidadeList.gateSubtitle")}
        title={t("disponibilidadeList.gateTitle")}
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
