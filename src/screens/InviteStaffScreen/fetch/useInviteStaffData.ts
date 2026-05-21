import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useAuth } from "../../../providers/AuthProvider";

export function useInviteStaffData(establishmentId: string) {
  const { session } = useAuth();
  return useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    userId: session?.userId,
  });
}
