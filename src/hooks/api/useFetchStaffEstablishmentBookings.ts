import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  fetchStaffEstablishmentBookings,
  type StaffEstablishmentBookingsResponse,
} from "../../api/public/partner";

export function staffEstablishmentBookingsQueryKey(params: {
  establishmentId: string;
  from: string;
  to: string;
  userId: string | undefined;
}) {
  return [
    "partner",
    "staff-bookings",
    params.establishmentId,
    params.userId,
    params.from,
    params.to,
  ] as const;
}

export function useFetchStaffEstablishmentBookingsQueryOptions(params: {
  enabled?: boolean;
  establishmentId: string;
  from: string;
  to: string;
  userId: string | undefined;
  staleTime?: number;
}): UseQueryOptions<StaffEstablishmentBookingsResponse, Error> {
  const {
    enabled = true,
    establishmentId,
    from,
    staleTime,
    to,
    userId,
  } = params;
  return {
    enabled: enabled && Boolean(userId) && Boolean(establishmentId),
    queryFn: () => fetchStaffEstablishmentBookings(establishmentId, from, to),
    queryKey: staffEstablishmentBookingsQueryKey({
      establishmentId,
      from,
      to,
      userId,
    }),
    staleTime,
  };
}

export function useFetchStaffEstablishmentBookings(params: {
  enabled?: boolean;
  establishmentId: string;
  from: string;
  to: string;
  userId: string | undefined;
  staleTime?: number;
}) {
  return useQuery(useFetchStaffEstablishmentBookingsQueryOptions(params));
}
