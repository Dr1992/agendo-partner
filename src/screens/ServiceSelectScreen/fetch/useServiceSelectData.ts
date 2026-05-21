import { useFetchEstablishmentDetail } from "../../../hooks/api/useFetchEstablishmentDetail";

export function useServiceSelectData(establishmentId: string) {
  return useFetchEstablishmentDetail(establishmentId);
}
