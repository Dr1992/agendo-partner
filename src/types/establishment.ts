import type { Professional, StaffRole } from "./professional";
import type { ServiceOffering } from "./service";
import type { DaySlot } from "../utils/openingHours";

export type ConfirmationMode = "auto" | "manual";

/** Convite pendente (CPF ainda sem vínculo staff) — vindo do GET parceiro do estabelecimento. */
export type PartnerPendingInvite = {
  id: string;
  cpf: string | null;
  email: string | null;
  intendedRole: StaffRole;
  createdAt: string;
  plannedPerformerServiceIds: readonly string[];
};

/** Card na lista Explorar */
export type Establishment = {
  id: string;
  name: string;
  /** Rótulo principal para o card (categoria da busca ou principal do local) */
  categoryLabel: string;
  categoryIds: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  priceFrom: number;
  currency: string;
  nextSlotLabel: string;
  /** Logradouro + número no card; se a API não tiver rua, cidade · UF. */
  addressShort: string;
  /** Primeira foto do cadastro (URL pública), quando existir. */
  thumbnailUrl?: string;
  /** Quando ausentes ou (0,0), a distância não deve ser exibida. */
  latitude?: number;
  longitude?: number;
};

export type EstablishmentDetail = Establishment & {
  /** Parceiro: local ativo na busca pública */
  isActive: boolean;
  /** Dono (área parceiro) — quando exposto pela API */
  ownerUserId?: string;
  /** Parceiro: dono da conta (não entra em `professionals` como prestador) */
  ownerMember?: { id: string; name: string };
  /** UF (ex.: PR, SP) — filtro quando o usuário informa região manualmente */
  stateUf: string;
  /** Cidade para filtro e exibição (ex.: Curitiba) */
  cityName: string;
  /** Coordenadas do endereço — distância com GPS quando disponível */
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  whatsapp?: string;
  addressFull: string;
  /** Endereço (rua/número) — API parceiro */
  partnerStreetLine?: string;
  postalCode?: string;
  /** Papel do usuário autenticado neste local (GET parceiro) */
  viewerMemberRole?: StaffRole;
  confirmationMode: ConfirmationMode;
  openingHoursSummary: string;
  /** Horário de funcionamento do local — quando existe, a API valida a disponibilidade do staff. */
  openingSchedule?: DaySlot[];
  /** URLs públicas das fotos do local (parceiro / catálogo). */
  galleryPhotoUrls?: readonly string[];
  /** Metadados das fotos para edição (id + storageKey + URL). */
  galleryPhotoItems?: readonly {
    id: string;
    storageKey: string;
    url: string;
  }[];
  services: ServiceOffering[];
  professionals: Professional[];
  /** Convites `PENDING` não expirados — gestão de colaboradores. */
  pendingInvites?: readonly PartnerPendingInvite[];
};
