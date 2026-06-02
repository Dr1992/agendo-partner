import { Platform, StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

const ANDROID_PICKER_WIDTH = 140;

export function getHourMinutePickerModalStyles(theme: AppTheme) {
  return StyleSheet.create({
    pickerFullWidth: Platform.select({
      android: { width: ANDROID_PICKER_WIDTH },
      default: { width: "100%" },
    }),
    pickerColumn: Platform.select({
      android: { alignItems: "center", width: ANDROID_PICKER_WIDTH },
      default: { alignItems: "center", flex: 1 },
    }),
    pickerPair: {
      flexDirection: "row",
      justifyContent: "center",
      paddingBottom: 8,
      paddingTop: 8,
    },
    unitLabel: {
      alignSelf: "center",
      color: theme.textHint,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: -4,
      textTransform: "uppercase",
    },
    wheelWrap: {
      alignItems: "center",
    },
  });
}
