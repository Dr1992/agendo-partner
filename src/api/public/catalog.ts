import { apiGet, apiUrl } from "../http";
import type { ServiceCategory } from "../../types/category";
import type {
  Establishment,
  EstablishmentDetail,
} from "../../types/establishment";
import type { Professional } from "../../types/professional";
import type { ServiceOffering } from "../../types/service";

type CategoriesApiResponse = {
  data: {
    id: string;
    label: string;
    description?: string | null;
    icon?: string | null;
  }[];
};

export async function fetchCategoriesFromApi(): Promise<ServiceCategory[]> {
  const categoriesResponse = await apiGet<CategoriesApiResponse>("/categories");
  return categoriesResponse.data.map((row) => ({
    id: row.id,
    label: row.label,
    description: row.description ?? "",
    icon: row.icon ?? "ellipse",
  }));
}

type EstablishmentListRow = Establishment & {
  city?: string | null;
  state?: string | null;
  thumbnailUrl?: string;
  latitude?: number;
  longitude?: number;
};

type EstablishmentsApiResponse = {
  data: EstablishmentListRow[];
  limit: number;
  offset: number;
  total: number;
};

export async function fetchAllEstablishmentsFromApi(opts?: {
  userLocation?: { latitude: number; longitude: number } | null;
}): Promise<EstablishmentListRow[]> {
  const out: EstablishmentListRow[] = [];
  let offset = 0;
  const limit = 50;
  const userLocation =
    opts?.userLocation != null &&
    Number.isFinite(opts.userLocation.latitude) &&
    Number.isFinite(opts.userLocation.longitude)
      ? opts.userLocation
      : undefined;
  for (;;) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (userLocation) {
      params.set("userLat", String(userLocation.latitude));
      params.set("userLng", String(userLocation.longitude));
    }
    const establishmentsPage = await apiGet<EstablishmentsApiResponse>(
      `/establishments?${params.toString()}`,
    );
    out.push(...establishmentsPage.data);
    if (establishmentsPage.data.length < limit) {
      break;
    }
    offset += limit;
    if (offset > 10_000) {
      break;
    }
  }
  return out;
}

export type FetchEstablishmentsByCategoryOptions = {
  manualRegion?: { cityName: string; stateUf: string } | null;
  userLocation?: { latitude: number; longitude: number } | null;
};

function normalizeCityLabel(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toEstablishmentCard(row: EstablishmentListRow): Establishment {
  return {
    addressShort: row.addressShort,
    categoryIds: row.categoryIds,
    categoryLabel: row.categoryLabel,
    currency: row.currency,
    distanceKm: row.distanceKm,
    id: row.id,
    name: row.name,
    nextSlotLabel: row.nextSlotLabel,
    priceFrom: row.priceFrom,
    rating: row.rating,
    reviewCount: row.reviewCount,
    thumbnailUrl: row.thumbnailUrl,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export async function fetchEstablishmentsByCategoryFromApi(
  categoryId: string,
  opts?: FetchEstablishmentsByCategoryOptions | null,
): Promise<Establishment[]> {
  const userLocation =
    opts?.userLocation != null &&
    Number.isFinite(opts.userLocation.latitude) &&
    Number.isFinite(opts.userLocation.longitude)
      ? opts.userLocation
      : undefined;
  const pool = (
    await fetchAllEstablishmentsFromApi({
      userLocation: userLocation ?? null,
    })
  ).filter((e) => e.categoryIds.includes(categoryId));

  const manualRaw = opts?.manualRegion;
  const manualRegion =
    !userLocation && manualRaw?.stateUf?.trim() && manualRaw?.cityName?.trim()
      ? {
          cityName: manualRaw.cityName.trim(),
          stateUf: manualRaw.stateUf.trim().toUpperCase(),
        }
      : undefined;

  let filtered = pool;
  if (manualRegion) {
    const uf = manualRegion.stateUf;
    const city = normalizeCityLabel(manualRegion.cityName);
    filtered = pool.filter((e) => {
      const rowUf = (e.state ?? "").trim().toUpperCase();
      const rowCity = normalizeCityLabel(e.city ?? "");
      return rowUf === uf && rowCity === city;
    });
  }

  const rows = filtered.map(toEstablishmentCard);

  if (userLocation != null) {
    return [...rows].sort((a, b) => a.distanceKm - b.distanceKm);
  }
  return rows;
}

type ApiService = Omit<ServiceOffering, "professionalIds"> & {
  professionalIds: string[];
};

type ApiEstablishmentDetail = Omit<
  EstablishmentDetail,
  "professionals" | "services"
> & {
  professionals: Professional[];
  services: ApiService[];
};

function normalizeEstablishmentDetail(
  raw: ApiEstablishmentDetail,
): EstablishmentDetail {
  const professionals =
    raw.professionals.length > 0
      ? raw.professionals
      : [{ id: "any", name: "Qualquer profissional" }];

  const services: ServiceOffering[] = raw.services.map((s) => ({
    ...s,
    professionalIds: s.professionalIds.length > 0 ? s.professionalIds : ["any"],
  }));

  return {
    ...raw,
    isActive: raw.isActive !== false,
    professionals,
    services,
  };
}

export async function fetchEstablishmentDetailFromApi(
  establishmentId: string,
): Promise<EstablishmentDetail | null> {
  const res = await fetch(apiUrl(`/establishments/${establishmentId}`), {
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text.slice(0, 240) || `HTTP ${res.status}`);
  }
  const raw = (await res.json()) as ApiEstablishmentDetail;
  return normalizeEstablishmentDetail(raw);
}
