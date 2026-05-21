/** Rótulo de acessibilidade em pt para o papel na equipe. */
export function staffRoleLower(role: string | undefined): string {
  if (role === "OWNER") {
    return "dono";
  }
  if (role === "MANAGER") {
    return "gestor";
  }
  return "colaborador";
}

/** Glifo Ionicons por papel (ícone na lista; papel em `accessibilityLabel`). */
export function staffRoleIonIcon(
  role: string | undefined,
): "briefcase-outline" | "medal-outline" | "person-outline" {
  if (role === "OWNER") {
    return "medal-outline";
  }
  if (role === "MANAGER") {
    return "briefcase-outline";
  }
  return "person-outline";
}
