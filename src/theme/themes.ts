import { palette } from "./colors";

export type AppTheme = {
  scheme: "light" | "dark";
  background: string;
  surface: string;
  surfaceElevated: string;
  /** Remover, desativar — sempre via `palette`, nunca hex solto nos ecrãs */
  textDestructive: string;
  textPrimary: string;
  textSecondary: string;
  /** Auxiliar (hints): um passo acima de `textMuted`, abaixo de `textSecondary`. */
  textHint: string;
  textMuted: string;
  border: string;
  tabBar: string;
  tabBarBorder: string;
  tabIconActive: string;
  tabIconInactive: string;
  accent: string;
  cardShadow: string;
};

export const lightTheme: AppTheme = {
  accent: palette.brandIndigo,
  background: palette.slate50,
  border: palette.slate200,
  cardShadow: palette.cardShadowLight,
  scheme: "light",
  surface: palette.white,
  surfaceElevated: palette.white,
  tabBar: palette.white,
  tabBarBorder: palette.slate200,
  tabIconActive: palette.brandIndigo,
  tabIconInactive: palette.slate400,
  textDestructive: palette.red700,
  textHint: palette.slate500,
  textMuted: palette.slate400,
  textPrimary: palette.slate900,
  textSecondary: palette.slate600,
};

export const darkTheme: AppTheme = {
  accent: palette.brandIndigoMuted,
  background: palette.slate900,
  border: palette.slate700,
  cardShadow: palette.cardShadowDark,
  scheme: "dark",
  surface: palette.slate800,
  surfaceElevated: palette.slate700,
  tabBar: palette.slate800,
  tabBarBorder: palette.slate700,
  tabIconActive: palette.brandIndigoMuted,
  /** Inativo: mesmo tom que `textMuted` (leitura na tab slate-800) */
  tabIconInactive: palette.slate400,
  textDestructive: palette.destructiveOnDark,
  textHint: palette.slate300,
  textMuted: palette.slate400,
  textPrimary: palette.slate50,
  textSecondary: palette.slate200,
};

export function getTheme(scheme: "light" | "dark"): AppTheme {
  return scheme === "dark" ? darkTheme : lightTheme;
}
