export type AppointmentStatus =
  | "pending_confirmation"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type Appointment = {
  id: string;
  establishmentId: string;
  establishmentName: string;
  /** Endereço completo no momento da reserva (rotas no mapa). */
  addressFull?: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  /** ISO 8601 */
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  priceFrom: number;
  currency: string;
  /** ISO 8601 */
  createdAt: string;
  confirmationMode: "auto" | "manual";
};
