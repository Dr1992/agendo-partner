/** Apenas dígitos, até `max` (11 = celular BR com DDD). */
export function normalizePhoneDigits(input: string, max = 11): string {
  return input.replace(/\D/g, "").slice(0, max);
}

/** Celular BR: 11 dígitos; após o DDD o primeiro dígito é 9. */
export function isValidBrazilCellPhoneDigits(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 11 || digits[2] !== "9") {
    return false;
  }
  const ddd = Number(digits.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
}

/**
 * Máscara BR: celular `(xx) xxxxx-xxxx` (11 dígitos); fixo `(xx) xxxx-xxxx` (10).
 * Com 3+ dígitos, se o primeiro após DDD for `9`, assume celular (grupo 5+4).
 */
export function formatBrazilPhoneDisplay(digitsRaw: string): string {
  const digits = digitsRaw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) {
    return "";
  }
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const mobilePattern =
    digits.length === 11 || (digits.length >= 3 && digits[2] === "9");

  if (mobilePattern) {
    if (digits.length <= 7) {
      return `(${ddd}) ${rest}`;
    }
    return `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length <= 6) {
    return `(${ddd}) ${rest}`;
  }
  return `(${ddd}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
}
