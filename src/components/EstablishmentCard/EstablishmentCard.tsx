import { EstablishmentRowCard } from "../EstablishmentRowCard/EstablishmentRowCard";
import type { EstablishmentCardProps } from "./EstablishmentCard.types";

export function EstablishmentCard({
  item,
  theme,
  onPress,
}: EstablishmentCardProps) {
  const hasDistance = Number.isFinite(item.distanceKm) && item.distanceKm > 0;

  return (
    <EstablishmentRowCard
      addressShort={item.addressShort}
      categoryLabel={item.categoryLabel}
      containerStyle={{ marginBottom: 12 }}
      distanceKm={item.distanceKm}
      nextSlotLabel={item.nextSlotLabel}
      rating={item.rating}
      reviewCount={item.reviewCount}
      showDistance={hasDistance}
      showRating
      theme={theme}
      thumbnailUrl={item.thumbnailUrl}
      title={item.name}
      onPress={() => onPress?.(item.id)}
    />
  );
}
