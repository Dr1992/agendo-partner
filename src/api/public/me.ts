import { apiAuthGet, apiAuthPatch } from "../http";
import type { UserProfile } from "../../types/auth";
import { normalizeCpfDigits } from "../../utils/cpf";
import {
  isProfileComplete,
  validateUserProfile,
} from "../../utils/validateUserProfile";

export type MeApiResponse = {
  id: string;
  auth0Sub: string;
  email: string | null;
  name: string | null;
  fullName: string | null;
  cpf: string | null;
  phone: string | null;
  updatedAt: string;
};

export function mapMeToUserProfile(me: MeApiResponse): UserProfile {
  return {
    fullName: (me.fullName ?? me.name ?? "").trim(),
    email: (me.email ?? "").trim(),
    cpf: me.cpf ? normalizeCpfDigits(me.cpf) : "",
    phone: (me.phone ?? "").trim(),
  };
}

export function isMeProfileComplete(me: MeApiResponse): boolean {
  return isProfileComplete(mapMeToUserProfile(me));
}

/**
 * Metro (__DEV__): mostra o que o backend expõe após login (GET /me).
 * Endereço não existe neste modelo — só dados da conta.
 */
export function logMeSnapshotForDev(me: MeApiResponse, context: string): void {
  if (!__DEV__) {
    return;
  }
  console.warn(
    `[Auth] ${context} — dados de GET /api/v1/me (servidor Nest)`,
    JSON.stringify(me, null, 2),
  );
}

export async function fetchMe(): Promise<MeApiResponse> {
  return apiAuthGet<MeApiResponse>("/me");
}

export async function patchMe(profile: UserProfile): Promise<MeApiResponse> {
  const validated = validateUserProfile(profile);
  return apiAuthPatch<MeApiResponse>("/me", {
    name: validated.fullName,
    email: validated.email,
    cpf: validated.cpf,
    phone: validated.phone,
  });
}
