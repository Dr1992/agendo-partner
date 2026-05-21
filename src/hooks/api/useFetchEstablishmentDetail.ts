import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { fetchEstablishmentDetailFromApi } from "../../api/public/catalog";
import type { EstablishmentDetail } from "../../types/establishment";

export const establishmentDetailQueryKey = (id: string) =>
  ["establishmentDetail", id] as const;

export function useFetchEstablishmentDetailQueryOptions(
  establishmentId: string,
): UseQueryOptions<EstablishmentDetail | null, Error> {
  return {
    enabled: establishmentId.length > 0,
    queryFn: () => fetchEstablishmentDetailFromApi(establishmentId),
    queryKey: establishmentDetailQueryKey(establishmentId),
  };
}

export function useFetchEstablishmentDetail(establishmentId: string) {
  return useQuery(useFetchEstablishmentDetailQueryOptions(establishmentId));
}
