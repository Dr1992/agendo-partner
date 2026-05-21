import { useFetchStaffEstablishmentBookings } from "../../../hooks/api/useFetchStaffEstablishmentBookings";
import { useAuth } from "../../../providers/AuthProvider";

export function usePersonalCommitmentBookingsData(
  establishmentId: string,
  from: string,
  to: string,
) {
  const { session } = useAuth();
  return useFetchStaffEstablishmentBookings({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    from,
    staleTime: 30_000,
    to,
    userId: session?.userId,
  });
}
