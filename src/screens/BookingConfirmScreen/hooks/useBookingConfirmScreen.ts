import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("booking");
  const {
    establishmentId,
    professionalId,
    returnToStaffAgenda,
    serviceId,
    slotIso,
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("confirm.navTitle") });
  }, [navigation, t]);

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
      return { id: "any", name: t("confirm.anyProfessional") };
    }
    return est?.professionals.find((prof) => prof.id === professionalId);
  }, [est?.professionals, professionalId, t]);

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
        label: t("confirm.rowEstablishment"),
        value: est.name,
      },
      {
        icon: SERVICE_IONICON,
        label: t("confirm.rowService"),
        value: service.name,
      },
      {
        icon: "person-outline",
        label: t("confirm.rowProfessional"),
        value: professional.name,
      },
      {
        icon: "calendar-outline",
        label: t("confirm.rowTime"),
        value: slotLabel,
      },
      {
        icon: "time-outline",
        label: t("confirm.rowDuration"),
        value: durationLabel,
      },
      {
        emphasis: true,
        icon: "cash-outline",
        label: t("confirm.rowServicePrice"),
        value: priceLabel,
      },
      {
        icon: "location-outline",
        label: t("confirm.rowAddress"),
        value: est.addressFull,
      },
    ];
  }, [durationLabel, est, priceLabel, professional, service, slotLabel, t]);

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
        message: t("confirm.errorChooseProfessional"),
      });
      return;
    }
    const trimmed = customerEmail.trim();
    if (!isValidCustomerEmail(trimmed)) {
      setDialog({
        kind: "booking_error",
        message: t("confirm.errorInvalidEmail"),
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
          e instanceof Error ? e.message : t("confirm.errorBookingFailed"),
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
    t,
  ]);

  const onConfirm = useCallback(() => {
    if (!est || !service || !professional) {
      return;
    }
    if (!isValidCustomerEmail(customerEmail)) {
      setDialog({
        kind: "booking_error",
        message: t("confirm.errorMissingEmail"),
      });
      return;
    }
    setDialog({ kind: "confirm" });
  }, [customerEmail, est, professional, service, t]);

  const dialogContent = useMemo(() => {
    switch (dialog.kind) {
      case "none":
        return null;
      case "booking_error":
        return {
          buttons: [
            {
              label: t("confirm.dialogOk"),
              onPress: () => setDialog({ kind: "none" }),
              variant: "primary" as const,
            },
          ],
          message: dialog.message,
          title: t("confirm.dialogErrorTitle"),
        };
      case "confirm":
        return {
          buttons: [
            {
              label: t("confirm.dialogCancel"),
              onPress: () => setDialog({ kind: "none" }),
              variant: "secondary" as const,
            },
            {
              label: bookingBusy
                ? t("confirm.dialogRegistering")
                : t("confirm.dialogConfirmRegister"),
              onPress: () => {
                void performBooking();
              },
              variant: "primary" as const,
            },
          ],
          message: t("confirm.dialogConfirmMessage"),
          title: t("confirm.dialogConfirmTitle"),
        };
      case "success":
        return {
          buttons: [
            {
              label: t("confirm.dialogSuccessViewCalendar"),
              onPress: goToStaffAgendaAfterBooking,
              variant: "primary" as const,
            },
          ],
          message: t("confirm.dialogSuccessMessage"),
          title: t("confirm.dialogSuccessTitle"),
        };
    }
  }, [bookingBusy, dialog, goToStaffAgendaAfterBooking, performBooking, t]);

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
