import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";

import type { StaffAgendaEstablishmentRow } from "../../api/public/partner";
import { useFetchStaffAgendaEstablishments } from "../../hooks/api/useFetchStaffAgendaEstablishments";
import { EstablishmentRowCard } from "../EstablishmentRowCard/EstablishmentRowCard";
import { InlineLoading } from "../InlineLoading";
import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useAuth } from "../../providers/AuthProvider";
import { MIN_RATINGS_FOR_PUBLIC_AVERAGE } from "../../utils/establishmentPublicRating";
import { haversineKm } from "../../utils/haversineKm";
import { getScreenFormStyles } from "../ScreenForm";

import { getStaffAgendaEstablishmentsSectionStyles } from "./styles";

type StaffAgendaEstablishmentsSectionProps = {
  onSelectEstablishment: (
    establishmentId: string,
    establishmentName: string,
  ) => void;
  /**
   * Quando `false`, não mostra a pill de km mesmo com GPS e coordenadas do local.
   * Por defeito `true` (mantém o comportamento anterior).
   */
  showDistanceKm?: boolean;
};

function distanceKmForRow(
  row: StaffAgendaEstablishmentRow,
  coords: { latitude: number; longitude: number } | null,
): number | null {
  if (
    coords == null ||
    row.latitude == null ||
    row.longitude == null ||
    !Number.isFinite(row.latitude) ||
    !Number.isFinite(row.longitude)
  ) {
    return null;
  }
  const km = haversineKm(
    coords.latitude,
    coords.longitude,
    row.latitude,
    row.longitude,
  );
  return Number.isFinite(km) ? km : null;
}

export function StaffAgendaEstablishmentsSection({
  onSelectEstablishment,
  showDistanceKm = true,
}: StaffAgendaEstablishmentsSectionProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const cardStyles = useMemo(
    () => getStaffAgendaEstablishmentsSectionStyles(theme),
    [theme],
  );
  const { coords, refresh } = useUserLocation();
  const { session, profileComplete } = useAuth();
  const canLoadStaffAgenda = Boolean(session?.accessToken && profileComplete);

  useFocusEffect(
    useCallback(() => {
      if (showDistanceKm) {
        void refresh();
      }
    }, [refresh, showDistanceKm]),
  );

  const { data, isPending } = useFetchStaffAgendaEstablishments({
    enabled: canLoadStaffAgenda,
    userId: session?.userId,
  });

  const rows = data?.data ?? [];

  const hasCards = Boolean(
    session?.accessToken && profileComplete && !isPending && rows.length > 0,
  );

  const scrollContentStyle = useMemo(
    () =>
      hasCards
        ? styles.scrollContent
        : [styles.scrollContent, cardStyles.scrollContentCentered],
    [cardStyles.scrollContentCentered, hasCards, styles.scrollContent],
  );

  return (
    <ScrollView
      contentContainerStyle={scrollContentStyle}
      style={styles.scroll}
    >
      {!session?.accessToken ? (
        <Text style={cardStyles.centeredMessage} variant="body">
          Faça login para ver sua agenda como colaborador.
        </Text>
      ) : !profileComplete ? (
        <Text style={cardStyles.centeredMessage} variant="body">
          Complete seu cadastro no perfil para ver seus estabelecimentos.
        </Text>
      ) : canLoadStaffAgenda && isPending ? (
        <InlineLoading />
      ) : rows.length === 0 ? null : (
        rows.map((r) => {
          const km = showDistanceKm ? distanceKmForRow(r, coords) : null;
          const showDistance = showDistanceKm && km != null && km > 0;
          const categoryLabel = r.categoryLabel?.trim()
            ? r.categoryLabel.trim()
            : "Sem categoria";
          const addressLine =
            r.addressShort?.trim() ||
            [r.cityName, r.stateUf].filter(Boolean).join(" — ") ||
            "—";

          return (
            <EstablishmentRowCard
              key={r.id}
              addressShort={addressLine}
              categoryLabel={categoryLabel}
              compact
              containerStyle={cardStyles.card}
              distanceKm={km ?? undefined}
              hint={
                r.isActive === false ? (
                  <Text style={cardStyles.inactiveHint} variant="hint">
                    Local desativado — só gestão/dono pode reativar.
                  </Text>
                ) : undefined
              }
              rating={r.rating}
              reviewCount={r.reviewCount}
              showDistance={showDistance}
              showRating={r.reviewCount >= MIN_RATINGS_FOR_PUBLIC_AVERAGE}
              theme={theme}
              thumbnailUrl={r.thumbnailUrl}
              title={r.name}
              onPress={() => onSelectEstablishment(r.id, r.name)}
            />
          );
        })
      )}
    </ScrollView>
  );
}
