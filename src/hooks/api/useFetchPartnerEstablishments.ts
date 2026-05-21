import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  fetchPartnerEstablishments,
  type PartnerEstablishmentsListResponse,
} from "../../api/public/partner";

export function partnerEstablishmentsQueryKey(userId: string | undefined) {
  return ["partner", "establishments", userId] as const;
}

export function useFetchPartnerEstablishmentsQueryOptions(params: {
  enabled: boolean;
  userId: string | undefined;
}): UseQueryOptions<PartnerEstablishmentsListResponse, Error> {
  const { enabled, userId } = params;
  return {
    enabled: enabled && Boolean(userId),
    gcTime: 24 * 60 * 60_000,
    queryFn: () => fetchPartnerEstablishments(),
    queryKey: partnerEstablishmentsQueryKey(userId),
    staleTime: 60_000,
  };
}

export function useFetchPartnerEstablishments(params: {
  enabled: boolean;
  userId: string | undefined;
}) {
  return useQuery(useFetchPartnerEstablishmentsQueryOptions(params));
}
