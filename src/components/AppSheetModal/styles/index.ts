import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha } from "../../../theme/colors";

export function getAppSheetModalStyles(theme: AppTheme) {
  return StyleSheet.create({
    body: {
      flex: 1,
      minHeight: 0,
    },
    footer: {
      paddingTop: 8,
    },
    headerBar: {
      alignItems: "center",
      backgroundColor: theme.background,
      borderBottomColor: theme.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      paddingBottom: 12,
    },
    headerBarSurface: {
      backgroundColor: theme.surface,
    },
    headerCloseHit: {
      alignItems: "center",
      height: 44,
      justifyContent: "center",
      marginRight: -4,
      minWidth: 44,
      paddingHorizontal: 8,
    },
    headerColLeft: {
      alignItems: "flex-start",
      flex: 1,
      justifyContent: "center",
      minHeight: 44,
      minWidth: 0,
    },
    headerColMid: {
      flex: 2,
      justifyContent: "center",
      minWidth: 0,
      paddingHorizontal: 4,
    },
    headerColRight: {
      alignItems: "flex-end",
      flex: 1,
      justifyContent: "center",
      minHeight: 44,
      minWidth: 0,
    },
    headerTitle: {
      alignSelf: "center",
      maxWidth: "100%",
      textAlign: "center",
    },
    modalRoot: {
      flex: 1,
    },
    scrimGrow: {
      backgroundColor: alpha.overlayScrim,
      flexGrow: 1,
      flexShrink: 1,
    },
    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      bottom: 0,
      left: 0,
      maxHeight: "100%",
      overflow: "hidden",
      position: "absolute",
      right: 0,
    },
    sheetInner: {
      flex: 1,
      maxHeight: "100%",
    },
  });
}
