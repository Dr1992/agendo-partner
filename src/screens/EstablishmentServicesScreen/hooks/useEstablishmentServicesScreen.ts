import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";

import { useEstablishmentServicesData } from "../fetch/useEstablishmentServicesData";
import { useEstablishmentServicesRules } from "./useEstablishmentServicesRules";

export function useEstablishmentServicesScreen(
  props: ProfileScreenProps<"EstablishmentServices">,
) {
  const { establishmentId, establishmentName } = props.route.params;
  const data = useEstablishmentServicesData(establishmentId);
  const rules = useEstablishmentServicesRules(
    props.navigation,
    establishmentId,
    establishmentName,
  );

  return {
    ...data,
    ...rules,
    establishmentId,
    establishmentName,
  };
}
