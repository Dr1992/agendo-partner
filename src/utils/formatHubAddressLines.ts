function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * O `addressFull` da API costuma ser `logradouro, cidade, UF, CEP`.
 * Devolve a parte do logradouro e uma linha "Cidade · UF" para exibição.
 */
export function formatHubAddressLines(
  addressFull: string,
  cityName: string,
  stateUf: string,
): { cityUfLine: string; streetLine: string } {
  const full = addressFull.trim();
  const city = cityName.trim();
  const uf = stateUf.trim().toUpperCase();

  if (!full) {
    return {
      cityUfLine: city ? `${city} · ${uf}` : "—",
      streetLine: "—",
    };
  }

  if (!city || !uf) {
    return { cityUfLine: city || uf || "—", streetLine: full };
  }

  const tail = new RegExp(
    `,\\s*${escapeRegExp(city)}\\s*,\\s*${escapeRegExp(uf)}\\s*(,\\s*[\\d-]+)?$`,
    "i",
  );
  const streetLine = full.replace(tail, "").trim() || full;
  return {
    cityUfLine: `${city} · ${uf}`,
    streetLine,
  };
}
