import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TextInput, View } from "react-native";

import { Button } from "../../components/Button";
import { FormSelectRow } from "../../components/FormSelectRow";
import { Text } from "../../components/Text";
import { TextField } from "../../components/TextField";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatCepDisplay, normalizeCepDigits } from "../../utils/cep";
import { formatCnpjDisplay, normalizeCnpjDigits } from "../../utils/cnpj";
import {
  formatBrazilPhoneDisplay,
  normalizePhoneDigits,
} from "../../utils/phone";

import { EstablishmentPlaceReviewStep } from "./EstablishmentPlaceReviewStep";
import { EstablishmentRegisterGallery } from "./EstablishmentRegisterGallery/EstablishmentRegisterGallery";
import { getEstablishmentRegisterScreenStyles } from "./styles";
import type {
  AddressLocksState,
  EstablishmentGalleryPhoto,
} from "./useEstablishmentPlaceFormState";

export type { AddressLocksState };

export type EstablishmentRegisterFormProps = {
  addressLine: string;
  addressNumber: string;
  addrLocks: AddressLocksState;
  busy: boolean;
  canStep0: boolean;
  categoryLabel: string | null;
  cepDigits: string;
  cepLookupBusy: boolean;
  cityName: string;
  cnpj: string;
  description: string;
  galleryPhotos: EstablishmentGalleryPhoto[];
  galleryReadOnly: boolean;
  galleryUploadBusy: boolean;
  name: string;
  neighborhood: string;
  onAddressNumberChange: (t: string) => void;
  onBack: () => void;
  onCepDigitsChange: (digits: string) => void;
  onCnpjChange: (t: string) => void;
  onDescriptionChange: (t: string) => void;
  onGalleryAddPress: () => void;
  onGalleryRemove: (id: string) => void;
  onNameChange: (t: string) => void;
  onNeighborhoodChange: (t: string) => void;
  onNext: () => void;
  onOpenCategoryModal: () => void;
  onOpenCityModal: () => void;
  onOpenHoursModal: () => void;
  onOpenStateModal: () => void;
  onStreetChange: (t: string) => void;
  onSubmit: () => void | Promise<void>;
  onWhatsappChange: (t: string) => void;
  /** Igual ao cadastro; em `edit` o texto de revisão e o rótulo do botão mudam. */
  mode?: "create" | "edit";
  openingHoursSummary: string;
  stateLabelRow: string | null;
  stateUf: string;
  step: 0 | 1;
  street: string;
  whatsappDigits: string;
};

export function EstablishmentRegisterForm({
  addressLine,
  addressNumber,
  addrLocks,
  busy,
  canStep0,
  categoryLabel,
  cepDigits,
  cepLookupBusy,
  cityName,
  cnpj,
  description,
  galleryPhotos,
  galleryReadOnly,
  galleryUploadBusy,
  name,
  neighborhood,
  onAddressNumberChange,
  onBack,
  onCepDigitsChange,
  onCnpjChange,
  onDescriptionChange,
  onGalleryAddPress,
  onGalleryRemove,
  onNameChange,
  onNeighborhoodChange,
  onNext,
  onOpenCategoryModal,
  onOpenCityModal,
  onOpenHoursModal,
  onOpenStateModal,
  onStreetChange,
  onSubmit,
  onWhatsappChange,
  mode = "create",
  openingHoursSummary,
  stateLabelRow,
  stateUf,
  step,
  street,
  whatsappDigits,
}: EstablishmentRegisterFormProps) {
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getEstablishmentRegisterScreenStyles(theme),
    [theme],
  );

  if (step === 1) {
    return (
      <EstablishmentPlaceReviewStep
        addressLine={addressLine}
        busy={busy}
        categoryLabel={categoryLabel}
        cepDigits={cepDigits}
        cityName={cityName}
        cnpj={cnpj}
        description={description}
        galleryPhotos={galleryPhotos}
        mode={mode}
        name={name}
        openingHoursSummary={openingHoursSummary}
        stateLabelRow={stateLabelRow}
        stateUf={stateUf}
        whatsappDigits={whatsappDigits}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <>
      <TextField
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
        label={t("placeForm.fieldNameLabel")}
        placeholder={t("placeForm.fieldNamePlaceholder")}
        spellCheck={false}
        textContentType="none"
        value={name}
        onChangeText={onNameChange}
      />
      <Text variant="fieldLabel">{t("placeForm.fieldCategoryLabel")}</Text>
      <FormSelectRow
        displayText={categoryLabel ?? t("placeForm.selectCategory")}
        empty={!categoryLabel}
        onPress={onOpenCategoryModal}
      />
      <Text variant="fieldLabel">{t("placeForm.fieldCepLabel")}</Text>
      <View style={styles.cepRow}>
        <TextInput
          editable={!cepLookupBusy}
          keyboardType="number-pad"
          maxLength={9}
          placeholder={t("placeForm.cepPlaceholder")}
          placeholderTextColor={theme.textHint}
          style={[
            styles.field,
            styles.cepField,
            cepLookupBusy ? styles.fieldDimmed : null,
          ]}
          value={formatCepDisplay(cepDigits)}
          onChangeText={(t) => onCepDigitsChange(normalizeCepDigits(t))}
        />
        {cepLookupBusy ? (
          <ActivityIndicator color={theme.accent} size="small" />
        ) : null}
      </View>
      <Text variant="fieldLabel">{t("placeForm.fieldStateLabel")}</Text>
      <FormSelectRow
        disabled={cepLookupBusy || addrLocks.state}
        displayText={
          stateLabelRow
            ? `${stateLabelRow} (${stateUf})`
            : t("placeForm.selectState")
        }
        empty={!stateLabelRow}
        onPress={() => {
          if (!cepLookupBusy && !addrLocks.state) {
            onOpenStateModal();
          }
        }}
      />
      <Text variant="fieldLabel">{t("placeForm.fieldCityLabel")}</Text>
      <FormSelectRow
        disabled={cepLookupBusy || !stateUf || addrLocks.city}
        displayText={cityName || t("placeForm.selectCity")}
        empty={!cityName}
        onPress={() => {
          if (!cepLookupBusy && stateUf && !addrLocks.city) {
            onOpenCityModal();
          }
        }}
      />
      <TextField
        autoCapitalize="words"
        editable={!cepLookupBusy && !addrLocks.street}
        label={t("placeForm.fieldStreetLabel")}
        placeholder={t("placeForm.fieldStreetPlaceholder")}
        style={cepLookupBusy || addrLocks.street ? styles.fieldDimmed : null}
        value={street}
        onChangeText={onStreetChange}
      />
      <TextField
        editable={!cepLookupBusy}
        label={t("placeForm.fieldNumberLabel")}
        placeholder={t("placeForm.fieldNumberPlaceholder")}
        style={cepLookupBusy ? styles.fieldDimmed : null}
        value={addressNumber}
        onChangeText={onAddressNumberChange}
      />
      <TextField
        autoCapitalize="words"
        editable={!cepLookupBusy && !addrLocks.neighborhood}
        label={t("placeForm.fieldNeighborhoodLabel")}
        placeholder={t("placeForm.fieldNeighborhoodPlaceholder")}
        style={
          cepLookupBusy || addrLocks.neighborhood ? styles.fieldDimmed : null
        }
        value={neighborhood}
        onChangeText={onNeighborhoodChange}
      />
      <Text variant="fieldLabel">{t("placeForm.fieldHoursLabel")}</Text>
      <FormSelectRow
        chevron="forward"
        displayText={
          openingHoursSummary
            ? openingHoursSummary
            : t("placeForm.hoursPlaceholder")
        }
        empty={!openingHoursSummary}
        onPress={onOpenHoursModal}
      />
      <TextField
        keyboardType="number-pad"
        label={t("placeForm.fieldCnpjLabel")}
        maxLength={18}
        placeholder={t("placeForm.cnpjPlaceholder")}
        value={formatCnpjDisplay(cnpj)}
        onChangeText={(t) => onCnpjChange(normalizeCnpjDigits(t))}
      />
      <TextField
        keyboardType="phone-pad"
        label={t("placeForm.fieldPhoneLabel")}
        maxLength={15}
        placeholder={t("placeForm.phonePlaceholder")}
        value={formatBrazilPhoneDisplay(whatsappDigits)}
        onChangeText={(t) => onWhatsappChange(normalizePhoneDigits(t, 11))}
      />
      <TextField
        multiline
        label={t("placeForm.fieldDescriptionLabel")}
        maxLength={150}
        placeholder={t("placeForm.descriptionPlaceholder")}
        showCharCount
        style={styles.fieldMultiline}
        value={description}
        onChangeText={onDescriptionChange}
      />
      <EstablishmentRegisterGallery
        busy={galleryUploadBusy}
        photos={galleryPhotos}
        readOnly={galleryReadOnly}
        onPressAdd={onGalleryAddPress}
        onRemove={onGalleryRemove}
      />
      <Button disabled={!canStep0} onPress={onNext}>
        {t("placeForm.continueButton")}
      </Button>
    </>
  );
}
