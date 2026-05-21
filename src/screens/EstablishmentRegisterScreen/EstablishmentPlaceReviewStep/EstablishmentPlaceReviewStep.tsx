import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
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

const REVIEW_INTRO: Record<"create" | "edit", string> = {
  create:
    "Confira os dados abaixo. Toque em Voltar para editar. Ao confirmar, o local é cadastrado e você segue na área do parceiro.",
  edit: "Confira os dados abaixo. Toque em Voltar para editar.",
};

/** Título no corpo e no header do stack no passo de revisão. */
export const ESTABLISHMENT_PLACE_REVIEW_NAV_TITLE: Record<
  "create" | "edit",
  string
> = {
  create: "Confirmar cadastro",
  edit: "Revisar e salvar",
};

/** Título do header no passo do formulário (alinhado ao `ProfileNavigator`). */
export const ESTABLISHMENT_PLACE_STEP0_NAV_TITLE: Record<
  "create" | "edit",
  string
> = {
  create: "Novo Estabelecimento",
  edit: "Editar estabelecimento",
};

const PRIMARY_CTA: Record<"create" | "edit", string> = {
  create: "Confirmar cadastro",
  edit: "Salvar alterações",
};

export type EstablishmentPlaceReviewStepProps = {
  addressLine: string;
  busy: boolean;
  categoryLabel: string | null;
  cepDigits: string;
  cityName: string;
  cnpj: string;
  description: string;
  galleryPhotos: EstablishmentGalleryPhoto[];
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
  mode,
  name,
  onBack,
  onSubmit,
  openingHoursSummary,
  stateLabelRow,
  stateUf,
  whatsappDigits,
}: EstablishmentPlaceReviewStepProps) {
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
        label: "Nome",
        value: name.trim() || "—",
      },
      {
        icon: "pricetag-outline",
        label: "Categoria",
        value: categoryLabel?.trim() || "—",
      },
      {
        icon: "location-outline",
        label: "Localização",
        value: locationLine.trim() || "—",
      },
      {
        icon: "map-outline",
        label: "CEP",
        value: formatCepDisplay(cepDigits) || "—",
      },
      {
        icon: "navigate-outline",
        label: "Endereço",
        value: addressLine.trim() || "—",
      },
      {
        icon: "time-outline",
        label: "Horário",
        value: openingHoursSummary.trim() || "—",
      },
      {
        icon: "id-card-outline",
        label: "CNPJ",
        value:
          cnpjDigits.length > 0 ? formatCnpjDisplay(cnpj) : "Não informado",
      },
      {
        icon: "call-outline",
        label: "Celular",
        value:
          phoneDigits.length > 0
            ? formatBrazilPhoneDisplay(whatsappDigits)
            : "—",
      },
      {
        icon: "reader-outline",
        label: "Descrição",
        value:
          description.trim().length > 0 ? description.trim() : "Não informada",
      },
    ];
  }, [
    addressLine,
    categoryLabel,
    cepDigits,
    cnpj,
    description,
    locationLine,
    name,
    openingHoursSummary,
    whatsappDigits,
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
          {REVIEW_INTRO[mode]}
        </Text>
      </View>

      <DetailFactsCard compactTop rows={summaryRows} />

      <View style={styles.photoCard}>
        <View style={styles.photoCardHeader}>
          <Ionicons color={theme.accent} name="images-outline" size={20} />
          <Text style={styles.photoCardTitle} variant="bodyTight">
            Fotos do local
          </Text>
        </View>
        {galleryPhotos.length === 0 ? (
          <Text style={styles.photoEmpty} variant="bodyTight">
            Nenhuma foto
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
          {PRIMARY_CTA[mode]}
        </Button>
        <Button disabled={busy} variant="outline" onPress={onBack}>
          Voltar
        </Button>
      </View>
    </>
  );
}
