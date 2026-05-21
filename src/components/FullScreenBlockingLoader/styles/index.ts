import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

export function getFullScreenBlockingLoaderStyles(theme: AppTheme) {
  return StyleSheet.create({
    fill: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    modalRoot: {
      flex: 1,
    },
    /** Cobre o ecrã e bloqueia toques até `visible` ser falso. */
    scrim: {
      backgroundColor:
        theme.scheme === "dark" ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
      flex: 1,
    },
  });
}
