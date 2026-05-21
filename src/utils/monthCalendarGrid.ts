/** Limites do mês no fuso local (ISO) para pedidos à API. */
export function monthBoundsIsoLocal(
  year: number,
  monthIndex: number,
): { from: string; to: string } {
  const from = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const to = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
}
