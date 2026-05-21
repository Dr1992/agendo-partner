/** Primitive palette — light / dark variants where needed */
export const palette = {
  accentAmber: "#F59E0B",
  /** Texto principal em fundo claro (slate-900) */
  black: "#0F172A",
  /** Sombra iOS sem translucidez no hex */
  blackPure: "#000000",
  brandIndigo: "#4338CA",
  brandIndigoMuted: "#6366F1",
  danger: "#DC2626",
  /** Texto destrutivo em fundo escuro (ex.: tema dark) */
  destructiveOnDark: "#FCA5A5",
  /** Bordas/texto de ação destrutiva enfatizada */
  red700: "#B91C1C",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  /** Entre slate-200 e slate-400 — texto auxiliar em fundo escuro */
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",
  success: "#059669",
  white: "#FFFFFF",
  /** Texto e spinners sobre botão com `theme.accent` */
  onAccent: "#FFFFFF",
  /** Fundo de chip ativo / seleção suave no tema claro */
  accentWash: "#EEF2FF",
  cardShadowLight: "#00000014",
  cardShadowDark: "#00000066",
} as const;

/**
 * Transparências e camadas sobre brand — nomes descrevem o RGBA, não o contexto de uso.
 */
export const alpha = {
  overlayScrim: "rgba(0,0,0,0.45)",
  white10: "rgba(255,255,255,0.1)",
  white12: "rgba(255,255,255,0.12)",
  white85: "rgba(255,255,255,0.85)",
  white95: "rgba(255,255,255,0.95)",
  brandDeepOnLight06: "rgba(67, 56, 202, 0.06)",
  brandDeepOnLight08: "rgba(67, 56, 202, 0.08)",
  brandDeepOnLight11: "rgba(67, 56, 202, 0.11)",
  brandDeepOnLight20: "rgba(67, 56, 202, 0.2)",
  brandMutedOnLight10: "rgba(99, 102, 241, 0.1)",
  brandMutedOnLight12: "rgba(99, 102, 241, 0.12)",
  brandMutedOnLight15: "rgba(99, 102, 241, 0.15)",
  brandMutedOnLight20: "rgba(99, 102, 241, 0.2)",
  brandMutedOnLight22: "rgba(99, 102, 241, 0.22)",
  brandMutedOnLight35: "rgba(99, 102, 241, 0.35)",
  brandVioletOnDark15: "rgba(129, 140, 248, 0.15)",
  brandVioletOnDark20: "rgba(129, 140, 248, 0.2)",
  brandVioletOnDark35: "rgba(129, 140, 248, 0.35)",
  /** Fundo suave para pílulas de estado destrutivo (ex.: cancelado) */
  dangerMutedOnLight12: "rgba(220, 38, 38, 0.12)",
} as const;
