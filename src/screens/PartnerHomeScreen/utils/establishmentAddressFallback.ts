import { formatHubAddressLines } from "../../../utils/formatHubAddressLines";

export function establishmentAddressFallback(
  addressFull: string,
  cityName: string,
  stateUf: string,
): string {
  const { streetLine } = formatHubAddressLines(addressFull, cityName, stateUf);
  const city = cityName.trim();
  const uf = stateUf.trim().toUpperCase();
  const tail = city && uf ? `${city} - ${uf}` : city || uf || "—";
  if (!streetLine || streetLine === "—") {
    return tail;
  }
  return `${streetLine}, ${tail}`;
}
