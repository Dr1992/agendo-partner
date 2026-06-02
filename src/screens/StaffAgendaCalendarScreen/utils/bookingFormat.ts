import type { TFunction } from "i18next";

import type { StaffEstablishmentBookingRow } from "../../../api/public/partner";

export function formatBookingStatusLabel(
  status: StaffEstablishmentBookingRow["status"],
  t: TFunction<"staff">,
): string {
  switch (status) {
    case "CANCELLED":
      return t("calendar.status.cancelled");
    case "COMPLETED":
      return t("calendar.status.completed");
    case "CONFIRMED":
      return t("calendar.status.confirmed");
    case "PENDING":
      return t("calendar.status.pending");
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
