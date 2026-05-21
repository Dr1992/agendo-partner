import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  fetchPartnerServices,
  type PartnerServiceRow,
} from "../../api/public/partner";

export function partnerServicesQueryKey(params: {
  establishmentId: string;
  userId: string | undefined;
}) {
  return [
    "partner",
    "services",
    params.establishmentId,
    params.userId,
  ] as const;
}

export function useFetchPartnerServicesQueryOptions(params: {
  enabled?: boolean;
  establishmentId: string;
  userId: string | undefined;
  staleTime?: number;
}): UseQueryOptions<{ data: PartnerServiceRow[] }, Error> {
  const { enabled = true, establishmentId, staleTime, userId } = params;
  return {
    enabled: enabled && Boolean(userId) && Boolean(establishmentId),
    queryFn: () => fetchPartnerServices(establishmentId),
    queryKey: partnerServicesQueryKey({ establishmentId, userId }),
    staleTime,
  };
}

export function useFetchPartnerServices(params: {
  enabled?: boolean;
  establishmentId: string;
  userId: string | undefined;
  staleTime?: number;
}) {
  return useQuery(useFetchPartnerServicesQueryOptions(params));
}
