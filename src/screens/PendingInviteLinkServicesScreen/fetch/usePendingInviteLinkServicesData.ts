import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useFetchPartnerServices } from "../../../hooks/api/useFetchPartnerServices";
import { useAuth } from "../../../providers/AuthProvider";

export function usePendingInviteLinkServicesData(establishmentId: string) {
  const { session } = useAuth();

  const servicesQuery = useFetchPartnerServices({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    userId: session?.userId,
  });

  const establishmentQuery = useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    userId: session?.userId,
  });

  return { establishmentQuery, servicesQuery };
}
