import type { StaffEstablishmentBookingRow } from "../../../api/public/partner";

export function formatBookingStatusLabel(
  status: StaffEstablishmentBookingRow["status"],
): string {
  switch (status) {
    case "CANCELLED":
      return "Cancelado";
    case "COMPLETED":
      return "Concluído";
    case "CONFIRMED":
      return "Confirmado";
    case "PENDING":
      return "Pendente";
    default:
      return status;
  }
}

export function formatBookingRange(startsAt: string, endsAt: string): string {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const timeFormat = { hour: "2-digit" as const, minute: "2-digit" as const };
  return `${startDate.toLocaleTimeString("pt-BR", timeFormat)} – ${endDate.toLocaleTimeString("pt-BR", timeFormat)}`;
}
