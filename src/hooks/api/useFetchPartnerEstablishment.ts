import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { fetchPartnerEstablishment } from "../../api/public/partner";
import type { EstablishmentDetail } from "../../types/establishment";

export function partnerEstablishmentQueryKey(params: {
  establishmentId: string;
  userId: string | undefined;
}) {
  return [
    "partner",
    "establishment",
    params.establishmentId,
    params.userId,
  ] as const;
}

export function useFetchPartnerEstablishmentQueryOptions(params: {
  enabled?: boolean;
  establishmentId: string;
  userId: string | undefined;
  gcTime?: number;
  staleTime?: number;
}): UseQueryOptions<EstablishmentDetail, Error> {
  const { enabled = true, establishmentId, gcTime, staleTime, userId } = params;
  return {
    enabled: enabled && Boolean(userId) && Boolean(establishmentId),
    gcTime,
    queryFn: () => fetchPartnerEstablishment(establishmentId),
    queryKey: partnerEstablishmentQueryKey({ establishmentId, userId }),
    staleTime,
  };
}

export function useFetchPartnerEstablishment(params: {
  enabled?: boolean;
  establishmentId: string;
  userId: string | undefined;
  gcTime?: number;
  staleTime?: number;
}) {
  return useQuery(useFetchPartnerEstablishmentQueryOptions(params));
}
