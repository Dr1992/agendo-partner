import i18n from "../i18n";
import type { UserProfile } from "../types/auth";
import { isValidCpf, normalizeCpfDigits } from "./cpf";

export function validateUserProfile(profile: UserProfile): UserProfile {
  const cpf = normalizeCpfDigits(profile.cpf);
  if (!isValidCpf(cpf)) {
    throw new Error(i18n.t("onboarding:validation.cpfInvalid"));
  }
  const phoneDigits = profile.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    throw new Error(i18n.t("onboarding:validation.phoneInvalid"));
  }
  const fullName = profile.fullName.trim();
  if (fullName.length < 2) {
    throw new Error(i18n.t("onboarding:validation.fullNameRequired"));
  }
  const email = profile.email.trim();
  if (!email.includes("@")) {
    throw new Error(i18n.t("onboarding:validation.emailInvalid"));
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
