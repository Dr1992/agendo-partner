import { useFetchEstablishmentDetail } from "../../../hooks/api/useFetchEstablishmentDetail";
import { useFetchTimeSlots } from "../../../hooks/api/useFetchTimeSlots";

export function useBookingScheduleEstablishmentData(establishmentId: string) {
  return useFetchEstablishmentDetail(establishmentId);
}

export function useBookingScheduleSlotsData(
  slotArgs: Parameters<typeof useFetchTimeSlots>[0],
) {
  return useFetchTimeSlots(slotArgs);
}
