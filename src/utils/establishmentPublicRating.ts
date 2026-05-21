/** Com menos que isto, exibimos nota padrão e não mostramos a contagem. */
export const MIN_RATINGS_FOR_PUBLIC_AVERAGE = 5;

const DEFAULT_STARS = 5;

export function getPublicEstablishmentStars(
  rating: number,
  reviewCount: number,
): number {
  if (reviewCount >= MIN_RATINGS_FOR_PUBLIC_AVERAGE) {
    return rating;
  }
  return DEFAULT_STARS;
}

export function shouldShowEstablishmentReviewCount(
  reviewCount: number,
): boolean {
  return reviewCount >= MIN_RATINGS_FOR_PUBLIC_AVERAGE;
}
