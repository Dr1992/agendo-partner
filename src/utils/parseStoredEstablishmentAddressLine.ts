const NEIGHBORHOOD_SEP = " · ";

/**
 * Reverte o formato de `buildEstablishmentAddressLine` (rua, número · bairro)
 * guardado em `establishment.address_line` para os três campos do formulário.
 */
export function parseStoredEstablishmentAddressLine(addressLine: string): {
  addressNumber: string;
  neighborhood: string;
  street: string;
} {
  const line = addressLine.trim();
  if (!line) {
    return { addressNumber: "", neighborhood: "", street: "" };
  }
  const sepIdx = line.lastIndexOf(NEIGHBORHOOD_SEP);
  if (sepIdx === -1) {
    return { addressNumber: "", neighborhood: "", street: line };
  }
  const neighborhood = line.slice(sepIdx + NEIGHBORHOOD_SEP.length).trim();
  const head = line.slice(0, sepIdx).trim();
  const lastComma = head.lastIndexOf(",");
  if (lastComma > 0) {
    return {
      street: head.slice(0, lastComma).trim(),
      addressNumber: head.slice(lastComma + 1).trim(),
      neighborhood,
    };
  }
  return { street: head, addressNumber: "", neighborhood };
}
