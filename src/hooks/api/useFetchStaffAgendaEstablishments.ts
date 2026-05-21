import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  fetchStaffAgendaEstablishments,
  type StaffAgendaEstablishmentsResponse,
} from "../../api/public/partner";

export function staffAgendaEstablishmentsQueryKey(userId: string | undefined) {
  return ["partner", "agenda-establishments", userId] as const;
}

export function useFetchStaffAgendaEstablishmentsQueryOptions(params: {
  enabled?: boolean;
  userId: string | undefined;
}): UseQueryOptions<StaffAgendaEstablishmentsResponse, Error> {
  const { enabled = true, userId } = params;
  return {
    enabled: enabled && Boolean(userId),
    queryFn: () => fetchStaffAgendaEstablishments(),
    queryKey: staffAgendaEstablishmentsQueryKey(userId),
  };
}

export function useFetchStaffAgendaEstablishments(params: {
  enabled?: boolean;
  userId: string | undefined;
}) {
  return useQuery(useFetchStaffAgendaEstablishmentsQueryOptions(params));
}
