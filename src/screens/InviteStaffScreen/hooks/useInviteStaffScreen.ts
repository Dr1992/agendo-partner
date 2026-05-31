import { useTranslation } from "react-i18next";

import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";

import { useInviteStaffData } from "../fetch/useInviteStaffData";
import { useInviteStaffRules } from "./useInviteStaffRules";

export function useInviteStaffScreen(props: ProfileScreenProps<"InviteStaff">) {
  const { establishmentId, establishmentName } = props.route.params;
  const { t } = useTranslation("team");
  const establishmentQuery = useInviteStaffData(establishmentId);
  const rules = useInviteStaffRules(
    props.navigation,
    establishmentId,
    establishmentName,
    establishmentQuery.data,
    t,
  );

  return {
    establishmentQuery,
    ...rules,
  };
}
