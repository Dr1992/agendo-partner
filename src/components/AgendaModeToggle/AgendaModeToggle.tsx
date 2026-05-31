import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  type LayoutChangeEvent,
  Pressable,
  View,
} from "react-native";

import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";

import {
  AGENDA_MODE_TOGGLE_SEGMENT_GAP,
  getAgendaModeToggleStyles,
} from "./styles";

export type AgendaTabMode = "client" | "staff";

type AgendaModeToggleProps = {
  mode: AgendaTabMode;
  onChange: (mode: AgendaTabMode) => void;
};

export function AgendaModeToggle({ mode, onChange }: AgendaModeToggleProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getAgendaModeToggleStyles(theme), [theme]);
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(
    new Animated.Value(mode === "client" ? 0 : 1),
  ).current;
  const laidOutOnce = useRef(false);
  const prevModeRef = useRef(mode);

  const pillWidth =
    trackWidth > 0 ? (trackWidth - AGENDA_MODE_TOGGLE_SEGMENT_GAP) / 2 : 0;

  useEffect(() => {
    if (trackWidth <= 0 || pillWidth <= 0) {
      return;
    }

    if (!laidOutOnce.current) {
      laidOutOnce.current = true;
      progress.setValue(mode === "client" ? 0 : 1);
      prevModeRef.current = mode;
      return;
    }

    if (prevModeRef.current === mode) {
      return;
    }
    prevModeRef.current = mode;

    Animated.spring(progress, {
      friction: 9,
      tension: 68,
      toValue: mode === "client" ? 0 : 1,
      useNativeDriver: true,
    }).start();
  }, [mode, pillWidth, progress, trackWidth]);

  const translateX =
    pillWidth > 0
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, pillWidth + AGENDA_MODE_TOGGLE_SEGMENT_GAP],
        })
      : 0;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const measuredTrackWidth = e.nativeEvent.layout.width;
    setTrackWidth((prev) =>
      prev !== measuredTrackWidth ? measuredTrackWidth : prev,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.shell}>
        <View style={styles.track} onLayout={onTrackLayout}>
          {pillWidth > 0 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pill,
                { width: pillWidth, transform: [{ translateX }] },
              ]}
            />
          ) : null}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === "client" }}
            style={({ pressed }) => [
              styles.hitSlot,
              pressed && styles.hitPressed,
            ]}
            onPress={() => onChange("client")}
          >
            <Text
              style={
                mode === "client" ? styles.textActive : styles.textInactive
              }
              variant="bodyTight"
            >
              {t("agendaModeToggle.client")}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === "staff" }}
            style={({ pressed }) => [
              styles.hitSlot,
              pressed && styles.hitPressed,
            ]}
            onPress={() => onChange("staff")}
          >
            <Text
              style={mode === "staff" ? styles.textActive : styles.textInactive}
              variant="bodyTight"
            >
              {t("agendaModeToggle.staff")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
