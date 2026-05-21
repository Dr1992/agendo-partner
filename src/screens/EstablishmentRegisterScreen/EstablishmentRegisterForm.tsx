import { useMemo } from "react";
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
        label="Nome do local"
        placeholder="Ex.: Studio Aurora"
        spellCheck={false}
        textContentType="none"
        value={name}
        onChangeText={onNameChange}
      />
      <Text variant="fieldLabel">Categoria</Text>
      <FormSelectRow
        displayText={categoryLabel ?? "Selecionar categoria"}
        empty={!categoryLabel}
        onPress={onOpenCategoryModal}
      />
      <Text variant="fieldLabel">CEP</Text>
      <View style={styles.cepRow}>
        <TextInput
          editable={!cepLookupBusy}
          keyboardType="number-pad"
          maxLength={9}
          placeholder="00000-000"
          placeholderTextColor={theme.textMuted}
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
      <Text variant="fieldLabel">Estado</Text>
      <FormSelectRow
        disabled={cepLookupBusy || addrLocks.state}
        displayText={
          stateLabelRow ? `${stateLabelRow} (${stateUf})` : "Selecionar estado"
        }
        empty={!stateLabelRow}
        onPress={() => {
          if (!cepLookupBusy && !addrLocks.state) {
            onOpenStateModal();
          }
        }}
      />
      <Text variant="fieldLabel">Cidade</Text>
      <FormSelectRow
        disabled={cepLookupBusy || !stateUf || addrLocks.city}
        displayText={cityName || "Selecionar cidade"}
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
        label="Rua (logradouro)"
        placeholder="Ex.: Rua das Flores"
        style={cepLookupBusy || addrLocks.street ? styles.fieldDimmed : null}
        value={street}
        onChangeText={onStreetChange}
      />
      <TextField
        editable={!cepLookupBusy}
        label="Número"
        placeholder="Ex.: 1200"
        style={cepLookupBusy ? styles.fieldDimmed : null}
        value={addressNumber}
        onChangeText={onAddressNumberChange}
      />
      <TextField
        autoCapitalize="words"
        editable={!cepLookupBusy && !addrLocks.neighborhood}
        label="Bairro"
        placeholder="Ex.: Centro"
        style={
          cepLookupBusy || addrLocks.neighborhood ? styles.fieldDimmed : null
        }
        value={neighborhood}
        onChangeText={onNeighborhoodChange}
      />
      <Text variant="fieldLabel">Horário de funcionamento</Text>
      <FormSelectRow
        chevron="forward"
        displayText={
          openingHoursSummary
            ? openingHoursSummary
            : "Toque para definir dias e horários"
        }
        empty={!openingHoursSummary}
        onPress={onOpenHoursModal}
      />
      <TextField
        keyboardType="number-pad"
        label="CNPJ (opcional)"
        maxLength={18}
        placeholder="00.000.000/0000-00"
        value={formatCnpjDisplay(cnpj)}
        onChangeText={(t) => onCnpjChange(normalizeCnpjDigits(t))}
      />
      <TextField
        keyboardType="phone-pad"
        label="Celular"
        maxLength={15}
        placeholder="(11) 98765-4321"
        value={formatBrazilPhoneDisplay(whatsappDigits)}
        onChangeText={(t) => onWhatsappChange(normalizePhoneDigits(t, 11))}
      />
      <TextField
        multiline
        label="Descrição (opcional)"
        maxLength={150}
        placeholder="Conte o que você oferece"
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
        Continuar
      </Button>
    </>
  );
}
