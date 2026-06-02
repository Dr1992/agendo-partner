import * as ImagePicker from "expo-image-picker";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { EstablishmentRegisterForm } from "./EstablishmentRegisterForm";
import { getEstablishmentRegisterScreenStyles } from "./styles";
import { useEstablishmentPlaceFormState } from "./useEstablishmentPlaceFormState";
import { BRAZIL_STATES, type BrazilState } from "../../data/brazilRegions";

const SUPPORT_EMAIL = "suporte.agendo@gmail.com";

function openSuggestCategoryMail(subject: string, body: string) {
  void Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
}

export function EstablishmentRegisterScreen({
  navigation,
}: ProfileScreenProps<"EstablishmentRegister">) {
  const { t } = useTranslation("partner");
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
          ? t("placeForm.navTitleReviewCreate")
          : t("placeForm.navTitleStepCreate"),
    });
  }, [form.step, navigation, t]);
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
        title: t("register.permissionTitle"),
        message: t("register.permissionPhotosMessage"),
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
          title: t("register.uploadTitle"),
          message:
            e instanceof Error ? e.message : t("register.uploadErrorFallback"),
        });
      } finally {
        setGalleryBusy(false);
      }
    } finally {
      setGalleryPickerLaunching(false);
    }
  }, [form, t]);

  const onSubmit = useCallback(async () => {
    if (
      !session?.accessToken ||
      !profileComplete ||
      !profile ||
      !form.category
    ) {
      setFeedbackDialog({
        title: t("register.registerTitle"),
        message: t("register.loginRequiredMessage"),
      });
      return;
    }
    const cnpjOnly = form.cnpj.replace(/\D/g, "");
    if (cnpjOnly.length > 0 && !isValidCnpj(cnpjOnly)) {
      setFeedbackDialog({
        title: t("register.cnpjInvalidTitle"),
        message: t("register.cnpjInvalidMessage"),
      });
      return;
    }
    if (!isValidBrazilCellPhoneDigits(form.whatsappDigits)) {
      setFeedbackDialog({
        title: t("register.phoneTitle"),
        message: t("register.phoneInvalidMessage"),
      });
      return;
    }
    const photoStorageKeys = form.galleryPhotos
      .map((p) => p.storageKey)
      .filter(Boolean);
    if (photoStorageKeys.length < 1 || photoStorageKeys.length > 5) {
      setFeedbackDialog({
        title: t("register.photosTitle"),
        message: t("register.photosRangeMessage"),
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
        title: t("register.registerTitle"),
        message:
          e instanceof Error ? e.message : t("register.saveErrorFallback"),
      });
    } finally {
      setBusy(false);
    }
  }, [form, navigation, profile, profileComplete, queryClient, session, t]);

  if (!session?.accessToken || !profileComplete) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">{t("register.gateMessage")}</Text>
        <Button onPress={() => navigation.navigate(ProfileStack.PartnerHome)}>
          {t("register.gateButton")}
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
              openSuggestCategoryMail(
                t("register.suggestCategorySubject"),
                t("register.suggestCategoryBody"),
              );
            }}
          >
            <Text variant="linkAccent">
              {t("register.suggestCategoryLink")}
            </Text>
            <Text variant="linkMuted">
              {t("register.suggestCategoryMailHint", { email: SUPPORT_EMAIL })}
            </Text>
          </Pressable>
        }
        items={apiCategories}
        keyExtractor={(c) => c.id}
        renderItem={(c) => ({
          subtitle: c.description,
          title: c.label,
        })}
        title={t("register.categoryModalTitle")}
        visible={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelectItem={(c) => form.setCategoryId(c.id)}
      />

      <PickerModal<BrazilState>
        items={BRAZIL_STATES}
        keyExtractor={(s) => s.uf}
        renderItem={(s) => ({ subtitle: s.uf, title: s.label })}
        title={t("register.stateModalTitle")}
        visible={stateModalOpen}
        onClose={() => setStateModalOpen(false)}
        onSelectItem={form.onPickState}
      />

      <PickerModal<string>
        items={form.citiesForState}
        keyExtractor={(c) => c}
        renderItem={(c) => ({ title: c })}
        title={t("register.cityModalTitle", {
          state: form.stateLabelRow ?? form.stateUf,
        })}
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
              label: t("common.ok"),
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
              label: t("common.ok"),
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
