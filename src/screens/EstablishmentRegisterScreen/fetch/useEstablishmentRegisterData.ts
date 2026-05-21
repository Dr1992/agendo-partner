import { useFetchCategories } from "../../../hooks/api/useFetchCategories";

export function useEstablishmentRegisterCategoriesData() {
  return useFetchCategories();
}
