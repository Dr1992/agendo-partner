/**
 * Nomes de rotas do partner app.
 * Os valores de string são propositalmente iguais aos do consumer app para que as
 * telas copiadas funcionem sem alteração nas chamadas de navigation.navigate().
 */

export const PartnerMainTab = {
  Agenda: "Agenda",
  Disponibilidade: "Disponibilidade",
  Estabelecimentos: "Estabelecimentos",
  Perfil: "Perfil",
} as const;

export const DisponibilidadeStack = {
  DisponibilidadeList: "DisponibilidadeList",
  StaffAgendaDetail: "StaffAgendaDetail",
} as const;

/** @deprecated Usar PartnerMainTab. Mantido para compatibilidade com telas copiadas. */
export const MainTab = {
  Appointments: "Agenda",
  Explore: "Estabelecimentos",
  Profile: "Perfil",
} as const;

export const AppointmentsStack = {
  AppointmentDetail: "AppointmentDetail",
  AppointmentsList: "AppointmentsList",
  StaffAgendaList: "StaffAgendaList",
  StaffAgendaCalendar: "StaffAgendaCalendar",
  StaffAgendaDetail: "StaffAgendaDetail",
  StaffNewBookingType: "StaffNewBookingType",
  StaffPersonalCommitment: "StaffPersonalCommitment",
  StaffBookingServiceSelect: "StaffBookingServiceSelect",
  StaffBookingSchedule: "StaffBookingSchedule",
  StaffBookingConfirm: "StaffBookingConfirm",
} as const;

export const ProfileStack = {
  CompleteProfile: "CompleteProfile",
  EditProfile: "EditProfile",
  EstablishmentCollaborators: "EstablishmentCollaborators",
  EstablishmentEdit: "EstablishmentEdit",
  EstablishmentHub: "EstablishmentHub",
  EstablishmentRegister: "EstablishmentRegister",
  EstablishmentServiceForm: "EstablishmentServiceForm",
  EstablishmentServices: "EstablishmentServices",
  InviteStaff: "InviteStaff",
  InviteStaffNextSteps: "InviteStaffNextSteps",
  PendingInviteLinkServices: "PendingInviteLinkServices",
  PartnerHome: "PartnerHome",
  PartnerPlaceholder: "PartnerPlaceholder",
  ProfileMain: "ProfileMain",
  StaffAgendaCalendar: "StaffAgendaCalendar",
  StaffAgendaDetail: "StaffAgendaDetail",
  StaffAgendaList: "StaffAgendaList",
  StaffNewBookingType: "StaffNewBookingType",
  StaffPersonalCommitment: "StaffPersonalCommitment",
  StaffBookingServiceSelect: "StaffBookingServiceSelect",
  StaffBookingSchedule: "StaffBookingSchedule",
  StaffBookingConfirm: "StaffBookingConfirm",
} as const;
