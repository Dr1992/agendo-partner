import { useFetchEstablishmentDetail } from "../../../hooks/api/useFetchEstablishmentDetail";

export function useBookingConfirmData(establishmentId: string) {
  return useFetchEstablishmentDetail(establishmentId);
}
