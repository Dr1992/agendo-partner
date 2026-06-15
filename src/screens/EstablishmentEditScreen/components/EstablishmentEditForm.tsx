import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { Button } from "../../../components/Button";
import { KeywordsInput } from "../../../components/KeywordsInput";
import { Text } from "../../../components/Text";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { formatCepDisplay, normalizeCepDigits } from "../../../utils/cep";
import { formatCnpjDisplay, normalizeCnpjDigits } from "../../../utils/cnpj";
import {
  formatBrazilPhoneDisplay,
  normalizePhoneDigits,
} from "../../../utils/phone";
import { EstablishmentRegisterGallery } from "../../EstablishmentRegisterScreen/EstablishmentRegisterGallery/EstablishmentRegisterGallery";
import type {
  AddressLocksState,
  EstablishmentGalleryPhoto,
} from "../../EstablishmentRegisterScreen/useEstablishmentPlaceFormState";
import { getEstablishmentEditScreenStyles } from "../styles";

export type EstablishmentEditFormProps = {
  addrLocks: AddressLocksState;
  addressNumber: string;
  canStep0: boolean;
  categoryLabel: string | null;
  cepDigits: string;
  cepLookupBusy: boolean;
  cityName: string;
  cnpj: string;
  description: string;
  galleryPhotos: EstablishmentGalleryPhoto[];
  galleryUploadBusy: boolean;
  keywords: readonly string[];
  name: string;
  neighborhood: string;
  openingHoursSummary: string;
  stateLabelRow: string | null;
  stateUf: string;
  street: string;
  whatsappDigits: string;
  onAddressNumberChange: (v: string) => void;
  onCepDigitsChange: (digits: string) => void;
  onCnpjChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onGalleryAddPress: () => void;
  onGalleryRemove: (id: string) => void;
  onKeywordsChange: (keywords: string[]) => void;
  onNameChange: (v: string) => void;
  onNeighborhoodChange: (v: string) => void;
  onNext: () => void;
  onOpenCategoryModal: () => void;
  onOpenCityModal: () => void;
  onOpenHoursModal: () => void;
  onOpenStateModal: () => void;
  onStreetChange: (v: string) => void;
  instagramHandle: string;
  onInstagramChange: (v: string) => void;
  onWhatsappChange: (v: string) => void;
};

export function EstablishmentEditForm({
  addrLocks,
  addressNumber,
  canStep0,
  categoryLabel,
  cepDigits,
  cepLookupBusy,
  cityName,
  cnpj,
  description,
  galleryPhotos,
  galleryUploadBusy,
  keywords,
  name,
  neighborhood,
  openingHoursSummary,
  stateLabelRow,
  stateUf,
  street,
  whatsappDigits,
  onAddressNumberChange,
  onCepDigitsChange,
  onCnpjChange,
  onDescriptionChange,
  onGalleryAddPress,
  onGalleryRemove,
  onKeywordsChange,
  onNameChange,
  onNeighborhoodChange,
  onNext,
  onOpenCategoryModal,
  onOpenCityModal,
  onOpenHoursModal,
  onOpenStateModal,
  instagramHandle,
  onInstagramChange,
  onStreetChange,
  onWhatsappChange,
}: EstablishmentEditFormProps) {
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = getEstablishmentEditScreenStyles(theme);

  const stateDisplay = stateLabelRow
    ? `${stateLabelRow} (${stateUf})`
    : stateUf || null;

  return (
    <>
      {/* Identidade */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons color={theme.accent} name="storefront-outline" size={18} />
        </View>
        <Text style={styles.sectionHeaderLabel} variant="bodyTight">
          Identidade
        </Text>
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldRowLabel} variant="caption">
            Nome do local
          </Text>
          <TextInput
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Ex.: Studio Aurora"
            placeholderTextColor={theme.textHint}
            spellCheck={false}
            style={styles.fieldRowInput}
            value={name}
            onChangeText={onNameChange}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.fieldRow,
            pressed && styles.fieldRowPressed,
          ]}
          onPress={onOpenCategoryModal}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Categoria
          </Text>
          <View style={styles.fieldRowSelectBody}>
            <Text
              style={
                categoryLabel
                  ? styles.fieldRowSelectValue
                  : styles.fieldRowSelectPlaceholder
              }
              variant="bodyTight"
            >
              {categoryLabel ?? "Selecionar categoria"}
            </Text>
            <Ionicons color={theme.textHint} name="chevron-down" size={18} />
          </View>
        </Pressable>
        <View style={[styles.fieldRow, styles.fieldRowLast]}>
          <Text style={styles.fieldRowLabel} variant="caption">
            Descrição (opcional)
          </Text>
          <TextInput
            multiline
            maxLength={150}
            placeholder="Conte o que você oferece"
            placeholderTextColor={theme.textHint}
            style={[styles.fieldRowInput, styles.fieldRowMultiline]}
            value={description}
            onChangeText={onDescriptionChange}
          />
          <Text style={styles.charCount} variant="caption">
            {description.length} / 150
          </Text>
        </View>
      </View>

      {/* Descoberta na busca */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons color={theme.accent} name="pricetags-outline" size={18} />
        </View>
        <Text style={styles.sectionHeaderLabel} variant="bodyTight">
          {t("edit.keywordsSectionTitle")}
        </Text>
      </View>
      <Text style={styles.keywordsHint} variant="hint">
        {t("edit.keywordsHint")}
      </Text>
      <KeywordsInput
        placeholder={t("edit.keywordsPlaceholder")}
        removeAccessibilityLabel={t("edit.keywordRemove")}
        value={keywords}
        onChange={onKeywordsChange}
      />

      {/* Localização */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons color={theme.accent} name="location-outline" size={18} />
        </View>
        <Text style={styles.sectionHeaderLabel} variant="bodyTight">
          Localização
        </Text>
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldRowLabel} variant="caption">
            CEP
          </Text>
          <View style={styles.cepRow}>
            <TextInput
              editable={!cepLookupBusy}
              keyboardType="number-pad"
              maxLength={9}
              placeholder="00000-000"
              placeholderTextColor={theme.textHint}
              style={[
                styles.fieldRowInput,
                styles.cepInput,
                cepLookupBusy && styles.fieldRowDimmed,
              ]}
              value={formatCepDisplay(cepDigits)}
              onChangeText={(v) => onCepDigitsChange(normalizeCepDigits(v))}
            />
            {cepLookupBusy ? (
              <ActivityIndicator color={theme.accent} size="small" />
            ) : null}
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={cepLookupBusy || addrLocks.state}
          style={({ pressed }) => [
            styles.fieldRow,
            (cepLookupBusy || addrLocks.state) && styles.fieldRowDimmed,
            pressed &&
              !cepLookupBusy &&
              !addrLocks.state &&
              styles.fieldRowPressed,
          ]}
          onPress={() => {
            if (!cepLookupBusy && !addrLocks.state) {
              onOpenStateModal();
            }
          }}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Estado
          </Text>
          <View style={styles.fieldRowSelectBody}>
            <Text
              style={
                stateDisplay
                  ? styles.fieldRowSelectValue
                  : styles.fieldRowSelectPlaceholder
              }
              variant="bodyTight"
            >
              {stateDisplay ?? "Selecionar estado"}
            </Text>
            <Ionicons color={theme.textHint} name="chevron-down" size={18} />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={cepLookupBusy || !stateUf || addrLocks.city}
          style={({ pressed }) => [
            styles.fieldRow,
            (cepLookupBusy || !stateUf || addrLocks.city) &&
              styles.fieldRowDimmed,
            pressed &&
              !cepLookupBusy &&
              !!stateUf &&
              !addrLocks.city &&
              styles.fieldRowPressed,
          ]}
          onPress={() => {
            if (!cepLookupBusy && stateUf && !addrLocks.city) {
              onOpenCityModal();
            }
          }}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Cidade
          </Text>
          <View style={styles.fieldRowSelectBody}>
            <Text
              style={
                cityName
                  ? styles.fieldRowSelectValue
                  : styles.fieldRowSelectPlaceholder
              }
              variant="bodyTight"
            >
              {cityName || "Selecionar cidade"}
            </Text>
            <Ionicons color={theme.textHint} name="chevron-down" size={18} />
          </View>
        </Pressable>
        <View
          style={[
            styles.fieldRow,
            (cepLookupBusy || addrLocks.street) && styles.fieldRowDimmed,
          ]}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Logradouro
          </Text>
          <TextInput
            autoCapitalize="words"
            editable={!cepLookupBusy && !addrLocks.street}
            placeholder="Ex.: Rua das Flores"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={street}
            onChangeText={onStreetChange}
          />
        </View>
        <View style={[styles.fieldRow, cepLookupBusy && styles.fieldRowDimmed]}>
          <Text style={styles.fieldRowLabel} variant="caption">
            Número
          </Text>
          <TextInput
            editable={!cepLookupBusy}
            placeholder="Ex.: 1200"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={addressNumber}
            onChangeText={onAddressNumberChange}
          />
        </View>
        <View
          style={[
            styles.fieldRow,
            styles.fieldRowLast,
            (cepLookupBusy || addrLocks.neighborhood) && styles.fieldRowDimmed,
          ]}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Bairro
          </Text>
          <TextInput
            autoCapitalize="words"
            editable={!cepLookupBusy && !addrLocks.neighborhood}
            placeholder="Ex.: Centro"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={neighborhood}
            onChangeText={onNeighborhoodChange}
          />
        </View>
      </View>

      {/* Contato & Horários */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons color={theme.accent} name="call-outline" size={18} />
        </View>
        <Text style={styles.sectionHeaderLabel} variant="bodyTight">
          Contato & Horários
        </Text>
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldRowLabel} variant="caption">
            Celular (WhatsApp)
          </Text>
          <TextInput
            keyboardType="phone-pad"
            maxLength={15}
            placeholder="(11) 98765-4321"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={formatBrazilPhoneDisplay(whatsappDigits)}
            onChangeText={(v) => onWhatsappChange(normalizePhoneDigits(v, 11))}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.fieldRow,
            pressed && styles.fieldRowPressed,
          ]}
          onPress={onOpenHoursModal}
        >
          <Text style={styles.fieldRowLabel} variant="caption">
            Horário de funcionamento
          </Text>
          <View style={styles.fieldRowSelectBody}>
            <Text
              style={
                openingHoursSummary
                  ? styles.fieldRowSelectValue
                  : styles.fieldRowSelectPlaceholder
              }
              variant="bodyTight"
            >
              {openingHoursSummary || "Toque para definir dias e horários"}
            </Text>
            <Ionicons color={theme.textHint} name="chevron-forward" size={18} />
          </View>
        </Pressable>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldRowLabel} variant="caption">
            CNPJ (opcional)
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={18}
            placeholder="00.000.000/0000-00"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={formatCnpjDisplay(cnpj)}
            onChangeText={(v) => onCnpjChange(normalizeCnpjDigits(v))}
          />
        </View>
        <View style={[styles.fieldRow, styles.fieldRowLast]}>
          <Text style={styles.fieldRowLabel} variant="caption">
            {t("edit.instagramLabel")}
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            maxLength={100}
            placeholder="@seuperfil"
            placeholderTextColor={theme.textHint}
            style={styles.fieldRowInput}
            value={instagramHandle}
            onChangeText={onInstagramChange}
          />
        </View>
      </View>

      {/* Fotos */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons color={theme.accent} name="images-outline" size={18} />
        </View>
        <Text style={styles.sectionHeaderLabel} variant="bodyTight">
          Fotos do local
        </Text>
      </View>
      <View style={styles.sectionCard}>
        <View style={[styles.fieldRow, styles.fieldRowLast, styles.galleryPad]}>
          <EstablishmentRegisterGallery
            busy={galleryUploadBusy}
            photos={galleryPhotos}
            readOnly={false}
            onPressAdd={onGalleryAddPress}
            onRemove={onGalleryRemove}
          />
        </View>
      </View>

      <Button disabled={!canStep0} onPress={onNext}>
        Continuar
      </Button>
    </>
  );
}
