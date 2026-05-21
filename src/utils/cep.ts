/** Consulta CEP via ViaCEP (serviço público, sem chave). Alternativa: BrasilAPI (`/api/cep/v1/{cep}`). */

export function normalizeCepDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, 8);
}

export function formatCepDisplay(digits: string): string {
  const normalized = normalizeCepDigits(digits);
  if (normalized.length <= 5) {
    return normalized;
  }
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

type ViaCepJson = {
  bairro?: string;
  erro?: boolean;
  localidade?: string;
  logradouro?: string;
  uf?: string;
};

export type ViaCepAddress = {
  bairro: string;
  localidade: string;
  logradouro: string;
  uf: string;
};

function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

/** Devolve o nome da cidade como na lista interna, ou null se não houver match. */
export function matchCityInAgendoList(
  uf: string,
  localidade: string,
  citiesInUf: string[],
): string | null {
  const target = fold(localidade);
  const hit = citiesInUf.find((c) => fold(c) === target);
  return hit ?? null;
}

export async function fetchViaCep(
  cepDigits: string,
  opts?: { signal?: AbortSignal },
): Promise<{ data: ViaCepAddress; ok: true } | { message: string; ok: false }> {
  const cep = normalizeCepDigits(cepDigits);
  if (cep.length !== 8) {
    return { ok: false, message: "CEP deve ter 8 dígitos." };
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: opts?.signal,
    });
    if (opts?.signal?.aborted) {
      return { ok: false, message: "" };
    }
    if (!res.ok) {
      return { ok: false, message: "Não foi possível consultar o CEP." };
    }
    const viaCepJson = (await res.json()) as ViaCepJson;
    if (opts?.signal?.aborted) {
      return { ok: false, message: "" };
    }
    if (viaCepJson.erro === true || !viaCepJson.uf || !viaCepJson.localidade) {
      return { ok: false, message: "CEP não encontrado." };
    }
    return {
      ok: true,
      data: {
        bairro: (viaCepJson.bairro ?? "").trim(),
        localidade: viaCepJson.localidade.trim(),
        logradouro: (viaCepJson.logradouro ?? "").trim(),
        uf: viaCepJson.uf.trim().toUpperCase().slice(0, 2),
      },
    };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, message: "" };
    }
    return {
      ok: false,
      message: "Falha na rede ao buscar o CEP. Tente de novo.",
    };
  }
}

/** Linha única para o campo `addressLine` no servidor (sem CEP — vai em `postalCode`). */
export function buildEstablishmentAddressLine(
  street: string,
  number: string,
  neighborhood: string,
): string {
  const streetTrim = street.trim();
  const numberTrim = number.trim();
  const neighborhoodTrim = neighborhood.trim();
  const head =
    streetTrim && numberTrim
      ? `${streetTrim}, ${numberTrim}`
      : streetTrim || numberTrim;
  if (head && neighborhoodTrim) {
    return `${head} · ${neighborhoodTrim}`;
  }
  return head || neighborhoodTrim;
}
