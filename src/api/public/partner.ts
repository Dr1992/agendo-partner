import {
  apiAuthDelete,
  apiAuthGet,
  apiAuthPatch,
  apiAuthPost,
  apiAuthPut,
} from "../http";
import type { EstablishmentDetail } from "../../types/establishment";
import type { DaySlot } from "../../utils/openingHours";

export type PartnerListRow = {
  role: "owner" | "staff";
  detail: EstablishmentDetail;
};

export type PartnerEstablishmentsListResponse = {
  canRegisterEstablishment: boolean;
  data: PartnerListRow[];
};

export async function fetchPartnerEstablishments(): Promise<PartnerEstablishmentsListResponse> {
  return apiAuthGet<PartnerEstablishmentsListResponse>(
    "/partner/establishments",
  );
}

export type StaffAgendaEstablishmentRow = {
  addressShort: string;
  categoryLabel: string;
  cityName: string;
  id: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  name: string;
  rating: number;
  reviewCount: number;
  stateUf: string;
  thumbnailUrl?: string;
  viewerMemberRole: "MANAGER" | "OWNER" | "STAFF";
};

export type StaffAgendaEstablishmentsResponse = {
  data: StaffAgendaEstablishmentRow[];
};

export async function fetchStaffAgendaEstablishments(): Promise<StaffAgendaEstablishmentsResponse> {
  return apiAuthGet<StaffAgendaEstablishmentsResponse>(
    "/partner/establishments/agenda-establishments",
  );
}

export type StaffEstablishmentBookingRow = {
  /** `null` quando o cliente é "ghost" (sem conta vinculada). */
  customerDisplayName: string | null;
  customerUserId: string | null;
  /** Email digitado pelo colaborador quando não houve match com conta. */
  ghostCustomerEmail: string | null;
  /** `null` quando o próprio cliente criou (ou registro legado sem criador). */
  createdByDisplayName: string | null;
  createdByUserId: string | null;
  endsAt: string;
  id: string;
  serviceName: string;
  startsAt: string;
  status: "CANCELLED" | "COMPLETED" | "CONFIRMED" | "PENDING";
};

export type StaffEstablishmentBookingsResponse = {
  data: StaffEstablishmentBookingRow[];
};

export async function fetchStaffEstablishmentBookings(
  establishmentId: string,
  fromIso: string,
  toIso: string,
): Promise<StaffEstablishmentBookingsResponse> {
  const queryString = new URLSearchParams({
    from: fromIso,
    to: toIso,
  }).toString();
  return apiAuthGet<StaffEstablishmentBookingsResponse>(
    `/partner/establishments/${establishmentId}/staff-bookings?${queryString}`,
  );
}

export type CancelPartnerAppointmentResponse = {
  endsAt: string;
  id: string;
  startsAt: string;
  status: string;
};

export async function cancelPartnerAppointment(
  establishmentId: string,
  appointmentId: string,
): Promise<CancelPartnerAppointmentResponse> {
  return apiAuthPatch<CancelPartnerAppointmentResponse>(
    `/partner/establishments/${establishmentId}/appointments/${appointmentId}`,
    {},
  );
}

export type CreateStaffAssistedAppointmentBody = {
  /** Opcional: se vazio ou sem match no sistema, o agendamento fica "ghost". */
  customerEmail?: string;
  professionalUserId: string;
  serviceId: string;
  startsAt: string;
  notes?: string;
};

export type CreateStaffAssistedAppointmentResponse = {
  endsAt: string;
  id: string;
  startsAt: string;
  status: string;
};

export async function createStaffAssistedAppointment(
  establishmentId: string,
  body: CreateStaffAssistedAppointmentBody,
): Promise<CreateStaffAssistedAppointmentResponse> {
  return apiAuthPost<CreateStaffAssistedAppointmentResponse>(
    `/partner/establishments/${establishmentId}/staff-appointments`,
    body,
  );
}

export async function updatePartnerStaffRole(
  establishmentId: string,
  userId: string,
  role: "STAFF" | "MANAGER",
): Promise<{ ok: true }> {
  return apiAuthPatch<{ ok: true }>(
    `/partner/establishments/${establishmentId}/staff/${userId}`,
    { role },
  );
}

export type PartnerAvailabilityRulesResponse = {
  rules: { slots: DaySlot[] };
  rulesVersion: number;
};

function partnerAvailabilityPath(
  establishmentId: string,
  professionalId: string,
): string {
  return `/partner/establishments/${establishmentId}/professionals/${professionalId}/availability`;
}

export async function fetchPartnerAvailability(
  establishmentId: string,
  professionalId: string,
): Promise<PartnerAvailabilityRulesResponse> {
  return apiAuthGet<PartnerAvailabilityRulesResponse>(
    partnerAvailabilityPath(establishmentId, professionalId),
  );
}

export async function putPartnerAvailability(
  establishmentId: string,
  professionalId: string,
  slots: DaySlot[],
): Promise<PartnerAvailabilityRulesResponse> {
  return apiAuthPut<PartnerAvailabilityRulesResponse>(
    partnerAvailabilityPath(establishmentId, professionalId),
    { rules: { slots } },
  );
}

export async function fetchPartnerEstablishment(
  establishmentId: string,
): Promise<EstablishmentDetail> {
  return apiAuthGet<EstablishmentDetail>(
    `/partner/establishments/${establishmentId}`,
  );
}

export type RegisterPartnerEstablishmentInput = {
  addressFull: string;
  categoryId: string;
  categoryLabel: string;
  cityName: string;
  cnpj?: string;
  description?: string;
  name: string;
  openingHoursSummary: string;
  /** Grava `{ slots }` no backend — valida disponibilidade do staff em relação ao local. */
  openingSchedule?: DaySlot[];
  ownerUserId: string;
  /** Após `POST /uploads/media` — entre 1 e 5 fotos. */
  photoStorageKeys: string[];
  phone?: string;
  postalCode?: string;
  stateUf: string;
  whatsapp: string;
};

export async function createPartnerEstablishment(
  input: RegisterPartnerEstablishmentInput,
): Promise<EstablishmentDetail> {
  return apiAuthPost<EstablishmentDetail>("/partner/establishments", {
    name: input.name,
    description: input.description,
    stateUf: input.stateUf,
    cityName: input.cityName,
    addressFull: input.addressFull,
    categoryIds: [input.categoryId],
    photoStorageKeys: input.photoStorageKeys,
    whatsapp: input.whatsapp.replace(/\D/g, ""),
    ...(input.openingSchedule && input.openingSchedule.length === 7
      ? { openingSchedule: { slots: input.openingSchedule } }
      : {}),
    ...(input.postalCode
      ? { postalCode: input.postalCode.replace(/\D/g, "") }
      : {}),
  });
}

export type CreateStaffInviteResponse =
  | {
      id: string;
      establishmentId: string;
      inviteeAccountExists: boolean;
      autoAccepted: boolean;
      inviteSkipped?: false;
    }
  | { inviteSkipped: true; message: string };

export async function createStaffInvite(
  establishmentId: string,
  cpfDigits: string,
  role: "STAFF" | "MANAGER" = "STAFF",
): Promise<CreateStaffInviteResponse> {
  const cpf = cpfDigits.replace(/\D/g, "");
  return apiAuthPost<CreateStaffInviteResponse>(
    `/partner/establishments/${establishmentId}/invites`,
    { cpf, role },
  );
}

export async function patchInvitePlannedServices(
  establishmentId: string,
  inviteId: string,
  serviceIds: string[],
): Promise<{ inviteId: string; serviceIds: string[] }> {
  return apiAuthPatch<{ inviteId: string; serviceIds: string[] }>(
    `/partner/establishments/${establishmentId}/invites/${inviteId}/planned-services`,
    { serviceIds },
  );
}

export async function deletePartnerInvite(
  inviteId: string,
): Promise<{ inviteId: string; deleted: true }> {
  return apiAuthDelete<{ inviteId: string; deleted: true }>(
    `/partner/invites/${inviteId}`,
  );
}

export type UpdatePartnerEstablishmentInput = {
  addressFull?: string;
  categoryIds?: string[];
  cityName?: string;
  description?: string;
  isActive?: boolean;
  name?: string;
  openingSchedule?: DaySlot[];
  /** Substitui a galeria completa (1–5 chaves de upload). */
  photoStorageKeys?: string[];
  postalCode?: string;
  stateUf?: string;
  whatsapp?: string;
};

export async function updatePartnerEstablishment(
  establishmentId: string,
  body: UpdatePartnerEstablishmentInput,
): Promise<EstablishmentDetail> {
  const { openingSchedule, photoStorageKeys, ...rest } = body;
  return apiAuthPatch<EstablishmentDetail>(
    `/partner/establishments/${establishmentId}`,
    {
      ...rest,
      ...(openingSchedule !== undefined && openingSchedule.length === 7
        ? { openingSchedule: { slots: openingSchedule } }
        : {}),
      ...(photoStorageKeys !== undefined ? { photoStorageKeys } : {}),
    },
  );
}

export async function removeEstablishmentStaff(
  establishmentId: string,
  userId: string,
): Promise<{ ok: true }> {
  return apiAuthDelete<{ ok: true }>(
    `/partner/establishments/${establishmentId}/staff/${userId}`,
  );
}

export type PartnerServiceRow = {
  description: string | null;
  durationMinutes: number;
  id: string;
  isActive: boolean;
  name: string;
  performerUserIds: string[];
  priceCents: number | null;
};

export async function fetchPartnerServices(
  establishmentId: string,
): Promise<{ data: PartnerServiceRow[] }> {
  return apiAuthGet<{ data: PartnerServiceRow[] }>(
    `/partner/establishments/${establishmentId}/services`,
  );
}

export type CreatePartnerServiceInput = {
  description?: string;
  durationMinutes: number;
  name: string;
  performerUserIds?: string[];
  priceCents?: number | null;
};

export async function createPartnerService(
  establishmentId: string,
  body: CreatePartnerServiceInput,
): Promise<PartnerServiceRow> {
  return apiAuthPost<PartnerServiceRow>(
    `/partner/establishments/${establishmentId}/services`,
    body,
  );
}

export type UpdatePartnerServiceInput = {
  description?: string | null;
  durationMinutes?: number;
  isActive?: boolean;
  name?: string;
  performerUserIds?: string[];
  priceCents?: number | null;
};

export async function updatePartnerService(
  establishmentId: string,
  serviceId: string,
  body: UpdatePartnerServiceInput,
): Promise<PartnerServiceRow> {
  return apiAuthPatch<PartnerServiceRow>(
    `/partner/establishments/${establishmentId}/services/${serviceId}`,
    body,
  );
}

export async function deletePartnerService(
  establishmentId: string,
  serviceId: string,
): Promise<{ ok: true }> {
  return apiAuthDelete<{ ok: true }>(
    `/partner/establishments/${establishmentId}/services/${serviceId}`,
  );
}
