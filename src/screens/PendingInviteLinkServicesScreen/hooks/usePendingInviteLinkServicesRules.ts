import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { PartnerServiceRow } from "../../../api/public/partner";
import { patchInvitePlannedServices } from "../../../api/public/partner";
import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import type { EstablishmentDetail } from "../../../types/establishment";

type ServicesPayload = { data: PartnerServiceRow[] } | undefined;

export function usePendingInviteLinkServicesRules(
  navigation: ProfileScreenProps<"PendingInviteLinkServices">["navigation"],
  establishmentId: string,
  inviteId: string,
  afterInviteFlow: boolean | undefined,
  establishmentDetail: EstablishmentDetail | undefined,
  servicesPayload: ServicesPayload,
) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled || !establishmentDetail?.pendingInvites?.length) {
      return;
    }
    const inv = establishmentDetail.pendingInvites.find(
      (i) => i.id === inviteId,
    );
    if (inv && inv.plannedPerformerServiceIds.length > 0) {
      setSelected(new Set(inv.plannedPerformerServiceIds));
      setPrefilled(true);
    }
  }, [establishmentDetail?.pendingInvites, inviteId, prefilled]);

  const services = useMemo(
    () =>
      (servicesPayload?.data ?? []).filter(
        (s) => s.isActive && s.name.trim().length > 0,
      ),
    [servicesPayload?.data],
  );

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const saveMutation = useMutation({
    mutationFn: (serviceIds: string[]) =>
      patchInvitePlannedServices(establishmentId, inviteId, serviceIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      const pops = afterInviteFlow ? 3 : 1;
      navigation.pop(pops);
    },
  });

  const onSave = useCallback(() => {
    void saveMutation.mutateAsync([...selected]);
  }, [saveMutation, selected]);

  return {
    onSave,
    saveMutation,
    selected,
    services,
    toggle,
  };
}
