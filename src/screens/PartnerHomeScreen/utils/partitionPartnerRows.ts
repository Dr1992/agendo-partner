import type { PartnerListRow } from "../../../api/public/partner";

export function partitionPartnerRows(partnerRows: PartnerListRow[]) {
  const active: PartnerListRow[] = [];
  const inactive: PartnerListRow[] = [];
  for (const row of partnerRows) {
    if (row.detail.isActive === false) {
      inactive.push(row);
    } else {
      active.push(row);
    }
  }
  const byName = (a: PartnerListRow, b: PartnerListRow) =>
    a.detail.name.localeCompare(b.detail.name, "pt-BR", {
      sensitivity: "base",
    });
  active.sort(byName);
  inactive.sort(byName);
  return {
    activeRows: active,
    hasInactive: inactive.length > 0,
    inactiveRows: inactive,
  };
}
