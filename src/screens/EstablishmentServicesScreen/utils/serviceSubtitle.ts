import type { PartnerServiceRow } from "../../../api/public/partner";
import { formatCentsAsBrazilReais } from "../../../utils/brazilMoney";
import { formatDurationMinutesLabel } from "../../../utils/formatDurationLabel";

export function serviceSubtitle(row: PartnerServiceRow): string {
  const price =
    row.priceCents != null
      ? `R$ ${formatCentsAsBrazilReais(row.priceCents)}`
      : "Preço não informado";
  return `${formatDurationMinutesLabel(row.durationMinutes)} · ${price}`;
}
