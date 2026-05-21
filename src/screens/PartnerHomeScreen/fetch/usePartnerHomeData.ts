import { useFetchPartnerEstablishments } from "../../../hooks/api/useFetchPartnerEstablishments";
import { useAuth } from "../../../providers/AuthProvider";

export function usePartnerHomeData() {
  const { profile, profileComplete, session } = useAuth();
  const listEnabled = Boolean(
    session?.accessToken && profileComplete && profile,
  );

  const query = useFetchPartnerEstablishments({
    enabled: listEnabled,
    userId: session?.userId,
  });

  return { listEnabled, ...query };
}
