/** Chave i18n (namespace `team`) para o papel na equipe, usada no rótulo de acessibilidade. */
export function staffRoleKey(
  role: string | undefined,
):
  | "collaborators.role.owner"
  | "collaborators.role.manager"
  | "collaborators.role.staff" {
  if (role === "OWNER") {
    return "collaborators.role.owner";
  }
  if (role === "MANAGER") {
    return "collaborators.role.manager";
  }
  return "collaborators.role.staff";
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
