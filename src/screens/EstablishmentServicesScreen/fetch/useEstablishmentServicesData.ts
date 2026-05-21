import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useFetchPartnerServices } from "../../../hooks/api/useFetchPartnerServices";
import { useAuth } from "../../../providers/AuthProvider";

export function useEstablishmentServicesData(establishmentId: string) {
  const { session } = useAuth();

  const establishmentQuery = useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    staleTime: 5 * 60_000,
    userId: session?.userId,
  });

  const est = establishmentQuery.data;
  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";

  const servicesQuery = useFetchPartnerServices({
    enabled: Boolean(
      session?.accessToken && establishmentId && est != null && canManage,
    ),
    establishmentId,
    staleTime: 60_000,
    userId: session?.userId,
  });

  return {
    canManage,
    establishmentQuery,
    servicesQuery,
  };
}
