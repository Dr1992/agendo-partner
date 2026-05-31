import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import { formatDurationMinutesLabel } from "../../utils/formatDurationLabel";
import { Text } from "../Text";
import { getServiceCardStyles } from "./styles";

export type ServiceCardMode = "select" | "manage";

export type ServiceCardProps = {
  description?: string | null;
  durationMinutes: number;
  isActive?: boolean;
  mode?: ServiceCardMode;
  name: string;
  onPress: () => void;
  priceLabel: string;
};

export function ServiceCard({
  description,
  durationMinutes,
  isActive,
  mode = "select",
  name,
  onPress,
  priceLabel,
}: ServiceCardProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getServiceCardStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text numberOfLines={2} style={styles.name} variant="listTitle">
          {name}
        </Text>
        <Ionicons
          color={theme.textMuted}
          name={mode === "manage" ? "create-outline" : "chevron-forward"}
          size={18}
          style={styles.actionIcon}
        />
      </View>

      {description?.trim() ? (
        <Text numberOfLines={2} style={styles.desc} variant="bodyTight">
          {description.trim()}
        </Text>
      ) : null}

      {isActive === false ? (
        <Text style={styles.inactiveBadge} variant="hint">
          {t("serviceCard.inactive")}
        </Text>
      ) : null}

      <View style={styles.separator} />

      <View style={styles.footerRow}>
        <View style={styles.durationRow}>
          <Ionicons color={theme.textMuted} name="time-outline" size={14} />
          <Text style={styles.durationText} variant="bodyTight">
            {formatDurationMinutesLabel(durationMinutes)}
          </Text>
        </View>
        <Text style={styles.price} variant="listTitle">
          {priceLabel}
        </Text>
      </View>
    </Pressable>
  );
}
