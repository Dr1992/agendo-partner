import { useMemo } from "react";

import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { useProfileAgendaData } from "../../ProfileScreen/fetch/useProfileAgendaData";

import { usePartnerHomeData } from "../fetch/usePartnerHomeData";
import { partitionPartnerRows } from "../utils/partitionPartnerRows";
import { usePartnerHomeRules } from "./usePartnerHomeRules";

export function usePartnerHomeScreen({
  navigation,
}: ProfileScreenProps<"PartnerHome">) {
  const listQuery = usePartnerHomeData();
  const staffQuery = useProfileAgendaData();
  const rules = usePartnerHomeRules(navigation);

  const partnerRows = useMemo(
    () => listQuery.data?.data ?? [],
    [listQuery.data?.data],
  );

  const staffRows = useMemo(
    () =>
      (staffQuery.data?.data ?? []).filter(
        (row) => row.viewerMemberRole === "STAFF",
      ),
    [staffQuery.data?.data],
  );

  const isCollaboratorOnly = partnerRows.length === 0 && staffRows.length > 0;

  const { activeRows, hasInactive, inactiveRows } = useMemo(
    () => partitionPartnerRows(partnerRows),
    [partnerRows],
  );

  return {
    activeRows,
    hasInactive,
    inactiveRows,
    isCollaboratorOnly,
    listEnabled: listQuery.listEnabled,
    listPending: listQuery.isPending,
    listRes: listQuery.data,
    loginError: rules.loginError,
    onLogin: rules.onLogin,
    partnerRows,
    staffRows,
    dismissLoginError: rules.dismissLoginError,
    showFixedRegisterButton:
      rules.showFixedRegisterButton && !isCollaboratorOnly,
  };
}
