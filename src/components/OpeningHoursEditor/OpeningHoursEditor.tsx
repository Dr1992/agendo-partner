import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Switch, Text as RNText, View } from "react-native";

import { HourMinutePickerModal } from "../HourMinutePickerModal/HourMinutePickerModal";
import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import { getScreenFormStyles } from "../ScreenForm";
import { normalizeTimeInput, type DaySlot } from "../../utils/openingHours";

import { getOpeningHoursEditorStyles } from "./styles";

const WEEKDAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type TimePick = {
  field: "close" | "open";
  index: number;
};

type OpeningHoursEditorProps = {
  onChange: (next: DaySlot[]) => void;
  value: DaySlot[];
  /** `false` omite o texto auxiliar (útil quando o ecrã já explica o contexto). */
  hint?: string | false;
};

export function OpeningHoursEditor({
  onChange,
  value,
  hint,
}: OpeningHoursEditorProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const oh = useMemo(() => getOpeningHoursEditorStyles(theme), [theme]);
  const [timePick, setTimePick] = useState<TimePick | null>(null);

  const patchDay = useCallback(
    (index: number, patch: Partial<DaySlot>) => {
      onChange(value.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    },
    [onChange, value],
  );

  const hintLine =
    hint === false ? null : hint === undefined ? t("openingHours.hint") : hint;

  const timePickerTitle =
    timePick?.field === "open"
      ? t("openingHours.openTimeTitle")
      : t("openingHours.closeTimeTitle");

  return (
    <View>
      {hintLine ? <RNText style={styles.hint}>{hintLine}</RNText> : null}
      {WEEKDAY_KEYS.map((weekdayKey, index) => {
        const slot = value[index]!;
        const label = t(`openingHours.weekday.${weekdayKey}`);
        return (
          <View
            key={weekdayKey}
            style={[oh.dayRow, index === 6 ? oh.dayRowLast : null]}
          >
            <View style={oh.dayTitleRow}>
              <View style={oh.titleCol}>
                <RNText style={oh.dayTitle}>
                  {label}{" "}
                  <RNText style={oh.dayLabelMuted}>
                    ({t(`weekdaysShort.${weekdayKey}`)})
                  </RNText>
                </RNText>
              </View>
              <Switch
                accessibilityLabel={t("openingHours.dayOpensSwitch", {
                  day: label,
                })}
                thumbColor={theme.surface}
                trackColor={{
                  false: theme.border,
                  true: theme.accent,
                }}
                value={slot.enabled}
                onValueChange={(v) => patchDay(index, { enabled: v })}
              />
            </View>
            {slot.enabled ? (
              <View style={oh.timeGrid}>
                <View style={oh.timeCol}>
                  <RNText style={oh.timeLabel}>
                    {t("openingHours.start")}
                  </RNText>
                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.field,
                      styles.fieldNoTopMargin,
                      pressed && styles.interactionPressed,
                    ]}
                    onPress={() => setTimePick({ index, field: "open" })}
                  >
                    <View style={oh.timeFieldRow}>
                      <Text variant="body">{slot.open}</Text>
                      <Ionicons
                        color={theme.textHint}
                        name="chevron-down"
                        size={22}
                      />
                    </View>
                  </Pressable>
                </View>
                <View style={oh.timeCol}>
                  <RNText style={oh.timeLabel}>{t("openingHours.end")}</RNText>
                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.field,
                      styles.fieldNoTopMargin,
                      pressed && styles.interactionPressed,
                    ]}
                    onPress={() => setTimePick({ index, field: "close" })}
                  >
                    <View style={oh.timeFieldRow}>
                      <Text variant="body">{slot.close}</Text>
                      <Ionicons
                        color={theme.textHint}
                        name="chevron-down"
                        size={22}
                      />
                    </View>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        );
      })}
      {timePick ? (
        <HourMinutePickerModal
          initialHHMM={value[timePick.index]![timePick.field]}
          mode="clock"
          title={timePickerTitle}
          visible
          onClose={() => setTimePick(null)}
          onConfirm={(hhmm) => {
            const pickedTime = timePick;
            patchDay(pickedTime.index, {
              [pickedTime.field]: normalizeTimeInput(hhmm),
            });
            setTimePick(null);
          }}
        />
      ) : null}
    </View>
  );
}
