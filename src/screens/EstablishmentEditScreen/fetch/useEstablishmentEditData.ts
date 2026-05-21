import { useFetchCategories } from "../../../hooks/api/useFetchCategories";
import { useFetchPartnerEstablishment } from "../../../hooks/api/useFetchPartnerEstablishment";
import { useAuth } from "../../../providers/AuthProvider";

export function useEstablishmentEditCategoriesData() {
  return useFetchCategories();
}

export function useEstablishmentEditEstablishmentData(establishmentId: string) {
  const { session } = useAuth();
  return useFetchPartnerEstablishment({
    enabled: Boolean(session?.accessToken && establishmentId),
    establishmentId,
    userId: session?.userId,
  });
}
