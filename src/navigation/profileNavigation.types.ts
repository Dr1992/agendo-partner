import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type {
  StaffBookingConfirmParams,
  StaffBookingScheduleParams,
  StaffBookingServiceSelectParams,
  StaffNewBookingTypeParams,
  StaffPersonalCommitmentParams,
} from "./appointmentsNavigation.types";

export type ProfileStaffNewBookingTypeParams = Omit<
  StaffNewBookingTypeParams,
  "bookingFlowOrigin"
> & { bookingFlowOrigin: "profile" };

export type ProfileStaffPersonalCommitmentParams = Omit<
  StaffPersonalCommitmentParams,
  "bookingFlowOrigin"
> & { bookingFlowOrigin: "profile" };

/** Mesmos params que em Agendamentos, com origem Perfil. */
export type ProfileStaffBookingServiceSelectParams = Omit<
  StaffBookingServiceSelectParams,
  "bookingFlowOrigin"
> & {
  bookingFlowOrigin: "profile";
};

export type ProfileStaffBookingScheduleParams = Omit<
  StaffBookingScheduleParams,
  "bookingFlowOrigin"
> & {
  bookingFlowOrigin: "profile";
};

export type ProfileStaffBookingConfirmParams = Omit<
  StaffBookingConfirmParams,
  "bookingFlowOrigin"
> & {
  bookingFlowOrigin: "profile";
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  CompleteProfile: undefined;
  EditProfile: undefined;
  PartnerHome: undefined;
  EstablishmentRegister: undefined;
  EstablishmentHub: { establishmentId: string };
  EstablishmentEdit: { establishmentId: string };
  EstablishmentCollaborators: { establishmentId: string };
  EstablishmentServices: {
    establishmentId: string;
    establishmentName: string;
  };
  EstablishmentServiceForm: {
    establishmentId: string;
    establishmentName: string;
    serviceId?: string;
  };
  InviteStaff: { establishmentId: string; establishmentName: string };
  InviteStaffNextSteps: {
    establishmentId: string;
    establishmentName: string;
    inviteId: string;
    inviteeAccountExists: boolean;
    autoAccepted: boolean;
  };
  PendingInviteLinkServices: {
    establishmentId: string;
    establishmentName: string;
    inviteId: string;
    /** `true` quando o fluxo vem de Adicionar colaborador (pilha mais funda). */
    afterInviteFlow: boolean;
  };
  StaffAgendaList: undefined;
  StaffAgendaCalendar: { establishmentId: string; establishmentName: string };
  StaffAgendaDetail: { establishmentId: string; establishmentName: string };
  StaffNewBookingType: ProfileStaffNewBookingTypeParams;
  StaffPersonalCommitment: ProfileStaffPersonalCommitmentParams;
  StaffBookingServiceSelect: ProfileStaffBookingServiceSelectParams;
  StaffBookingSchedule: ProfileStaffBookingScheduleParams;
  StaffBookingConfirm: ProfileStaffBookingConfirmParams;
  PartnerPlaceholder: { subtitle?: string; title: string };
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;
