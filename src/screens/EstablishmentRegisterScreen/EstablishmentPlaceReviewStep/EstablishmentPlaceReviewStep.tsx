import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, View } from "react-native";

import { Button } from "../../../components/Button";
import {
  DetailFactsCard,
  type DetailFactRow,
} from "../../../components/DetailFactsCard/DetailFactsCard";
import { Text } from "../../../components/Text";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { formatCepDisplay, normalizeCepDigits } from "../../../utils/cep";
import { formatCnpjDisplay, normalizeCnpjDigits } from "../../../utils/cnpj";
import { formatBrazilPhoneDisplay } from "../../../utils/phone";

import type { EstablishmentGalleryPhoto } from "../useEstablishmentPlaceFormState";
import { getEstablishmentPlaceReviewStepStyles } from "./styles";

export type EstablishmentPlaceReviewStepProps = {
  addressLine: string;
  busy: boolean;
  categoryLabel: string | null;
  cepDigits: string;
  cityName: string;
  cnpj: string;
  description: string;
  instagramHandle: string;
  galleryPhotos: EstablishmentGalleryPhoto[];
  keywords?: readonly string[];
  mode: "create" | "edit";
  name: string;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
  openingHoursSummary: string;
  stateLabelRow: string | null;
  stateUf: string;
  whatsappDigits: string;
};

export function EstablishmentPlaceReviewStep({
  addressLine,
  busy,
  categoryLabel,
  cepDigits,
  cityName,
  cnpj,
  description,
  galleryPhotos,
  instagramHandle,
  keywords,
  mode,
  name,
  onBack,
  onSubmit,
  openingHoursSummary,
  stateLabelRow,
  stateUf,
  whatsappDigits,
}: EstablishmentPlaceReviewStepProps) {
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getEstablishmentPlaceReviewStepStyles(theme),
    [theme],
  );

  const locationLine = useMemo(() => {
    const city = cityName.trim();
    if (stateLabelRow) {
      return `${city} — ${stateLabelRow} (${stateUf.toUpperCase()})`;
    }
    if (stateUf) {
      return `${city} / ${stateUf.toUpperCase()}`;
    }
    return city;
  }, [cityName, stateLabelRow, stateUf]);

  const summaryRows = useMemo((): DetailFactRow[] => {
    const cnpjDigits = normalizeCnpjDigits(cnpj);
    const phoneDigits = whatsappDigits.replace(/\D/g, "");
    return [
      {
        emphasis: true,
        icon: "storefront-outline",
        label: t("placeForm.rowNameLabel"),
        value: name.trim() || "—",
      },
      {
        icon: "pricetag-outline",
        label: t("placeForm.rowCategoryLabel"),
        value: categoryLabel?.trim() || "—",
      },
      {
        icon: "location-outline",
        label: t("placeForm.rowLocationLabel"),
        value: locationLine.trim() || "—",
      },
      {
        icon: "map-outline",
        label: t("placeForm.rowCepLabel"),
        value: formatCepDisplay(cepDigits) || "—",
      },
      {
        icon: "navigate-outline",
        label: t("placeForm.rowAddressLabel"),
        value: addressLine.trim() || "—",
      },
      {
        icon: "time-outline",
        label: t("placeForm.rowHoursLabel"),
        value: openingHoursSummary.trim() || "—",
      },
      {
        icon: "id-card-outline",
        label: t("placeForm.rowCnpjLabel"),
        value:
          cnpjDigits.length > 0
            ? formatCnpjDisplay(cnpj)
            : t("placeForm.rowCnpjEmpty"),
      },
      {
        icon: "call-outline",
        label: t("placeForm.rowPhoneLabel"),
        value:
          phoneDigits.length > 0
            ? formatBrazilPhoneDisplay(whatsappDigits)
            : "—",
      },
      {
        icon: "logo-instagram",
        label: "Instagram",
        value: instagramHandle.trim() || "—",
      },
      {
        icon: "reader-outline",
        label: t("placeForm.rowDescriptionLabel"),
        value:
          description.trim().length > 0
            ? description.trim()
            : t("placeForm.rowDescriptionEmpty"),
      },
      {
        icon: "pricetags-outline",
        label: t("placeForm.rowKeywordsLabel"),
        value:
          keywords && keywords.length > 0
            ? keywords.join(", ")
            : t("placeForm.rowKeywordsEmpty"),
      },
    ];
  }, [
    addressLine,
    categoryLabel,
    cepDigits,
    cnpj,
    description,
    keywords,
    locationLine,
    name,
    openingHoursSummary,
    whatsappDigits,
    t,
  ]);

  return (
    <>
      <View style={styles.heroRow}>
        <View style={styles.titleIconWrap}>
          <Ionicons
            color={theme.accent}
            name="checkmark-circle-outline"
            size={26}
          />
        </View>
        <Text style={styles.intro} variant="bodyTight">
          {mode === "edit"
            ? t("placeForm.reviewIntroEdit")
            : t("placeForm.reviewIntroCreate")}
        </Text>
      </View>

      <DetailFactsCard compactTop rows={summaryRows} />

      <View style={styles.photoCard}>
        <View style={styles.photoCardHeader}>
          <Ionicons color={theme.accent} name="images-outline" size={20} />
          <Text style={styles.photoCardTitle} variant="bodyTight">
            {t("placeForm.photosTitle")}
          </Text>
        </View>
        {galleryPhotos.length === 0 ? (
          <Text style={styles.photoEmpty} variant="bodyTight">
            {t("placeForm.photosEmpty")}
          </Text>
        ) : (
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            style={styles.photoRow}
            contentContainerStyle={styles.photoRowContent}
          >
            {galleryPhotos.map((photo) => (
              <View key={photo.id} style={styles.photoThumbWrap}>
                <Image
                  accessibilityIgnoresInvertColors
                  source={{ uri: photo.previewUri }}
                  style={styles.photoThumb}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.actions}>
        <Button loading={busy} onPress={() => void onSubmit()}>
          {mode === "edit"
            ? t("placeForm.primaryCtaEdit")
            : t("placeForm.primaryCtaCreate")}
        </Button>
        <Button disabled={busy} variant="outline" onPress={onBack}>
          {t("placeForm.backButton")}
        </Button>
      </View>
    </>
  );
}
