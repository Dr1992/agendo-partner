import type { NavigationProp, ParamListBase } from "@react-navigation/native";

import type { StaffAgendaReturnParams } from "./exploreNavigation.types";
import { AppointmentsStack } from "./routeIds";

export type BookingFlowOrigin = "appointments";

export function getBookingFlowOrigin(_params: {
  bookingFlowOrigin?: BookingFlowOrigin;
}): BookingFlowOrigin {
  return "appointments";
}

export type StaffBookingSchedulePayload = {
  bookingFlowOrigin?: BookingFlowOrigin;
  defaultPerformerUserId?: string;
  establishmentId: string;
  returnToStaffAgenda?: StaffAgendaReturnParams;
  serviceId: string;
  staffAssistedBooking?: boolean;
};

export type StaffBookingConfirmPayload = StaffBookingSchedulePayload & {
  professionalId: string;
  slotIso: string;
};

/**
 * No partner app o fluxo de marcação está sempre no stack Agenda
 * (AppointmentsStack no contexto do navigator).
 */
export function getStaffCalendarBookingFlowOrigin(
  _navigation: NavigationProp<ParamListBase>,
): "appointments" {
  return "appointments";
}

export function navigateFromServiceSelectToSchedule(
  navigation: NavigationProp<ParamListBase>,
  payload: StaffBookingSchedulePayload,
): void {
  navigation.navigate(AppointmentsStack.StaffBookingSchedule, {
    ...payload,
    bookingFlowOrigin: "appointments",
  });
}

export function navigateFromScheduleToConfirm(
  navigation: NavigationProp<ParamListBase>,
  payload: StaffBookingConfirmPayload,
): void {
  navigation.navigate(AppointmentsStack.StaffBookingConfirm, {
    ...payload,
    bookingFlowOrigin: "appointments",
  });
}
