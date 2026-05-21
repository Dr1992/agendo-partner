import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useFetchPartnerServices } from "../../../hooks/api/useFetchPartnerServices";
import { useAuth } from "../../../providers/AuthProvider";

export function useEstablishmentServiceFormEstablishmentData(
  establishmentId: string,
) {
  const { session } = useAuth();
  return useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    userId: session?.userId,
  });
}

export function useEstablishmentServiceFormServicesData(
  establishmentId: string,
  serviceId: string | undefined,
) {
  const { session } = useAuth();
  return useFetchPartnerServices({
    enabled: Boolean(session?.accessToken && establishmentId && serviceId),
    establishmentId,
    userId: session?.userId,
  });
}
