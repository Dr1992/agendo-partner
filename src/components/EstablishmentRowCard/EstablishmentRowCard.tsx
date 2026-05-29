import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, Pressable, View } from "react-native";

import { Text } from "../Text";
import {
  getPublicEstablishmentStars,
  shouldShowEstablishmentReviewCount,
} from "../../utils/establishmentPublicRating";
import { formatDistanceKm } from "../../utils/haversineKm";
import { monogramFromName } from "../../utils/monogram";
import type { EstablishmentRowCardProps } from "./EstablishmentRowCard.types";
import { getEstablishmentRowCardStyles } from "./styles";

export function EstablishmentRowCard({
  theme,
  title,
  categoryLabel,
  addressShort,
  thumbnailUrl,
  hint,
  nextSlotLabel,
  showDistance = false,
  distanceKm,
  showRating = false,
  rating = 0,
  reviewCount = 0,
  showEditIcon = false,
  inactive = false,
  onPress,
  onEditPress,
  elevated: elevatedProp,
  compact = false,
  containerStyle,
}: EstablishmentRowCardProps) {
  const { t } = useTranslation("components");
  const elevated = elevatedProp ?? true;
  const styles = getEstablishmentRowCardStyles(theme, { compact, elevated });
  const addressDisplay =
    addressShort.trim().length > 0 ? addressShort.trim() : "—";

  const displayStars = getPublicEstablishmentStars(
    rating ?? 0,
    reviewCount ?? 0,
  );
  const showReviewCount = shouldShowEstablishmentReviewCount(reviewCount ?? 0);
  const ratingLine = showRating
    ? showReviewCount
      ? `${displayStars.toFixed(1)} ★ (${reviewCount})`
      : `${displayStars.toFixed(1)} ★`
    : null;

  const hasDistance =
    showDistance && Number.isFinite(distanceKm) && (distanceKm as number) > 0;
  const distanceLabel = hasDistance
    ? formatDistanceKm(distanceKm as number)
    : null;

  const nextSlot = nextSlotLabel?.trim();

  const editGlyph = showEditIcon ? (
    onEditPress ? (
      <Pressable
        accessibilityLabel={t("establishmentRowCard.editAction")}
        accessibilityRole="button"
        hitSlop={10}
        style={styles.editIconBox}
        onPress={(e) => {
          e.stopPropagation?.();
          onEditPress();
        }}
      >
        <Ionicons color={theme.textHint} name="create-outline" size={22} />
      </Pressable>
    ) : (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.editIconBox}
      >
        <Ionicons color={theme.textHint} name="create-outline" size={22} />
      </View>
    )
  ) : null;

  const showTrailing = Boolean(ratingLine || showEditIcon);

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.pressable,
        inactive && styles.pressableInactive,
        pressed && { opacity: 0.92 },
        containerStyle,
      ]}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <View style={styles.rowMain}>
          <View style={styles.thumbColumn}>
            {thumbnailUrl ? (
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="cover"
                source={{ uri: thumbnailUrl }}
                style={styles.thumb}
              />
            ) : (
              <View style={styles.thumbPlaceholder}>
                <Text style={styles.thumbMonogram} variant="bodyTight">
                  {monogramFromName(title)}
                </Text>
              </View>
            )}
            {distanceLabel ? (
              <View style={[styles.pill, styles.distancePill]}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.pillText}
                  variant="bodyTight"
                >
                  {distanceLabel}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.body}>
            <View style={styles.rowTop}>
              <Text numberOfLines={2} style={styles.name} variant="listTitle">
                {title}
              </Text>
              {showTrailing ? (
                <View style={styles.rowTopTrailing}>
                  {ratingLine ? (
                    <Text style={styles.rating} variant="linkAccent">
                      {ratingLine}
                    </Text>
                  ) : null}
                  {editGlyph}
                </View>
              ) : null}
            </View>
            <Text style={styles.category} variant="listSubtitle">
              {categoryLabel}
            </Text>
            {nextSlot ? (
              <View style={styles.metaRow}>
                <View style={styles.pill}>
                  <Text style={styles.pillText} variant="bodyTight">
                    {nextSlot}
                  </Text>
                </View>
              </View>
            ) : null}
            <Text
              numberOfLines={2}
              style={styles.address}
              variant="listSubtitle"
            >
              {addressDisplay}
            </Text>
            {hint ? (
              <View style={styles.cardHint}>
                {typeof hint === "string" ? (
                  <Text variant="hint">{hint}</Text>
                ) : (
                  hint
                )}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
