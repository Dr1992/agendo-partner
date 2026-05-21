import { useMemo } from "react";

import type { ServiceSelectScreenProps } from "../types";

import { useServiceSelectData } from "../fetch/useServiceSelectData";
import { useServiceSelectRules } from "./useServiceSelectRules";

export function useServiceSelectScreen({
  navigation,
  route,
}: ServiceSelectScreenProps) {
  const { establishmentId } = route.params;
  const detailQuery = useServiceSelectData(establishmentId);
  const services = useMemo(
    () => (detailQuery.data?.services ?? []).filter((s) => s.active),
    [detailQuery.data?.services],
  );
  const rules = useServiceSelectRules(navigation, route.params);

  return {
    detailQuery,
    services,
    ...rules,
  };
}
