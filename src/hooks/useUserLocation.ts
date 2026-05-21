export type UserLocationCoords = {
  latitude: number;
  longitude: number;
};

export type UserLocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "undetermined"
  | "unavailable";

export function useUserLocation() {
  return {
    coords: null as UserLocationCoords | null,
    refresh: async () => {},
    status: "idle" as UserLocationStatus,
  };
}
