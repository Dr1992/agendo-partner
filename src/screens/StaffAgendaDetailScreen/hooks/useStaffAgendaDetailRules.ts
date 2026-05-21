import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useEffect, useState } from "react";

import type { PartnerAvailabilityRulesResponse } from "../../../api/public/partner";
import { putPartnerAvailability } from "../../../api/public/partner";
import {
  createDefaultOpeningSchedule,
  isOpeningScheduleValid,
  validateStaffWithinEstablishment,
  type DaySlot,
} from "../../../utils/openingHours";

export function useStaffAgendaDetailRules(
  establishmentId: string,
  professionalId: string,
  availabilityKey: readonly unknown[],
  establishmentSlots: DaySlot[] | undefined,
  availabilityData: PartnerAvailabilityRulesResponse | undefined,
) {
  const queryClient = useQueryClient();

  const [schedule, setSchedule] = useState<DaySlot[]>(() =>
    createDefaultOpeningSchedule(),
  );
  const [agendaDialog, setAgendaDialog] = useState<{
    message: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (availabilityData?.rules?.slots?.length === 7) {
      setSchedule(availabilityData.rules.slots);
    }
  }, [availabilityData]);

  const scheduleOk = isOpeningScheduleValid(schedule);

  const saveMutation = useMutation({
    mutationFn: () =>
      putPartnerAvailability(establishmentId, professionalId, schedule),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...availabilityKey] });
      setAgendaDialog({
        title: "Salvo",
        message: "Sua disponibilidade neste local foi atualizada.",
      });
    },
  });

  const dismissAgendaDialog = useCallback(() => {
    setAgendaDialog(null);
  }, []);

  const onSave = useCallback(() => {
    if (!scheduleOk) {
      setAgendaDialog({
        title: "Horário incompleto",
        message:
          "Marque pelo menos um dia e defina abertura e fechamento em cada dia ativo.",
      });
      return;
    }
    const foraDoHorario = validateStaffWithinEstablishment(
      schedule,
      establishmentSlots,
    );
    if (foraDoHorario) {
      setAgendaDialog({ title: "Horário", message: foraDoHorario });
      return;
    }
    void saveMutation.mutateAsync().catch((e) => {
      setAgendaDialog({
        title: "Erro",
        message: e instanceof Error ? e.message : "Não foi possível salvar.",
      });
    });
  }, [establishmentSlots, schedule, scheduleOk, saveMutation]);

  return {
    agendaDialog,
    dismissAgendaDialog,
    onSave,
    saveMutation,
    schedule,
    scheduleOk,
    setSchedule,
  };
}
