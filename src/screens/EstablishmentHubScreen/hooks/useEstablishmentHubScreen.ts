import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { useAuth } from "../../../providers/AuthProvider";

import { useEstablishmentHubData } from "../fetch/useEstablishmentHubData";
import { useEstablishmentHubRules } from "./useEstablishmentHubRules";

export function useEstablishmentHubScreen(
  props: ProfileScreenProps<"EstablishmentHub">,
) {
  const { establishmentId } = props.route.params;
  const { session } = useAuth();
  const establishmentQuery = useEstablishmentHubData(establishmentId);
  const rules = useEstablishmentHubRules(establishmentId);

  const est = establishmentQuery.data;
  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";
  const canToggleActive = est?.viewerMemberRole === "OWNER";
  const isEstablishmentInactive = est?.isActive === false;
  const menuDisabled = isEstablishmentInactive;

  const showFooterUnlock =
    isEstablishmentInactive && canToggleActive && Boolean(session?.accessToken);

  const isStaffMember = est?.viewerMemberRole === "STAFF";

  return {
    canManage,
    canToggleActive,
    establishmentQuery,
    isEstablishmentInactive,
    isStaffMember,
    menuDisabled,
    showFooterUnlock,
    ...rules,
  };
}
