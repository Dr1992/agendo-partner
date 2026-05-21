import type { Professional } from "../../types/professional";

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function formatPriceAmount(price: number): string {
  return price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function slotTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function endTimeLabel(
  startIso: string,
  durationMinutes: number,
): string {
  const endTime = new Date(startIso);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  return endTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sortProfessionalsForBookingStrip(
  list: Professional[],
): Professional[] {
  const rank = (participant: Professional): number => {
    switch (participant.staffRole) {
      case "STAFF":
        return 0;
      case "MANAGER":
        return 1;
      case "OWNER":
        return 2;
      default:
        return 1;
    }
  };
  return [...list].sort(
    (participantA, participantB) =>
      rank(participantA) - rank(participantB) ||
      participantA.name.localeCompare(participantB.name, "pt-BR", {
        sensitivity: "base",
      }),
  );
}
