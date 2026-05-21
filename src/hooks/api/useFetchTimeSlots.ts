import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { fetchTimeSlotsFromApi } from "../../api/public/slots";
import type { TimeSlotOption } from "../../types/timeSlot";

export const timeSlotsQueryKey = (args: {
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  durationMinutes: number;
}) => ["timeSlots", args] as const;

export function useFetchTimeSlotsQueryOptions(args: {
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  durationMinutes: number;
}): UseQueryOptions<TimeSlotOption[], Error> {
  const enabled =
    args.establishmentId.length > 0 &&
    args.serviceId.length > 0 &&
    args.professionalId.length > 0 &&
    args.durationMinutes > 0;

  return {
    enabled,
    queryFn: () => fetchTimeSlotsFromApi(args),
    queryKey: timeSlotsQueryKey(args),
  };
}

export function useFetchTimeSlots(args: {
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  durationMinutes: number;
}) {
  return useQuery(useFetchTimeSlotsQueryOptions(args));
}
