import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { fetchCategoriesFromApi } from "../../api/public/catalog";
import type { ServiceCategory } from "../../types/category";

export const categoriesQueryKey = ["serviceCategories"] as const;

export function useFetchCategoriesQueryOptions(): UseQueryOptions<
  ServiceCategory[],
  Error
> {
  return {
    queryFn: fetchCategoriesFromApi,
    queryKey: categoriesQueryKey,
  };
}

export function useFetchCategories() {
  return useQuery(useFetchCategoriesQueryOptions());
}
