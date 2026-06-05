import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BRAZIL_CITIES_BY_UF,
  BRAZIL_STATES,
  type BrazilState,
} from "../../data/brazilRegions";
import type { ServiceCategory } from "../../types/category";
import type { EstablishmentDetail } from "../../types/establishment";
import {
  buildEstablishmentAddressLine,
  fetchViaCep,
  matchCityInAgendoList,
  normalizeCepDigits,
} from "../../utils/cep";
import { isValidCnpj } from "../../utils/cnpj";
import { parseStoredEstablishmentAddressLine } from "../../utils/parseStoredEstablishmentAddressLine";
import {
  createDefaultOpeningSchedule,
  isOpeningScheduleValid,
  scheduleToSummary,
  type DaySlot,
} from "../../utils/openingHours";
import {
  isValidBrazilCellPhoneDigits,
  normalizePhoneDigits,
} from "../../utils/phone";

export type AddressLocksState = {
  city: boolean;
  neighborhood: boolean;
  state: boolean;
  street: boolean;
};

export type EstablishmentGalleryPhoto = {
  id: string;
  previewUri: string;
  /** Vazio quando a miniatura veio só do servidor (edição). */
  storageKey: string;
};

export type EstablishmentPlaceFormOptions = {
  /** Cadastro novo: obriga 1–5 fotos enviadas antes de continuar. */
  requireEstablishmentPhotos?: boolean;
  /** Edição: exige pelo menos N fotos na lista (ex.: 1). */
  minimumGalleryPhotos?: number;
};

export function useEstablishmentPlaceFormState(
  apiCategories: ServiceCategory[],
  options: EstablishmentPlaceFormOptions = {},
) {
  const { t } = useTranslation("partner");
  const requireEstablishmentPhotos =
    options.requireEstablishmentPhotos === true;
  const minimumGalleryPhotos = options.minimumGalleryPhotos;
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cityName, setCityName] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [cepDigits, setCepDigits] = useState("");
  const [street, setStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [cepLookupBusy, setCepLookupBusy] = useState(false);
  const [addrLocks, setAddrLocks] = useState<AddressLocksState>({
    city: false,
    neighborhood: false,
    state: false,
    street: false,
  });
  const [openingSchedule, setOpeningSchedule] = useState<DaySlot[]>(() =>
    createDefaultOpeningSchedule(),
  );
  const [cnpj, setCnpj] = useState("");
  const [whatsappDigits, setWhatsappDigits] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<
    EstablishmentGalleryPhoto[]
  >([]);
  const [placeFormAlert, setPlaceFormAlert] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const cepFetchGen = useRef(0);
  const dismissPlaceFormAlert = useCallback(() => {
    setPlaceFormAlert(null);
  }, []);

  const category = useMemo(
    () => apiCategories.find((category) => category.id === categoryId),
    [apiCategories, categoryId],
  );

  const stateLabelRow = useMemo(
    () => BRAZIL_STATES.find((state) => state.uf === stateUf)?.label,
    [stateUf],
  );

  const citiesForState = stateUf ? (BRAZIL_CITIES_BY_UF[stateUf] ?? []) : [];

  const addressLine = useMemo(
    () => buildEstablishmentAddressLine(street, addressNumber, neighborhood),
    [street, addressNumber, neighborhood],
  );

  const openingHoursSummary = useMemo(
    () => scheduleToSummary(openingSchedule),
    [openingSchedule],
  );

  const onPickState = useCallback(
    (s: BrazilState) => {
      if (addrLocks.state) {
        return;
      }
      setStateUf(s.uf);
      setCityName("");
    },
    [addrLocks.state],
  );

  useEffect(() => {
    const runId = ++cepFetchGen.current;
    const abortController = new AbortController();
    const normalizedCep = normalizeCepDigits(cepDigits);

    if (normalizedCep.length < 8) {
      setAddrLocks({
        city: false,
        neighborhood: false,
        state: false,
        street: false,
      });
      return () => {
        abortController.abort();
        setCepLookupBusy(false);
      };
    }

    void (async () => {
      setCepLookupBusy(true);
      const viaCepResult = await fetchViaCep(normalizedCep, {
        signal: abortController.signal,
      });
      if (runId !== cepFetchGen.current) {
        return;
      }
      setCepLookupBusy(false);

      if (!viaCepResult.ok) {
        if (viaCepResult.message) {
          setPlaceFormAlert({
            title: t("placeForm.cepAlertTitle"),
            message: viaCepResult.message,
          });
        }
        setAddrLocks({
          city: false,
          neighborhood: false,
          state: false,
          street: false,
        });
        return;
      }

      setStateUf(viaCepResult.data.uf);
      setStreet(viaCepResult.data.logradouro);
      setNeighborhood(viaCepResult.data.bairro);

      const cities = BRAZIL_CITIES_BY_UF[viaCepResult.data.uf] ?? [];
      const matched = matchCityInAgendoList(
        viaCepResult.data.uf,
        viaCepResult.data.localidade,
        cities,
      );
      if (matched) {
        setCityName(matched);
      } else {
        setCityName("");
        setPlaceFormAlert({
          title: t("placeForm.cityAlertTitle"),
          message: t("placeForm.cityAlertMessage", {
            location: viaCepResult.data.localidade,
            uf: viaCepResult.data.uf,
          }),
        });
      }

      setAddrLocks({
        street: viaCepResult.data.logradouro.length > 0,
        neighborhood: viaCepResult.data.bairro.length > 0,
        state: Boolean(viaCepResult.data.uf),
        city: Boolean(matched),
      });
    })();

    return () => {
      abortController.abort();
      setCepLookupBusy(false);
    };
  }, [cepDigits, t]);

  const cnpjDigitsOnly = useMemo(() => cnpj.replace(/\D/g, ""), [cnpj]);
  const cnpjOk = cnpjDigitsOnly.length === 0 || isValidCnpj(cnpjDigitsOnly);

  const galleryStepOk = useMemo(() => {
    if (requireEstablishmentPhotos) {
      return (
        galleryPhotos.length >= 1 &&
        galleryPhotos.length <= 5 &&
        galleryPhotos.every((photo) => photo.storageKey.length > 0)
      );
    }
    if (minimumGalleryPhotos != null && minimumGalleryPhotos > 0) {
      return (
        galleryPhotos.length >= minimumGalleryPhotos &&
        galleryPhotos.length <= 5 &&
        galleryPhotos.every((photo) => photo.storageKey.length > 0)
      );
    }
    return true;
  }, [galleryPhotos, minimumGalleryPhotos, requireEstablishmentPhotos]);

  const canStep0 = Boolean(
    name.trim().length >= 2 &&
    categoryId &&
    cityName.trim().length >= 2 &&
    stateUf.length === 2 &&
    normalizeCepDigits(cepDigits).length === 8 &&
    street.trim().length >= 2 &&
    addressNumber.trim().length >= 1 &&
    neighborhood.trim().length >= 2 &&
    addressLine.trim().length >= 8 &&
    isOpeningScheduleValid(openingSchedule) &&
    cnpjOk &&
    isValidBrazilCellPhoneDigits(whatsappDigits) &&
    galleryStepOk,
  );

  const hydrateFromEstablishment = useCallback((est: EstablishmentDetail) => {
    setStep(0);
    setName(est.name);
    setDescription(est.description ?? "");
    setKeywords([...(est.keywords ?? [])]);
    setCategoryId(est.categoryIds[0] ?? null);
    setCityName(est.cityName);
    setStateUf(est.stateUf);
    setCepDigits((est.postalCode ?? "").replace(/\D/g, "").slice(0, 8));
    const parsed = parseStoredEstablishmentAddressLine(
      est.partnerStreetLine ?? "",
    );
    setStreet(parsed.street);
    setAddressNumber(parsed.addressNumber);
    setNeighborhood(parsed.neighborhood);
    setAddrLocks({
      city: false,
      neighborhood: false,
      state: false,
      street: false,
    });
    if (
      est.openingSchedule &&
      Array.isArray(est.openingSchedule) &&
      est.openingSchedule.length === 7
    ) {
      setOpeningSchedule(est.openingSchedule);
    } else {
      setOpeningSchedule(createDefaultOpeningSchedule());
    }
    setCnpj("");
    setWhatsappDigits(normalizePhoneDigits(est.whatsapp ?? "", 11));
    if (est.galleryPhotoItems && est.galleryPhotoItems.length > 0) {
      setGalleryPhotos(
        est.galleryPhotoItems.map((item) => ({
          id: item.id,
          previewUri: item.url,
          storageKey: item.storageKey,
        })),
      );
    } else if (est.galleryPhotoUrls && est.galleryPhotoUrls.length > 0) {
      setGalleryPhotos(
        est.galleryPhotoUrls.map((url, index) => ({
          id: `loaded-${index}-${url.slice(-24)}`,
          previewUri: url,
          storageKey: "",
        })),
      );
    } else {
      setGalleryPhotos([]);
    }
  }, []);

  const addGalleryPhoto = useCallback(
    (photo: { previewUri: string; storageKey: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      setGalleryPhotos((prev) => [...prev, { id, ...photo }]);
    },
    [],
  );

  const removeGalleryPhoto = useCallback((id: string) => {
    setGalleryPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }, []);

  return {
    addrLocks,
    addressLine,
    addressNumber,
    addGalleryPhoto,
    canStep0,
    category,
    categoryId,
    cepDigits,
    cepLookupBusy,
    citiesForState,
    cityName,
    cnpj,
    cnpjDigitsOnly,
    cnpjOk,
    description,
    dismissPlaceFormAlert,
    galleryPhotos,
    hydrateFromEstablishment,
    keywords,
    name,
    neighborhood,
    onPickState,
    placeFormAlert,
    removeGalleryPhoto,
    openingHoursSummary,
    openingSchedule,
    setAddressNumber,
    setCategoryId,
    setCepDigits,
    setCnpj,
    setDescription,
    setKeywords,
    setName,
    setCityName,
    setNeighborhood,
    setOpeningSchedule,
    setStep,
    setStreet,
    setWhatsappDigits,
    stateLabelRow,
    stateUf,
    step,
    street,
    whatsappDigits,
  };
}
