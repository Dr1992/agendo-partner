import type { NavigationProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";

import {
  createPartnerService,
  deletePartnerService,
  updatePartnerService,
} from "../../../api/public/partner";
import type { ProfileStackParamList } from "../../../navigation/profileNavigation.types";
import type { Professional } from "../../../types/professional";
import { parseBrazilMoneyInputToCents } from "../../../utils/brazilMoney";

type SaveServiceVars = {
  allPerformers: boolean;
  description: string;
  durationText: string;
  name: string;
  priceText: string;
  selectedPerformerIds: Set<string>;
};

type FormErrorState = {
  message: string;
  title: string;
} | null;

export function useEstablishmentServiceFormMutations({
  bookableProfessionals,
  establishmentId,
  navigation,
  serviceId,
  setBusy,
  setDeleteConfirmOpen,
  setFormErrorDialog,
}: {
  bookableProfessionals: Professional[];
  establishmentId: string;
  navigation: NavigationProp<ProfileStackParamList>;
  serviceId: string | undefined;
  setBusy: Dispatch<SetStateAction<boolean>>;
  setDeleteConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setFormErrorDialog: Dispatch<SetStateAction<FormErrorState>>;
}) {
  const queryClient = useQueryClient();

  const invalidatePartner = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["partner"] });
  }, [queryClient]);

  const saveMutation = useMutation({
    mutationFn: async (vars: SaveServiceVars) => {
      const durationMinutes = Number.parseInt(vars.durationText.trim(), 10);
      if (
        Number.isNaN(durationMinutes) ||
        durationMinutes < 1 ||
        durationMinutes > 24 * 60
      ) {
        throw new Error("Informe a duração só em minutos (entre 1 e 1440).");
      }
      const trimmedName = vars.name.trim();
      if (!trimmedName) {
        throw new Error("Informe o nome do serviço.");
      }
      const cents = parseBrazilMoneyInputToCents(vars.priceText);
      if (bookableProfessionals.length === 0) {
        throw new Error(
          "Cadastre pelo menos um colaborador no local antes de guardar o serviço.",
        );
      }
      let performerUserIds: string[] | undefined;
      if (vars.allPerformers) {
        performerUserIds = [];
      } else {
        const ids = [...vars.selectedPerformerIds];
        if (ids.length === 0) {
          throw new Error(
            "Selecione ao menos um colaborador ou marque “Todos realizam”.",
          );
        }
        performerUserIds = ids;
      }

      if (serviceId) {
        return updatePartnerService(establishmentId, serviceId, {
          name: trimmedName,
          description: vars.description.trim() || null,
          durationMinutes,
          priceCents: cents,
          performerUserIds,
        });
      }
      return createPartnerService(establishmentId, {
        name: trimmedName,
        description: vars.description.trim() || undefined,
        durationMinutes,
        priceCents: cents ?? undefined,
        performerUserIds,
      });
    },
    onSuccess: async () => {
      await invalidatePartner();
      navigation.goBack();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePartnerService(establishmentId, serviceId!),
    onSuccess: async () => {
      await invalidatePartner();
      navigation.goBack();
    },
  });

  const onSave = useCallback(
    (vars: SaveServiceVars) => {
      void (async () => {
        setBusy(true);
        try {
          await saveMutation.mutateAsync(vars);
        } catch (e) {
          setFormErrorDialog({
            title: "Erro",
            message:
              e instanceof Error ? e.message : "Não foi possível salvar.",
          });
        } finally {
          setBusy(false);
        }
      })();
    },
    [saveMutation, setBusy, setFormErrorDialog],
  );

  const onDelete = useCallback(() => {
    if (!serviceId) {
      return;
    }
    setDeleteConfirmOpen(true);
  }, [serviceId, setDeleteConfirmOpen]);

  const confirmDeactivateService = useCallback(() => {
    if (!serviceId || deleteMutation.isPending) {
      return;
    }
    void (async () => {
      setDeleteConfirmOpen(false);
      setBusy(true);
      try {
        await deleteMutation.mutateAsync();
      } catch (e) {
        setFormErrorDialog({
          title: "Erro",
          message:
            e instanceof Error ? e.message : "Não foi possível desativar.",
        });
      } finally {
        setBusy(false);
      }
    })();
  }, [
    deleteMutation,
    serviceId,
    setBusy,
    setDeleteConfirmOpen,
    setFormErrorDialog,
  ]);

  return {
    confirmDeactivateService,
    deleteMutation,
    onDelete,
    onSave,
  };
}
