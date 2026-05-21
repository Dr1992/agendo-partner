import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../../theme";

export function getEstablishmentRegisterGalleryStyles(theme: AppTheme) {
  return StyleSheet.create({
    addTile: {
      alignItems: "center",
      borderColor: theme.border,
      borderRadius: 12,
      borderStyle: "dashed",
      borderWidth: 1,
      height: 96,
      justifyContent: "center",
      marginRight: 10,
      width: 96,
    },
    addTileDisabled: {
      opacity: 0.55,
    },
    addTilePressed: {
      opacity: 0.88,
    },
    hint: {
      marginBottom: 10,
      marginTop: 4,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    thumb: {
      borderColor: theme.border,
      borderRadius: 12,
      borderWidth: 1,
      height: 96,
      overflow: "hidden",
      width: 96,
    },
    thumbWrap: {
      marginBottom: 10,
      marginRight: 10,
      position: "relative",
    },
    thumbImage: {
      height: "100%",
      width: "100%",
    },
    removeHit: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 14,
      height: 28,
      justifyContent: "center",
      position: "absolute",
      right: 4,
      top: 4,
      width: 28,
    },
    removePressed: {
      opacity: 0.9,
    },
  });
}
