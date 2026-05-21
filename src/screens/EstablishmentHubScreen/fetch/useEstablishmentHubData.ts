import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useAuth } from "../../../providers/AuthProvider";

export function useEstablishmentHubData(establishmentId: string) {
  const { session } = useAuth();
  return useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    gcTime: 24 * 60 * 60_000,
    staleTime: 5 * 60_000,
    userId: session?.userId,
  });
}
