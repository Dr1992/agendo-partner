const EARTH_KM = 6371;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_KM * c;
}

export function formatDistanceKm(km: number): string {
  if (!Number.isFinite(km) || km < 0) {
    return "";
  }
  if (km < 1) {
    return `${Math.max(1, Math.round(km * 1000))} m`;
  }
  return `${km.toFixed(1)} km`;
}
