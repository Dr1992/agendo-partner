import { useCallback } from "react";

import type { PartnerServiceRow } from "../../../api/public/partner";
import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { ProfileStack } from "../../../navigation/routeIds";

export function useEstablishmentServicesRules(
  navigation: ProfileScreenProps<"EstablishmentServices">["navigation"],
  establishmentId: string,
  establishmentName: string,
) {
  const onEdit = useCallback(
    (row: PartnerServiceRow) => {
      navigation.navigate(ProfileStack.EstablishmentServiceForm, {
        establishmentId,
        establishmentName,
        serviceId: row.id,
      });
    },
    [establishmentId, establishmentName, navigation],
  );

  const onNewService = useCallback(() => {
    navigation.navigate(ProfileStack.EstablishmentServiceForm, {
      establishmentId,
      establishmentName,
    });
  }, [establishmentId, establishmentName, navigation]);

  return {
    onEdit,
    onNewService,
  };
}
