import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import { Platform, Text, View } from "react-native";

import { AppSheetModal } from "../AppSheetModal/AppSheetModal";
import { Button } from "../Button";
import { useAppTheme } from "../../hooks/useAppTheme";
import { normalizeTimeInput, timeToMinutes } from "../../utils/openingHours";

import { getHourMinutePickerModalStyles } from "./styles";

const DURATION_MIN_TOTAL = 1;
const DURATION_MAX_TOTAL = 24 * 60;

export type HourMinutePickerClockProps = {
  initialHHMM: string;
  mode: "clock";
  onClose: () => void;
  onConfirm: (hhmm: string) => void;
  title: string;
  visible: boolean;
};

export type HourMinutePickerDurationProps = {
  initialMinutes: number;
  mode: "duration";
  onClose: () => void;
  onConfirm: (totalMinutes: number) => void;
  title: string;
  visible: boolean;
};

export type HourMinutePickerModalProps =
  | HourMinutePickerClockProps
  | HourMinutePickerDurationProps;

function hhmmFromClock(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Roda Horas + Minutos: modo `clock` (HH:MM 00:00–23:59) ou `duration` (total 1–1440 min, com 24h = dia inteiro).
 */
export function HourMinutePickerModal(props: HourMinutePickerModalProps) {
  const { mode, onClose, onConfirm, title, visible } = props;
  const initialHHMM = mode === "clock" ? props.initialHHMM : "";
  const initialMinutes = mode === "duration" ? props.initialMinutes : 0;
  const { theme } = useAppTheme();
  const styles = useMemo(() => getHourMinutePickerModalStyles(theme), [theme]);

  const [hourVal, setHourVal] = useState(0);
  const [minuteVal, setMinuteVal] = useState(0);

  const maxHourInclusive = mode === "clock" ? 23 : 24;

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (mode === "clock") {
      const parsed = timeToMinutes(normalizeTimeInput(initialHHMM.trim()));
      const mins = parsed ?? 9 * 60;
      setHourVal(Math.min(23, Math.floor(mins / 60)));
      setMinuteVal(mins % 60);
      return;
    }
    const clamped = Math.min(
      Math.max(Math.round(initialMinutes), DURATION_MIN_TOTAL),
      DURATION_MAX_TOTAL,
    );
    if (clamped === DURATION_MAX_TOTAL) {
      setHourVal(24);
      setMinuteVal(0);
    } else {
      setHourVal(Math.floor(clamped / 60));
      setMinuteVal(clamped % 60);
    }
  }, [initialHHMM, initialMinutes, mode, visible]);

  const minuteItems = useMemo(() => {
    if (mode === "clock") {
      return Array.from({ length: 60 }, (_, i) => i);
    }
    const maxMin = hourVal >= 24 ? 0 : 59;
    return Array.from({ length: maxMin + 1 }, (_, i) => i);
  }, [hourVal, mode]);

  const onConfirmPress = () => {
    if (mode === "clock") {
      onConfirm(normalizeTimeInput(hhmmFromClock(hourVal, minuteVal)));
      onClose();
      return;
    }
    const total =
      hourVal >= 24
        ? DURATION_MAX_TOTAL
        : Math.min(hourVal * 60 + minuteVal, DURATION_MAX_TOTAL);
    const clamped = Math.min(
      Math.max(total, DURATION_MIN_TOTAL),
      DURATION_MAX_TOTAL,
    );
    onConfirm(clamped);
    onClose();
  };

  const pickerItemStyle =
    Platform.OS === "ios"
      ? { color: theme.textPrimary, fontSize: 20 }
      : { color: theme.textPrimary };

  const hourItems = useMemo(
    () => Array.from({ length: maxHourInclusive + 1 }, (_, h) => h),
    [maxHourInclusive],
  );

  return (
    <AppSheetModal
      contentPaddingH={0}
      footer={<Button onPress={onConfirmPress}>Confirmar</Button>}
      size="medium"
      title={title}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.pickerPair}>
        <View style={[styles.pickerColumn, styles.wheelWrap]}>
          <Text style={styles.unitLabel}>Horas</Text>
          <Picker
            itemStyle={pickerItemStyle as object}
            mode={Platform.OS === "android" ? "dropdown" : undefined}
            selectedValue={hourVal}
            style={styles.pickerFullWidth}
            onValueChange={(v) => {
              const selectedHour = Number(v);
              setHourVal(selectedHour);
              if (mode === "duration" && selectedHour >= 24) {
                setMinuteVal(0);
              }
            }}
          >
            {hourItems.map((h) => (
              <Picker.Item
                key={h}
                label={String(h).padStart(2, "0")}
                value={h}
              />
            ))}
          </Picker>
        </View>
        <View style={[styles.pickerColumn, styles.wheelWrap]}>
          <Text style={styles.unitLabel}>Min</Text>
          <Picker
            enabled={mode === "clock" || hourVal < 24}
            itemStyle={pickerItemStyle as object}
            mode={Platform.OS === "android" ? "dropdown" : undefined}
            selectedValue={minuteVal}
            style={styles.pickerFullWidth}
            onValueChange={(v) => setMinuteVal(Number(v))}
          >
            {minuteItems.map((m) => (
              <Picker.Item
                key={m}
                label={String(m).padStart(2, "0")}
                value={m}
              />
            ))}
          </Picker>
        </View>
      </View>
    </AppSheetModal>
  );
}
