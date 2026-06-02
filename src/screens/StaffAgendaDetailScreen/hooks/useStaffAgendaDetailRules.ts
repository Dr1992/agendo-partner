import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("staff");

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
        title: t("detail.savedTitle"),
        message: t("detail.savedMessage"),
      });
    },
  });

  const dismissAgendaDialog = useCallback(() => {
    setAgendaDialog(null);
  }, []);

  const onSave = useCallback(() => {
    if (!scheduleOk) {
      setAgendaDialog({
        title: t("detail.scheduleIncompleteTitle"),
        message: t("detail.scheduleIncompleteMessage"),
      });
      return;
    }
    const foraDoHorario = validateStaffWithinEstablishment(
      schedule,
      establishmentSlots,
    );
    if (foraDoHorario) {
      setAgendaDialog({
        title: t("detail.scheduleRangeTitle"),
        message: foraDoHorario,
      });
      return;
    }
    void saveMutation.mutateAsync().catch((e) => {
      setAgendaDialog({
        title: t("detail.saveErrorTitle"),
        message: e instanceof Error ? e.message : t("detail.saveErrorDefault"),
      });
    });
  }, [establishmentSlots, schedule, scheduleOk, saveMutation, t]);

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
