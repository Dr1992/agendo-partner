import type { UserProfile } from "../types/auth";
import { isValidCpf, normalizeCpfDigits } from "./cpf";

export function validateUserProfile(profile: UserProfile): UserProfile {
  const cpf = normalizeCpfDigits(profile.cpf);
  if (!isValidCpf(cpf)) {
    throw new Error("CPF inválido.");
  }
  const phoneDigits = profile.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    throw new Error("Telefone inválido (use DDD + número).");
  }
  const fullName = profile.fullName.trim();
  if (fullName.length < 2) {
    throw new Error("Informe seu nome completo.");
  }
  const email = profile.email.trim();
  if (!email.includes("@")) {
    throw new Error("E-mail inválido.");
  }
  return {
    ...profile,
    cpf,
    email,
    fullName,
    phone: profile.phone.trim(),
  };
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) {
    return false;
  }
  try {
    validateUserProfile(profile);
    return true;
  } catch {
    return false;
  }
}
