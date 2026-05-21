import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { StaffAgendaReturnParams } from "./exploreNavigation.types";

/** Fluxo “agendar para cliente” empilhado no stack Agendamentos (mantém o tab). */
export type StaffNewBookingTypeParams = {
  bookingFlowOrigin: "appointments";
  defaultPerformerUserId: string;
  establishmentId: string;
  establishmentName: string;
  returnToStaffAgenda: StaffAgendaReturnParams;
};

export type StaffPersonalCommitmentParams = {
  bookingFlowOrigin: "appointments";
  establishmentId: string;
  returnToStaffAgenda: StaffAgendaReturnParams;
};

export type StaffBookingServiceSelectParams = {
  bookingFlowOrigin: "appointments";
  defaultPerformerUserId?: string;
  establishmentId: string;
  returnToStaffAgenda?: StaffAgendaReturnParams;
  staffAssistedBooking?: boolean;
};

export type StaffBookingScheduleParams = StaffBookingServiceSelectParams & {
  serviceId: string;
};

export type StaffBookingConfirmParams = StaffBookingScheduleParams & {
  professionalId: string;
  slotIso: string;
};

export type AppointmentsStackParamList = {
  AppointmentsList: { openClientAgendaNonce?: number };
  AppointmentDetail: { appointmentId: string };
  StaffAgendaList: undefined;
  StaffAgendaCalendar: { establishmentId: string; establishmentName: string };
  StaffAgendaDetail: { establishmentId: string; establishmentName: string };
  StaffNewBookingType: StaffNewBookingTypeParams;
  StaffPersonalCommitment: StaffPersonalCommitmentParams;
  StaffBookingServiceSelect: StaffBookingServiceSelectParams;
  StaffBookingSchedule: StaffBookingScheduleParams;
  StaffBookingConfirm: StaffBookingConfirmParams;
};

export type AppointmentsScreenProps<
  T extends keyof AppointmentsStackParamList,
> = NativeStackScreenProps<AppointmentsStackParamList, T>;
