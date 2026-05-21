import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/** Volta ao calendário do colaborador após registo assistido. */
export type StaffAgendaReturnParams = {
  establishmentId: string;
  establishmentName: string;
};

export type ExploreStackParamList = {
  RegionSelect: { canGoBack?: boolean } | undefined;
  CitySelect: { canGoBack?: boolean; stateUf: string };
  CategoryPicker: undefined;
  EstablishmentList: undefined;
  EstablishmentDetail: {
    establishmentId: string;
    /** Distância já exibida no card da lista (km). */
    distanceKm?: number;
  };
  ServiceSelect: {
    establishmentId: string;
    staffAssistedBooking?: boolean;
    defaultPerformerUserId?: string;
    returnToStaffAgenda?: StaffAgendaReturnParams;
    /** Explorar (omissão), ou fluxo empilhado noutro tab com rotas dedicadas. */
    bookingFlowOrigin?: "explore" | "appointments" | "profile";
  };
  BookingSchedule: {
    establishmentId: string;
    serviceId: string;
    staffAssistedBooking?: boolean;
    defaultPerformerUserId?: string;
    returnToStaffAgenda?: StaffAgendaReturnParams;
    bookingFlowOrigin?: "explore" | "appointments" | "profile";
  };
  BookingConfirm: {
    establishmentId: string;
    serviceId: string;
    professionalId: string;
    slotIso: string;
    staffAssistedBooking?: boolean;
    returnToStaffAgenda?: StaffAgendaReturnParams;
    bookingFlowOrigin?: "explore" | "appointments" | "profile";
  };
};

export type ExploreScreenProps<T extends keyof ExploreStackParamList> =
  NativeStackScreenProps<ExploreStackParamList, T>;
