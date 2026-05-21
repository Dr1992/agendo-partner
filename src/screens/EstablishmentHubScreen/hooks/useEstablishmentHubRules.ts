import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useState } from "react";

import {
  removeEstablishmentStaff,
  updatePartnerEstablishment,
} from "../../../api/public/partner";
import { useAuth } from "../../../providers/AuthProvider";

export function useEstablishmentHubRules(establishmentId: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const [reactivateError, setReactivateError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [leaveError, setLeaveError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const leaveMutation = useMutation({
    mutationFn: () =>
      removeEstablishmentStaff(establishmentId, session?.userId ?? ""),
    onSuccess: async () => {
      setShowLeaveAlert(false);
      await queryClient.invalidateQueries({
        queryKey: ["partner", "agenda-establishments"],
      });
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: (error: Error) => {
      setShowLeaveAlert(false);
      setLeaveError({
        title: "Erro",
        message: error.message || "Não foi possível sair do time.",
      });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: () =>
      updatePartnerEstablishment(establishmentId, { isActive: true }),
    onError: (e: Error) => {
      setReactivateError({
        title: "Erro",
        message:
          e instanceof Error ? e.message : "Não foi possível reativar o local.",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["partner", "establishment", establishmentId],
      });
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
    },
  });

  const dismissReactivateError = useCallback(() => {
    setReactivateError(null);
  }, []);

  const onReactivate = useCallback(() => {
    reactivateMutation.mutate();
  }, [reactivateMutation]);

  const confirmLeave = useCallback(() => {
    if (leaveMutation.isPending) {
      return;
    }
    leaveMutation.mutate();
  }, [leaveMutation]);

  return {
    confirmLeave,
    dismissReactivateError,
    leaveError,
    leavePending: leaveMutation.isPending,
    onReactivate,
    reactivateError,
    reactivateMutation,
    setLeaveError,
    setShowLeaveAlert,
    showLeaveAlert,
  };
}
