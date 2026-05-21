import type { ServiceCategory } from "../types/category";

export function getCategoryIonicon(category: ServiceCategory): string {
  const map: Record<string, string> = {
    barbell: "barbell-outline",
    briefcase: "briefcase-outline",
    cut: "briefcase-outline",
    "color-palette": "color-palette-outline",
    "hand-left": "hand-left-outline",
    leaf: "leaf-outline",
    medkit: "medkit-outline",
    paw: "paw-outline",
    sparkles: "sparkles-outline",
  };
  return map[category.icon] ?? "grid-outline";
}
