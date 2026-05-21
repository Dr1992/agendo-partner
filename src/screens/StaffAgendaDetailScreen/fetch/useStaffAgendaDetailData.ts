import {
  partnerAvailabilityQueryKey,
  useFetchPartnerAvailability,
} from "../../../hooks/api/useFetchPartnerAvailability";
import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useAuth } from "../../../providers/AuthProvider";

export function useStaffAgendaDetailData(
  establishmentId: string,
  professionalId: string,
) {
  const { session } = useAuth();

  const availabilityKey = partnerAvailabilityQueryKey({
    establishmentId,
    professionalId,
  });

  const availabilityQuery = useFetchPartnerAvailability({
    enabled: Boolean(session?.accessToken && establishmentId && professionalId),
    establishmentId,
    professionalId,
    staleTime: 30_000,
  });

  const establishmentQuery = useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    staleTime: 60_000,
    userId: session?.userId,
  });

  return {
    availabilityKey,
    availabilityQuery,
    establishmentQuery,
  };
}
