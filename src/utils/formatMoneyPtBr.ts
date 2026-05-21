export function formatMoneyPtBr(amount: number, currency: string): string {
  const code = currency?.length === 3 ? currency : "BRL";
  return amount.toLocaleString("pt-BR", {
    currency: code,
    minimumFractionDigits: 2,
    style: "currency",
  });
}
