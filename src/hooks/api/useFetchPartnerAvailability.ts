import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  fetchPartnerAvailability,
  type PartnerAvailabilityRulesResponse,
} from "../../api/public/partner";

export function partnerAvailabilityQueryKey(params: {
  establishmentId: string;
  professionalId: string;
}) {
  return [
    "partner",
    "availability",
    params.establishmentId,
    params.professionalId,
  ] as const;
}

export function useFetchPartnerAvailabilityQueryOptions(params: {
  enabled?: boolean;
  establishmentId: string;
  professionalId: string;
  staleTime?: number;
}): UseQueryOptions<PartnerAvailabilityRulesResponse, Error> {
  const { enabled = true, establishmentId, professionalId, staleTime } = params;
  return {
    enabled: enabled && Boolean(establishmentId) && Boolean(professionalId),
    queryFn: () => fetchPartnerAvailability(establishmentId, professionalId),
    queryKey: partnerAvailabilityQueryKey({ establishmentId, professionalId }),
    staleTime,
  };
}

export function useFetchPartnerAvailability(params: {
  enabled?: boolean;
  establishmentId: string;
  professionalId: string;
  staleTime?: number;
}) {
  return useQuery(useFetchPartnerAvailabilityQueryOptions(params));
}
