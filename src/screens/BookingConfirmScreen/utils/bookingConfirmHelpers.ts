/**
 * Email do cliente é opcional. Quando preenchido, validamos só o formato — se
 * não corresponder a uma conta no servidor, o agendamento fica "ghost" lá.
 * Retorna `true` quando o input pode ser submetido (vazio ou formato válido).
 */
export function isAcceptableCustomerEmail(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length === 0) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
