import * as ImagePicker from "expo-image-picker";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Linking, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "../../hooks/api/reactQuery";

import { createPartnerEstablishment } from "../../api/public/partner";
import { uploadPartnerMedia } from "../../api/public/uploads";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { OpeningHoursEditorModal } from "../../components/OpeningHoursEditor/OpeningHoursEditorModal";
import { PickerModal } from "../../components/PickerModal/PickerModal";
import { useEstablishmentRegisterCategoriesData } from "./fetch/useEstablishmentRegisterData";
import { establishmentDetailQueryKey } from "../../hooks/api/useFetchEstablishmentDetail";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { ProfileStack } from "../../navigation/routeIds";
import type { ServiceCategory } from "../../types/category";
import { useAuth } from "../../providers/AuthProvider";
import { normalizeCepDigits } from "../../utils/cep";
import { waitAfterDismissingReactNativeModal } from "../../utils/waitAfterDismissingReactNativeModal";
import { waitAnimationFrames } from "../../utils/waitAnimationFrames";
import { isValidCnpj } from "../../utils/cnpj";
import { isValidBrazilCellPhoneDigits } from "../../utils/phone";

import { FullScreenBlockingLoader } from "../../components/FullScreenBlockingLoader";
import {
  ESTABLISHMENT_PLACE_REVIEW_NAV_TITLE,
  ESTABLISHMENT_PLACE_STEP0_NAV_TITLE,
} from "./EstablishmentPlaceReviewStep";
import { EstablishmentRegisterForm } from "./EstablishmentRegisterForm";
import { getEstablishmentRegisterScreenStyles } from "./styles";
import { useEstablishmentPlaceFormState } from "./useEstablishmentPlaceFormState";
import { BRAZIL_STATES, type BrazilState } from "../../data/brazilRegions";

const SUPPORT_EMAIL = "suporte.agendo@gmail.com";

function openSuggestCategoryMail() {
  const subject = "Sugestão de nova categoria (cadastro de estabelecimento)";
  const body =
    "Não encontrei a categoria do meu negócio no app. Descreva o ramo e o tipo de serviço:\n\n";
  void Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
}

export function EstablishmentRegisterScreen({
  navigation,
}: ProfileScreenProps<"EstablishmentRegister">) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getEstablishmentRegisterScreenStyles(theme),
    [theme],
  );
  const queryClient = useQueryClient();
  const { profile, profileComplete, session } = useAuth();
  const { data: apiCategories = [] } = useEstablishmentRegisterCategoriesData();
  const form = useEstablishmentPlaceFormState(apiCategories, {
    requireEstablishmentPhotos: true,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        form.step === 1
          ? ESTABLISHMENT_PLACE_REVIEW_NAV_TITLE.create
          : ESTABLISHMENT_PLACE_STEP0_NAV_TITLE.create,
    });
  }, [form.step, navigation]);
  const [busy, setBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [galleryPickerLaunching, setGalleryPickerLaunching] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [openingHoursModalOpen, setOpeningHoursModalOpen] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const onNext = useCallback(() => {
    if (!form.canStep0) {
      return;
    }
    form.setStep(1);
  }, [form]);

  const onGalleryAddPress = useCallback(async () => {
    if (form.galleryPhotos.length >= 5) {
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setFeedbackDialog({
        title: "Permissão",
        message:
          "Precisamos de acesso às suas fotos para enviar imagens do local.",
      });
      return;
    }
    setGalleryPickerLaunching(true);
    try {
      await waitAnimationFrames(2);
      setGalleryPickerLaunching(false);
      await waitAfterDismissingReactNativeModal();
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) {
        return;
      }
      const asset = result.assets[0];
      setGalleryBusy(true);
      try {
        const mime = asset.mimeType ?? "image/jpeg";
        const up = await uploadPartnerMedia(asset.uri, mime);
        form.addGalleryPhoto({
          previewUri: asset.uri,
          storageKey: up.storageKey,
        });
      } catch (e) {
        setFeedbackDialog({
          title: "Envio",
          message:
            e instanceof Error ? e.message : "Não foi possível enviar a foto.",
        });
      } finally {
        setGalleryBusy(false);
      }
    } finally {
      setGalleryPickerLaunching(false);
    }
  }, [form]);

  const onSubmit = useCallback(async () => {
    if (
      !session?.accessToken ||
      !profileComplete ||
      !profile ||
      !form.category
    ) {
      setFeedbackDialog({
        title: "Cadastro",
        message: "É preciso estar logado com perfil completo.",
      });
      return;
    }
    const cnpjOnly = form.cnpj.replace(/\D/g, "");
    if (cnpjOnly.length > 0 && !isValidCnpj(cnpjOnly)) {
      setFeedbackDialog({
        title: "CNPJ inválido",
        message: "Confira os dígitos ou deixe o campo em branco.",
      });
      return;
    }
    if (!isValidBrazilCellPhoneDigits(form.whatsappDigits)) {
      setFeedbackDialog({
        title: "Celular",
        message:
          "Informe o celular com DDD (11 dígitos, começando com 9 após o DDD).",
      });
      return;
    }
    const photoStorageKeys = form.galleryPhotos
      .map((p) => p.storageKey)
      .filter(Boolean);
    if (photoStorageKeys.length < 1 || photoStorageKeys.length > 5) {
      setFeedbackDialog({
        title: "Fotos",
        message:
          "Adicione entre 1 e 5 fotos do estabelecimento antes de confirmar.",
      });
      return;
    }
    setBusy(true);
    try {
      const detail = await createPartnerEstablishment({
        addressFull: form.addressLine.trim(),
        categoryId: form.category.id,
        categoryLabel: form.category.label,
        cityName: form.cityName.trim(),
        cnpj: form.cnpj.replace(/\D/g, "") || undefined,
        description: form.description.trim() || undefined,
        name: form.name.trim(),
        openingHoursSummary: form.openingHoursSummary.trim(),
        openingSchedule: form.openingSchedule,
        ownerUserId: session.userId,
        photoStorageKeys,
        postalCode: normalizeCepDigits(form.cepDigits),
        stateUf: form.stateUf.toUpperCase(),
        whatsapp: form.whatsappDigits.replace(/\D/g, ""),
      });
      await queryClient.invalidateQueries({ queryKey: ["establishments"] });
      await queryClient.invalidateQueries({
        queryKey: establishmentDetailQueryKey(detail.id),
      });
      navigation.replace(ProfileStack.EstablishmentHub, {
        establishmentId: detail.id,
      });
    } catch (e) {
      setFeedbackDialog({
        title: "Cadastro",
        message: e instanceof Error ? e.message : "Falha ao salvar.",
      });
    } finally {
      setBusy(false);
    }
  }, [form, navigation, profile, profileComplete, queryClient, session]);

  if (!session?.accessToken || !profileComplete) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">
          Faça login e conclua o cadastro na sequência para registrar um local.
        </Text>
        <Button onPress={() => navigation.navigate(ProfileStack.PartnerHome)}>
          Ir à área do parceiro
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <EstablishmentRegisterForm
          addressLine={form.addressLine}
          addressNumber={form.addressNumber}
          addrLocks={form.addrLocks}
          busy={busy}
          canStep0={form.canStep0}
          categoryLabel={form.category?.label ?? null}
          cepDigits={form.cepDigits}
          cepLookupBusy={form.cepLookupBusy}
          cityName={form.cityName}
          cnpj={form.cnpj}
          description={form.description}
          galleryPhotos={form.galleryPhotos}
          galleryReadOnly={false}
          galleryUploadBusy={galleryBusy}
          mode="create"
          name={form.name}
          neighborhood={form.neighborhood}
          openingHoursSummary={form.openingHoursSummary}
          stateLabelRow={form.stateLabelRow ?? null}
          stateUf={form.stateUf}
          step={form.step}
          street={form.street}
          whatsappDigits={form.whatsappDigits}
          onAddressNumberChange={form.setAddressNumber}
          onBack={() => form.setStep(0)}
          onCepDigitsChange={form.setCepDigits}
          onCnpjChange={form.setCnpj}
          onDescriptionChange={form.setDescription}
          onGalleryAddPress={onGalleryAddPress}
          onGalleryRemove={form.removeGalleryPhoto}
          onNameChange={form.setName}
          onNeighborhoodChange={form.setNeighborhood}
          onNext={onNext}
          onOpenCategoryModal={() => setCategoryModalOpen(true)}
          onOpenCityModal={() => setCityModalOpen(true)}
          onOpenHoursModal={() => setOpeningHoursModalOpen(true)}
          onOpenStateModal={() => setStateModalOpen(true)}
          onStreetChange={form.setStreet}
          onSubmit={onSubmit}
          onWhatsappChange={form.setWhatsappDigits}
        />
      </ScrollView>

      <PickerModal<ServiceCategory>
        footer={
          <Pressable
            accessibilityRole="button"
            style={styles.suggestCategoryButton}
            onPress={() => {
              setCategoryModalOpen(false);
              openSuggestCategoryMail();
            }}
          >
            <Text variant="linkAccent">
              Não encontrou? Sugerir nova categoria
            </Text>
            <Text variant="linkMuted">Abre o e-mail para {SUPPORT_EMAIL}</Text>
          </Pressable>
        }
        items={apiCategories}
        keyExtractor={(c) => c.id}
        renderItem={(c) => ({
          subtitle: c.description,
          title: c.label,
        })}
        title="Escolha a categoria"
        visible={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectItem={(c) => form.setCategoryId(c.id)}
      />

      <PickerModal<BrazilState>
        items={BRAZIL_STATES}
        keyExtractor={(s) => s.uf}
        renderItem={(s) => ({ subtitle: s.uf, title: s.label })}
        title="Escolha o estado"
        visible={stateModalOpen}
        onClose={() => setStateModalOpen(false)}
        onSelectItem={form.onPickState}
      />

      <PickerModal<string>
        items={form.citiesForState}
        keyExtractor={(c) => c}
        renderItem={(c) => ({ title: c })}
        title={`Cidades em ${form.stateLabelRow ?? form.stateUf}`}
        visible={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelectItem={form.setCityName}
      />

      <OpeningHoursEditorModal
        value={form.openingSchedule}
        visible={openingHoursModalOpen}
        onChange={form.setOpeningSchedule}
        onClose={() => setOpeningHoursModalOpen(false)}
      />

      {form.placeFormAlert ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: form.dismissPlaceFormAlert,
              variant: "primary",
            },
          ]}
          message={form.placeFormAlert.message}
          title={form.placeFormAlert.title}
          visible
          onRequestClose={form.dismissPlaceFormAlert}
        />
      ) : null}
      {feedbackDialog ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: () => setFeedbackDialog(null),
              variant: "primary",
            },
          ]}
          message={feedbackDialog.message}
          title={feedbackDialog.title}
          visible
          onRequestClose={() => setFeedbackDialog(null)}
        />
      ) : null}
      <FullScreenBlockingLoader visible={galleryPickerLaunching} />
    </SafeAreaView>
  );
}
