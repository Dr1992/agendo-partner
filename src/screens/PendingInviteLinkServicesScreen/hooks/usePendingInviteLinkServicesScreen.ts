import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";

import { usePendingInviteLinkServicesData } from "../fetch/usePendingInviteLinkServicesData";
import { usePendingInviteLinkServicesRules } from "./usePendingInviteLinkServicesRules";

export function usePendingInviteLinkServicesScreen(
  props: ProfileScreenProps<"PendingInviteLinkServices">,
) {
  const { afterInviteFlow, establishmentId, inviteId } = props.route.params;
  const { establishmentQuery, servicesQuery } =
    usePendingInviteLinkServicesData(establishmentId);

  const rules = usePendingInviteLinkServicesRules(
    props.navigation,
    establishmentId,
    inviteId,
    afterInviteFlow,
    establishmentQuery.data,
    servicesQuery.data,
  );

  return {
    establishmentQuery,
    servicesQuery,
    ...rules,
  };
}
