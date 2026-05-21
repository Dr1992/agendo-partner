/** Parte inteira máxima (9 dígitos) + 2 decimais — acima disto cortamos na sanitização. */
const MAX_REAIS_INTEGER_DIGITS = 9;
/** Teto ~ R$ 999.999,99 em centavos. */
const MAX_PRICE_CENTS = 99_999_999;

/** Converte entrada tipo "99,90" ou "99.90" para centavos (inteiro). */
export function parseBrazilMoneyInputToCents(raw: string): number | null {
  const normalized = raw.trim().replace(/\./g, "").replace(",", ".");
  if (normalized === "") {
    return null;
  }
  const parsedValue = Number.parseFloat(normalized);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return null;
  }
  const cents = Math.round(parsedValue * 100);
  if (cents > MAX_PRICE_CENTS) {
    return MAX_PRICE_CENTS;
  }
  return cents;
}

/**
 * Durante a digitação: só dígitos e uma vírgula como separador decimal (até 2 casas).
 * Não aceita ponto (evita milhares mal colocados no teclado numérico).
 */
export function sanitizeBrazilMoneyInputTyping(raw: string): string {
  const sanitized = raw.replace(/[^\d,]/g, "");
  const firstComma = sanitized.indexOf(",");
  if (firstComma === -1) {
    return sanitized.slice(0, MAX_REAIS_INTEGER_DIGITS);
  }
  if (firstComma === 0) {
    const frac = sanitized.slice(1).replace(/\D/g, "").slice(0, 2);
    return frac.length > 0 ? `0,${frac}` : "0,";
  }
  const intPart = sanitized
    .slice(0, firstComma)
    .replace(/\D/g, "")
    .slice(0, MAX_REAIS_INTEGER_DIGITS);
  const frac = sanitized
    .slice(firstComma + 1)
    .replace(/\D/g, "")
    .replace(/,/g, "")
    .slice(0, 2);
  if (sanitized.endsWith(",") && frac.length === 0) {
    return intPart + ",";
  }
  return frac.length > 0 ? `${intPart},${frac}` : intPart;
}

/**
 * Máscara de entrada monetária direita→esquerda: centavos preenchidos primeiro.
 * Ex.: "1" → "0,01" | "150" → "1,50" | "15000" → "150,00" | "1500000" → "15.000,00"
 * Retorna "" para entrada vazia.
 */
export function maskBrazilMoneyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  const padded = digits.padStart(3, "0");
  const centsPart = padded.slice(-2);
  const intPart = padded.slice(0, -2).replace(/^0+/, "") || "0";
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${intFormatted},${centsPart}`;
}

/** Só dígitos; adequado a `keyboardType="number-pad"` (minutos). */
export function sanitizeMinutesDigits(raw: string, maxLen = 4): string {
  return raw.replace(/\D/g, "").slice(0, maxLen);
}

export function formatCentsAsBrazilReais(cents: number | null): string {
  if (cents == null) {
    return "";
  }
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
