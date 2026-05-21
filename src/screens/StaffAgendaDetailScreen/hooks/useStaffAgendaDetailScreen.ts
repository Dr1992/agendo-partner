import { useAuth } from "../../../providers/AuthProvider";

import type { StaffAgendaDetailScreenProps } from "../types";
import { useStaffAgendaDetailData } from "../fetch/useStaffAgendaDetailData";
import { useStaffAgendaDetailRules } from "./useStaffAgendaDetailRules";

export function useStaffAgendaDetailScreen(
  props: StaffAgendaDetailScreenProps,
) {
  const { establishmentId, establishmentName } = props.route.params;
  const { session } = useAuth();
  const professionalId = session?.userId ?? "";

  const { availabilityKey, availabilityQuery, establishmentQuery } =
    useStaffAgendaDetailData(establishmentId, professionalId);

  const rules = useStaffAgendaDetailRules(
    establishmentId,
    professionalId,
    availabilityKey,
    establishmentQuery.data?.openingSchedule,
    availabilityQuery.data,
  );

  return {
    availabilityQuery,
    establishmentName,
    establishmentQuery,
    professionalId,
    session,
    ...rules,
  };
}
