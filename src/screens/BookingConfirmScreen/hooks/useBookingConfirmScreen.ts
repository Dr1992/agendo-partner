import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import type { DetailFactRow } from "../../../components/DetailFactsCard/DetailFactsCard";
import { createStaffAssistedAppointment } from "../../../api/public/partner";
import { SERVICE_IONICON } from "../../../constants/serviceIonicon";
import { timeSlotsQueryKey } from "../../../hooks/api/useFetchTimeSlots";
import {
  resetAgendaStackToRoot,
  resetAgendaStackToStaffAgenda,
} from "../../../navigation/postBookingNavigation";
import { formatMoneyPtBr } from "../../../utils/formatMoneyPtBr";
import { formatDurationMinutesLabel } from "../../../utils/formatDurationLabel";
import { formatSlotDateTimePt } from "../../../utils/formatSlotDateTimePt";
import { useBookingConfirmData } from "../fetch/useBookingConfirmData";
import type { BookingConfirmScreenProps, BookingDialogState } from "../types";
import { isValidCustomerEmail } from "../utils/bookingConfirmHelpers";

export function useBookingConfirmScreen({
  navigation,
  route,
}: BookingConfirmScreenProps) {
  const {
    establishmentId,
    professionalId,
    returnToStaffAgenda,
    serviceId,
    slotIso,
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Registar atendimento" });
  }, [navigation]);

  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<BookingDialogState>({ kind: "none" });
  const [bookingBusy, setBookingBusy] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  const {
    data: est,
    error,
    isError,
    isPending,
  } = useBookingConfirmData(establishmentId);

  const service = useMemo(
    () => est?.services.find((serviceItem) => serviceItem.id === serviceId),
    [est?.services, serviceId],
  );

  const professional = useMemo(() => {
    if (professionalId === "any") {
      return { id: "any", name: "Qualquer disponível na equipe" };
    }
    return est?.professionals.find((prof) => prof.id === professionalId);
  }, [est?.professionals, professionalId]);

  const slotLabel = useMemo(() => formatSlotDateTimePt(slotIso), [slotIso]);

  const durationLabel = useMemo(
    () => (service ? formatDurationMinutesLabel(service.durationMinutes) : "—"),
    [service],
  );

  const priceLabel = useMemo(
    () =>
      service ? formatMoneyPtBr(service.priceFrom, service.currency) : "—",
    [service],
  );

  const summaryRows = useMemo((): DetailFactRow[] => {
    if (!est || !service || !professional) {
      return [];
    }
    return [
      {
        icon: "storefront-outline",
        label: "Estabelecimento",
        value: est.name,
      },
      {
        icon: SERVICE_IONICON,
        label: "Serviço",
        value: service.name,
      },
      {
        icon: "person-outline",
        label: "Profissional",
        value: professional.name,
      },
      {
        icon: "calendar-outline",
        label: "Horário",
        value: slotLabel,
      },
      {
        icon: "time-outline",
        label: "Duração",
        value: durationLabel,
      },
      {
        emphasis: true,
        icon: "cash-outline",
        label: "Valor do serviço",
        value: priceLabel,
      },
      {
        icon: "location-outline",
        label: "Endereço",
        value: est.addressFull,
      },
    ];
  }, [durationLabel, est, priceLabel, professional, service, slotLabel]);

  const goToStaffAgendaAfterBooking = useCallback(() => {
    setDialog({ kind: "none" });
    const nav = navigation as NavigationProp<ParamListBase>;
    if (!returnToStaffAgenda) {
      resetAgendaStackToRoot(nav);
      return;
    }
    resetAgendaStackToStaffAgenda(nav, returnToStaffAgenda);
  }, [navigation, returnToStaffAgenda]);

  const performBooking = useCallback(async () => {
    if (bookingBusy || !est || !service || !professional) {
      return;
    }
    if (professional.id === "any") {
      setDialog({
        kind: "booking_error",
        message: "Escolha um profissional específico antes de confirmar.",
      });
      return;
    }
    const trimmed = customerEmail.trim();
    if (!isValidCustomerEmail(trimmed)) {
      setDialog({
        kind: "booking_error",
        message:
          "Indique um e-mail válido — tem de corresponder à conta do cliente na app.",
      });
      return;
    }
    setBookingBusy(true);
    try {
      await createStaffAssistedAppointment(est.id, {
        customerEmail: trimmed,
        professionalUserId: professional.id,
        serviceId: service.id,
        startsAt: slotIso,
      });
      await queryClient.invalidateQueries({
        queryKey: ["partner", "staff-bookings", est.id],
      });
      await queryClient.invalidateQueries({ queryKey: ["timeSlots"] });
      await queryClient.invalidateQueries({
        queryKey: timeSlotsQueryKey({
          durationMinutes: service.durationMinutes,
          establishmentId: est.id,
          professionalId: professional.id,
          serviceId: service.id,
        }),
      });
      setDialog({ kind: "success" });
    } catch (e) {
      setDialog({
        kind: "booking_error",
        message:
          e instanceof Error
            ? e.message
            : "Não foi possível concluir o registo. Tente de novo.",
      });
    } finally {
      setBookingBusy(false);
    }
  }, [
    bookingBusy,
    customerEmail,
    est,
    professional,
    queryClient,
    service,
    slotIso,
  ]);

  const onConfirm = useCallback(() => {
    if (!est || !service || !professional) {
      return;
    }
    if (!isValidCustomerEmail(customerEmail)) {
      setDialog({
        kind: "booking_error",
        message:
          "Indique o e-mail da conta do cliente na app (o mesmo que usa em Perfil).",
      });
      return;
    }
    setDialog({ kind: "confirm" });
  }, [customerEmail, est, professional, service]);

  const dialogContent = useMemo(() => {
    switch (dialog.kind) {
      case "none":
        return null;
      case "booking_error":
        return {
          buttons: [
            {
              label: "OK",
              onPress: () => setDialog({ kind: "none" }),
              variant: "primary" as const,
            },
          ],
          message: dialog.message,
          title: "Atendimento",
        };
      case "confirm":
        return {
          buttons: [
            {
              label: "Cancelar",
              onPress: () => setDialog({ kind: "none" }),
              variant: "secondary" as const,
            },
            {
              label: bookingBusy ? "A registar…" : "Sim, registar",
              onPress: () => {
                void performBooking();
              },
              variant: "primary" as const,
            },
          ],
          message:
            "O horário fica confirmado para a conta com o e-mail indicado e aparece na sua agenda como profissional.",
          title: "Registar atendimento?",
        };
      case "success":
        return {
          buttons: [
            {
              label: "Ver calendário",
              onPress: goToStaffAgendaAfterBooking,
              variant: "primary" as const,
            },
          ],
          message:
            "O cliente verá o horário na área Agendamentos. No calendário do local aparece logo o novo atendimento.",
          title: "Atendimento registado",
        };
    }
  }, [bookingBusy, dialog, goToStaffAgendaAfterBooking, performBooking]);

  const onDialogRequestClose = useCallback(() => {
    setDialog({ kind: "none" });
  }, []);

  return {
    bookingBusy,
    customerEmail,
    dialog,
    dialogContent,
    durationLabel,
    error,
    est,
    isError,
    isPending,
    onConfirm,
    onDialogRequestClose,
    priceLabel,
    professional,
    service,
    setCustomerEmail,
    summaryRows,
  };
}
