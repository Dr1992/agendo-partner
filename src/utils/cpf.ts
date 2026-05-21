/** Remove formatação e mantém só dígitos */
export function normalizeCpfDigits(input: string): string {
  return input.replace(/\D/g, "");
}

/** Validação básica de CPF (11 dígitos + dígitos verificadores) */
export function isValidCpf(digits: string): boolean {
  const normalizedDigits = normalizeCpfDigits(digits);
  if (normalizedDigits.length !== 11 || /^(\d)\1{10}$/.test(normalizedDigits)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(normalizedDigits[i]) * (10 - i);
  }
  let mod = (sum * 10) % 11;
  if (mod === 10) {
    mod = 0;
  }
  if (mod !== Number(normalizedDigits[9])) {
    return false;
  }
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(normalizedDigits[i]) * (11 - i);
  }
  mod = (sum * 10) % 11;
  if (mod === 10) {
    mod = 0;
  }
  return mod === Number(normalizedDigits[10]);
}

export function formatCpfDisplay(digits: string): string {
  const normalizedDigits = normalizeCpfDigits(digits);
  if (normalizedDigits.length !== 11) {
    return digits;
  }
  return `${normalizedDigits.slice(0, 3)}.${normalizedDigits.slice(3, 6)}.${normalizedDigits.slice(6, 9)}-${normalizedDigits.slice(9)}`;
}

/** CPF parcialmente oculto para listas (ex.: convites pendentes). */
export function maskCpfDigits(digits: string): string {
  const normalizedDigits = normalizeCpfDigits(digits);
  if (normalizedDigits.length !== 11) {
    return "•••";
  }
  return `${normalizedDigits.slice(0, 3)}.***.***-${normalizedDigits.slice(9)}`;
}
