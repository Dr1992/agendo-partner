import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchPartnerEstablishments } from "../api/public/partner";

const PREFIX = "@agendo:partnerOwnerTeamPromoDismissed:";

function key(establishmentId: string, userId: string): string {
  return `${PREFIX}${establishmentId}:${userId}`;
}

export async function readOwnerTeamPromoDismissed(
  establishmentId: string,
  userId: string,
): Promise<boolean> {
  const raw = await AsyncStorage.getItem(key(establishmentId, userId));
  return raw === "1";
}

export async function writeOwnerTeamPromoDismissed(
  establishmentId: string,
  userId: string,
): Promise<void> {
  await AsyncStorage.setItem(key(establishmentId, userId), "1");
}

export async function clearOwnerTeamPromoDismissed(
  establishmentId: string,
  userId: string,
): Promise<void> {
  await AsyncStorage.removeItem(key(establishmentId, userId));
}

/**
 * Após login ou refresh de sessão: alinha o armazenamento local com o servidor.
 * Se o utilizador já consta como prestador num local, remove o "dismiss" desse
 * local (útil após reinstalar a app ou quando o backend passa a listar o dono).
 */
export async function syncOwnerTeamPromoDismissWithPartnerEstablishments(
  userId: string,
): Promise<void> {
  try {
    const res = await fetchPartnerEstablishments();
    for (const row of res.data) {
      const listed = row.detail.professionals.some((p) => p.id === userId);
      if (listed) {
        await clearOwnerTeamPromoDismissed(row.detail.id, userId);
      }
    }
  } catch {
    // Sem perfil parceiro, rede, 401, etc.
  }
}
