import { apiGet } from "../http";
import type { TimeSlotOption } from "../../types/timeSlot";

type SlotsApiResponse = {
  establishmentId: string;
  slots: { startsAt: string; label?: string }[];
};

export async function fetchTimeSlotsFromApi(args: {
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  durationMinutes: number;
}): Promise<TimeSlotOption[]> {
  const qs = new URLSearchParams();
  qs.set("serviceId", args.serviceId);
  if (args.professionalId !== "any") {
    qs.set("professionalId", args.professionalId);
  }
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 62);
  qs.set("from", from.toISOString());
  qs.set("to", to.toISOString());

  const slotsResponse = await apiGet<SlotsApiResponse>(
    `/establishments/${args.establishmentId}/slots?${qs.toString()}`,
  );

  const mappedSlots = slotsResponse.slots.map((slot) => ({
    startsAt: slot.startsAt,
    label:
      slot.label ??
      new Date(slot.startsAt).toLocaleString("pt-BR", {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        weekday: "short",
      }),
  }));

  return mappedSlots;
}
