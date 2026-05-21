/** Apenas dígitos, até 14 (CNPJ). */
export function normalizeCnpjDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, 14);
}

/** CNPJ com 14 dígitos e dígitos verificadores válidos. */
export function isValidCnpj(digitsRaw: string): boolean {
  const normalizedDigits = normalizeCnpjDigits(digitsRaw);
  if (normalizedDigits.length !== 14 || /^(\d)\1{13}$/.test(normalizedDigits)) {
    return false;
  }
  const checksum = (slice: string, factors: readonly number[]) => {
    let sum = 0;
    for (let i = 0; i < factors.length; i++) {
      sum += Number(slice.charAt(i)) * factors[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;
  if (
    checksum(normalizedDigits.slice(0, 12), w1) !== Number(normalizedDigits[12])
  ) {
    return false;
  }
  return (
    checksum(normalizedDigits.slice(0, 13), w2) === Number(normalizedDigits[13])
  );
}

/** Máscara: `00.000.000/0000-00`. */
export function formatCnpjDisplay(digitsRaw: string): string {
  const normalizedDigits = normalizeCnpjDigits(digitsRaw);
  if (normalizedDigits.length === 0) {
    return "";
  }
  if (normalizedDigits.length <= 2) {
    return normalizedDigits;
  }
  if (normalizedDigits.length <= 5) {
    return `${normalizedDigits.slice(0, 2)}.${normalizedDigits.slice(2)}`;
  }
  if (normalizedDigits.length <= 8) {
    return `${normalizedDigits.slice(0, 2)}.${normalizedDigits.slice(2, 5)}.${normalizedDigits.slice(5)}`;
  }
  if (normalizedDigits.length <= 12) {
    return `${normalizedDigits.slice(0, 2)}.${normalizedDigits.slice(2, 5)}.${normalizedDigits.slice(5, 8)}/${normalizedDigits.slice(8)}`;
  }
  return `${normalizedDigits.slice(0, 2)}.${normalizedDigits.slice(2, 5)}.${normalizedDigits.slice(5, 8)}/${normalizedDigits.slice(8, 12)}-${normalizedDigits.slice(12, 14)}`;
}
