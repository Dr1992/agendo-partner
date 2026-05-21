import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createStaffInvite,
  deletePartnerInvite,
  removeEstablishmentStaff,
} from "../../../api/public/partner";
import { isValidCpf, normalizeCpfDigits } from "../../../utils/cpf";
import {
  clearOwnerTeamPromoDismissed,
  readOwnerTeamPromoDismissed,
  writeOwnerTeamPromoDismissed,
} from "../../../utils/ownerTeamPromoDismissedStorage";
import type { EstablishmentDetail } from "../../../types/establishment";

type RemoveTarget = {
  id: string;
  name: string;
} | null;

type TeamFeedback = {
  message: string;
  title: string;
} | null;

type UseEstablishmentCollaboratorsRulesParams = {
  est: EstablishmentDetail | undefined;
  establishmentId: string;
  profileCpf: string;
  refetch: () => Promise<{ data: EstablishmentDetail | undefined }>;
  sessionUserId: string | undefined;
};

export function useEstablishmentCollaboratorsRules({
  est,
  establishmentId,
  profileCpf,
  refetch,
  sessionUserId,
}: UseEstablishmentCollaboratorsRulesParams) {
  const queryClient = useQueryClient();
  const [includeSelfDialogOpen, setIncludeSelfDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget>(null);
  const [teamFeedback, setTeamFeedback] = useState<TeamFeedback>(null);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [revokeInviteId, setRevokeInviteId] = useState<string | null>(null);
  /**
   * `null` = a carregar do armazenamento; `false` = mostrar cartão se aplicável;
   * `true` = utilizador já concluiu o fluxo (persistido — sobrevive a sair do ecrã).
   */
  const [ownerSelfPromoDismissed, setOwnerSelfPromoDismissed] = useState<
    boolean | null
  >(null);

  const ownerCpfDigits = useMemo(
    () => normalizeCpfDigits(profileCpf),
    [profileCpf],
  );
  const ownerHasValidCpf = useMemo(
    () => isValidCpf(ownerCpfDigits),
    [ownerCpfDigits],
  );

  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";

  useEffect(() => {
    setOwnerSelfPromoDismissed(null);
    if (!establishmentId || !sessionUserId) {
      setOwnerSelfPromoDismissed(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const stored = await readOwnerTeamPromoDismissed(
        establishmentId,
        sessionUserId,
      );
      if (!cancelled) {
        setOwnerSelfPromoDismissed(stored);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [establishmentId, sessionUserId]);

  const deleteInviteMutation = useMutation({
    mutationFn: (inviteId: string) => deletePartnerInvite(inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
    },
  });

  const removeStaffMutation = useMutation({
    mutationFn: (userId: string) =>
      removeEstablishmentStaff(establishmentId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: ["partner", "agenda-establishments"],
      });
    },
  });

  const includeOwnerAsStaffMutation = useMutation({
    mutationFn: () =>
      createStaffInvite(establishmentId, ownerCpfDigits, "STAFF"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: ["partner", "agenda-establishments"],
      });
    },
  });

  const onRemoveMember = useCallback((memberId: string, memberName: string) => {
    setRemoveTarget({ id: memberId, name: memberName });
  }, []);

  const confirmRevokeInvite = useCallback(() => {
    if (!revokeInviteId || deleteInviteMutation.isPending) {
      return;
    }
    const id = revokeInviteId;
    void (async () => {
      try {
        await deleteInviteMutation.mutateAsync(id);
        setRevokeInviteId(null);
      } catch (e) {
        setRevokeInviteId(null);
        setTeamFeedback({
          title: "Revogar convite",
          message: e instanceof Error ? e.message : "Não foi possível revogar.",
        });
      }
    })();
  }, [deleteInviteMutation, revokeInviteId]);

  useEffect(() => {
    const pendingInviteCount = est?.pendingInvites?.length ?? 0;
    if (pendingModalOpen && pendingInviteCount === 0) {
      setPendingModalOpen(false);
    }
  }, [est?.pendingInvites, pendingModalOpen]);

  /** Limpa confirmação de revogação pendente (evita estado preso se o utilizador fechar e reabrir o sheet). */
  const openPendingInvitesSheet = useCallback(() => {
    setRevokeInviteId(null);
    setPendingModalOpen(true);
  }, []);

  const confirmRemoveMember = useCallback(() => {
    if (!removeTarget || removeStaffMutation.isPending) {
      return;
    }
    const { id } = removeTarget;
    void (async () => {
      try {
        await removeStaffMutation.mutateAsync(id);
        setRemoveTarget(null);
        setTeamFeedback({
          title: "Removido",
          message: "O colaborador foi retirado da equipe.",
        });
      } catch (e) {
        setRemoveTarget(null);
        setTeamFeedback({
          title: "Erro",
          message: e instanceof Error ? e.message : "Não foi possível remover.",
        });
      }
    })();
  }, [removeStaffMutation, removeTarget]);

  const viewerIsListedAsProfessional = useMemo(() => {
    if (!est || !sessionUserId) {
      return false;
    }
    return est.professionals.some((p) => p.id === sessionUserId);
  }, [est, sessionUserId]);

  const showOwnerSelfServeCard = useMemo(() => {
    if (ownerSelfPromoDismissed !== false || !est || !sessionUserId) {
      return false;
    }
    if (est.viewerMemberRole !== "OWNER") {
      return false;
    }
    return !viewerIsListedAsProfessional;
  }, [
    est,
    ownerSelfPromoDismissed,
    sessionUserId,
    viewerIsListedAsProfessional,
  ]);

  useEffect(() => {
    if (!viewerIsListedAsProfessional || !establishmentId || !sessionUserId) {
      return;
    }
    void (async () => {
      await clearOwnerTeamPromoDismissed(establishmentId, sessionUserId);
      setOwnerSelfPromoDismissed(false);
    })();
  }, [establishmentId, sessionUserId, viewerIsListedAsProfessional]);

  const executeIncludeOwnerAsStaff = useCallback(async () => {
    if (
      !sessionUserId ||
      !ownerHasValidCpf ||
      includeOwnerAsStaffMutation.isPending
    ) {
      return;
    }
    try {
      const res = await includeOwnerAsStaffMutation.mutateAsync();
      // Garantir GET atualizado após convite real; `invalidateQueries` pode chegar tarde.
      const { data: freshEst } = await refetch();
      setIncludeSelfDialogOpen(false);
      if ("inviteSkipped" in res && res.inviteSkipped) {
        await writeOwnerTeamPromoDismissed(establishmentId, sessionUserId);
        setOwnerSelfPromoDismissed(true);
        setTeamFeedback({ title: "Tudo certo", message: res.message });
      } else {
        const listed =
          freshEst?.professionals.some((p) => p.id === sessionUserId) ?? false;
        if (!listed) {
          await writeOwnerTeamPromoDismissed(establishmentId, sessionUserId);
          setOwnerSelfPromoDismissed(true);
        }
        setTeamFeedback({
          title: "Você na equipe",
          message:
            "Agora você aparece como prestador neste local. Associe-se aos serviços em Serviços, se ainda não estiver.",
        });
      }
    } catch (e) {
      setIncludeSelfDialogOpen(false);
      setTeamFeedback({
        title: "Incluir como prestador",
        message: e instanceof Error ? e.message : "Não foi possível concluir.",
      });
    }
  }, [
    establishmentId,
    includeOwnerAsStaffMutation,
    ownerHasValidCpf,
    refetch,
    sessionUserId,
  ]);

  const onIncludeOwnerAsStaffPress = useCallback(() => {
    if (!ownerHasValidCpf) {
      return;
    }
    setIncludeSelfDialogOpen(true);
  }, [ownerHasValidCpf]);

  return {
    canManage,
    confirmRemoveMember,
    confirmRevokeInvite,
    deleteInvitePending: deleteInviteMutation.isPending,
    executeIncludeOwnerAsStaff,
    includeOwnerPending: includeOwnerAsStaffMutation.isPending,
    includeSelfDialogOpen,
    onIncludeOwnerAsStaffPress,
    onRemoveMember,
    openPendingInvitesSheet,
    ownerHasValidCpf,
    pendingModalOpen,
    removeStaffPending: removeStaffMutation.isPending,
    removeTarget,
    revokeInviteId,
    setIncludeSelfDialogOpen,
    setPendingModalOpen,
    setRemoveTarget,
    setRevokeInviteId,
    setTeamFeedback,
    showOwnerSelfServeCard,
    teamFeedback,
  };
}
