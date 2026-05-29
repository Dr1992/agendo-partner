import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import { DETAIL_FACT_ICON_SIZE, getDetailFactsCardStyles } from "./styles";

export type DetailFactRow =
  | {
      emphasis?: boolean;
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      type?: "text";
      value: string;
    }
  | {
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      onPress: () => void;
      type: "link";
      value: string;
    };

type Props = {
  /** Sem `marginTop` no cartão (ex.: resumo na confirmação de reserva). */
  compactTop?: boolean;
  rows: DetailFactRow[];
};

export function DetailFactsCard({ compactTop, rows }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getDetailFactsCardStyles(theme), [theme]);
  const iconSize = DETAIL_FACT_ICON_SIZE;

  return (
    <View style={[styles.card, compactTop && styles.cardNoTopMargin]}>
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        const rowKey = `${row.label}-${index}`;
        if (row.type === "link") {
          return (
            <Pressable
              key={rowKey}
              accessibilityHint={t("detailFactsCard.routeHint")}
              accessibilityRole="button"
              style={[
                styles.detailRowPressable,
                isLast && styles.detailRowLast,
              ]}
              onPress={row.onPress}
            >
              <View style={styles.detailIconWrap}>
                <Ionicons
                  color={theme.accent}
                  name={row.icon}
                  size={iconSize}
                />
              </View>
              <View style={styles.detailBody}>
                <Text style={styles.detailLabel} variant="bodyTight">
                  {row.label}
                </Text>
                <Text style={styles.detailValue} variant="bodyTight">
                  {row.value}
                </Text>
              </View>
              <Ionicons
                color={theme.textHint}
                name="chevron-forward"
                size={18}
                style={styles.chevron}
              />
            </Pressable>
          );
        }
        return (
          <View
            key={rowKey}
            style={[styles.detailRow, isLast && styles.detailRowLast]}
          >
            <View style={styles.detailIconWrap}>
              <Ionicons color={theme.accent} name={row.icon} size={iconSize} />
            </View>
            <View style={styles.detailBody}>
              <Text style={styles.detailLabel} variant="bodyTight">
                {row.label}
              </Text>
              <Text
                style={
                  row.emphasis ? styles.detailValueEmphasis : styles.detailValue
                }
                variant="bodyTight"
              >
                {row.value}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
