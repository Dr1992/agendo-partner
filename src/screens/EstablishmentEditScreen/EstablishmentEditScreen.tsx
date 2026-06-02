import * as ImagePicker from "expo-image-picker";
import { useQueryClient } from "../../hooks/api/reactQuery";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { updatePartnerEstablishment } from "../../api/public/partner";
import { uploadPartnerMedia } from "../../api/public/uploads";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { OpeningHoursEditorModal } from "../../components/OpeningHoursEditor/OpeningHoursEditorModal";
import { PickerModal } from "../../components/PickerModal/PickerModal";
import { establishmentDetailQueryKey } from "../../hooks/api/useFetchEstablishmentDetail";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import type { ServiceCategory } from "../../types/category";
import { useAuth } from "../../providers/AuthProvider";
import { normalizeCepDigits } from "../../utils/cep";
import { waitAfterDismissingReactNativeModal } from "../../utils/waitAfterDismissingReactNativeModal";
import { waitAnimationFrames } from "../../utils/waitAnimationFrames";
import { isValidCnpj } from "../../utils/cnpj";
import { isValidBrazilCellPhoneDigits } from "../../utils/phone";

import { FullScreenBlockingLoader } from "../../components/FullScreenBlockingLoader";
import { LoadingCentered } from "../../components/LoadingCentered";
import { EstablishmentPlaceReviewStep } from "../EstablishmentRegisterScreen/EstablishmentPlaceReviewStep";
import { useEstablishmentPlaceFormState } from "../EstablishmentRegisterScreen/useEstablishmentPlaceFormState";
import { EstablishmentEditForm } from "./components/EstablishmentEditForm";
import { getEstablishmentEditScreenStyles } from "./styles";
import { BRAZIL_STATES, type BrazilState } from "../../data/brazilRegions";
import {
  useEstablishmentEditCategoriesData,
  useEstablishmentEditEstablishmentData,
} from "./fetch/useEstablishmentEditData";
import { useEstablishmentEditToggleActive } from "./hooks/useEstablishmentEditToggleActive";

const SUPPORT_EMAIL = "suporte.agendo@gmail.com";

function openSuggestCategoryMail(subject: string, body: string) {
  void Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
}

export function EstablishmentEditScreen({
  navigation,
  route,
}: ProfileScreenProps<"EstablishmentEdit">) {
  const { establishmentId } = route.params;
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getEstablishmentEditScreenStyles(theme),
    [theme],
  );
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { data: apiCategories = [] } = useEstablishmentEditCategoriesData();
  const form = useEstablishmentPlaceFormState(apiCategories, {
    minimumGalleryPhotos: 1,
    requireEstablishmentPhotos: false,
  });
  const { addGalleryPhoto, galleryPhotos } = form;
  const [busy, setBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [galleryPickerLaunching, setGalleryPickerLaunching] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [openingHoursModalOpen, setOpeningHoursModalOpen] = useState(false);
  const [openingHoursEditedByUser, setOpeningHoursEditedByUser] =
    useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    message: string;
    onDismiss?: () => void;
    title: string;
  } | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    setOpeningHoursEditedByUser(false);
  }, [establishmentId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        form.step === 1
          ? t("placeForm.navTitleReviewEdit")
          : t("placeForm.navTitleStepEdit"),
    });
  }, [form.step, navigation, t]);

  const { data: est, isPending } =
    useEstablishmentEditEstablishmentData(establishmentId);

  useEffect(() => {
    hydratedRef.current = false;
  }, [establishmentId]);

  useEffect(() => {
    if (!est || hydratedRef.current || est.id !== establishmentId) {
      return;
    }
    hydratedRef.current = true;
    form.hydrateFromEstablishment(est);
    // Intentionally omit `form`: only re-run when `est` / id changes, not on every form edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per fetched establishment
  }, [est, establishmentId, form.hydrateFromEstablishment]);

  const hasLegacyGalleryPhotos = useMemo(
    () => form.galleryPhotos.some((p) => !p.storageKey),
    [form.galleryPhotos],
  );

  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";
  const canToggleActive = est?.viewerMemberRole === "OWNER";
  const isEstablishmentActive = est?.isActive !== false;

  const {
    confirmToggleActive,
    onToggleActive,
    setToggleConfirm,
    toggleActiveMutation,
    toggleConfirm,
  } = useEstablishmentEditToggleActive({
    establishmentId,
    navigation,
    setFeedbackDialog,
  });

  const onNext = useCallback(() => {
    if (!form.canStep0) {
      return;
    }
    form.setStep(1);
  }, [form]);

  const onGalleryAddPress = useCallback(async () => {
    if (!canManage || galleryPhotos.length >= 5) {
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
        addGalleryPhoto({
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
  }, [addGalleryPhoto, canManage, galleryPhotos, t]);

  const onSubmit = useCallback(async () => {
    if (!session || !canManage || !est) {
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
    if (!form.category) {
      setFeedbackDialog({
        title: t("edit.categoryTitle"),
        message: t("edit.categoryRequiredMessage"),
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
        message: t("edit.photosKeepRangeMessage"),
      });
      return;
    }
    if (photoStorageKeys.length !== form.galleryPhotos.length) {
      setFeedbackDialog({
        title: t("register.photosTitle"),
        message: t("edit.photosUnlinkedMessage"),
      });
      return;
    }
    setBusy(true);
    try {
      const includeOpeningSchedule =
        est.openingSchedule?.length === 7 || openingHoursEditedByUser;
      await updatePartnerEstablishment(establishmentId, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        addressFull: form.addressLine.trim(),
        categoryIds: [form.category.id],
        cityName: form.cityName.trim(),
        stateUf: form.stateUf.toUpperCase().slice(0, 2),
        postalCode: normalizeCepDigits(form.cepDigits),
        photoStorageKeys,
        whatsapp: form.whatsappDigits.replace(/\D/g, ""),
        ...(includeOpeningSchedule
          ? { openingSchedule: form.openingSchedule }
          : {}),
      });
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: establishmentDetailQueryKey(establishmentId),
      });
      setFeedbackDialog({
        title: t("edit.savedTitle"),
        message: t("edit.savedMessage"),
        onDismiss: () => navigation.goBack(),
      });
    } catch (e) {
      setFeedbackDialog({
        title: t("common.errorTitle"),
        message: e instanceof Error ? e.message : t("edit.saveErrorFallback"),
      });
    } finally {
      setBusy(false);
    }
  }, [
    canManage,
    establishmentId,
    est,
    openingHoursEditedByUser,
    form.addressLine,
    form.category,
    form.cityName,
    form.cnpj,
    form.description,
    form.galleryPhotos,
    form.name,
    form.stateUf,
    form.cepDigits,
    form.openingSchedule,
    form.whatsappDigits,
    navigation,
    queryClient,
    session,
    t,
  ]);

  if (isPending || !est) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (!canManage) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">{t("edit.permissionDeniedMessage")}</Text>
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
        {!isEstablishmentActive ? (
          <Text style={[styles.body, styles.inactiveBanner]} variant="body">
            {t("edit.inactiveBanner")}
          </Text>
        ) : null}

        {hasLegacyGalleryPhotos ? (
          <Text
            style={[styles.body, styles.legacyGalleryBanner]}
            variant="body"
          >
            {t("edit.legacyGalleryBanner")}
          </Text>
        ) : null}

        {form.step === 1 ? (
          <EstablishmentPlaceReviewStep
            addressLine={form.addressLine}
            busy={busy}
            categoryLabel={form.category?.label ?? null}
            cepDigits={form.cepDigits}
            cityName={form.cityName}
            cnpj={form.cnpj}
            description={form.description}
            galleryPhotos={form.galleryPhotos}
            mode="edit"
            name={form.name}
            openingHoursSummary={form.openingHoursSummary}
            stateLabelRow={form.stateLabelRow ?? null}
            stateUf={form.stateUf}
            whatsappDigits={form.whatsappDigits}
            onBack={() => form.setStep(0)}
            onSubmit={onSubmit}
          />
        ) : (
          <EstablishmentEditForm
            addrLocks={form.addrLocks}
            addressNumber={form.addressNumber}
            canStep0={form.canStep0}
            categoryLabel={form.category?.label ?? null}
            cepDigits={form.cepDigits}
            cepLookupBusy={form.cepLookupBusy}
            cityName={form.cityName}
            cnpj={form.cnpj}
            description={form.description}
            galleryPhotos={form.galleryPhotos}
            galleryUploadBusy={galleryBusy}
            name={form.name}
            neighborhood={form.neighborhood}
            openingHoursSummary={form.openingHoursSummary}
            stateLabelRow={form.stateLabelRow ?? null}
            stateUf={form.stateUf}
            street={form.street}
            whatsappDigits={form.whatsappDigits}
            onAddressNumberChange={form.setAddressNumber}
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
            onWhatsappChange={form.setWhatsappDigits}
          />
        )}

        {form.step === 0 && canToggleActive ? (
          <Button
            disabled={toggleActiveMutation.isPending}
            loading={toggleActiveMutation.isPending}
            variant="outline"
            onPress={() => onToggleActive(!isEstablishmentActive)}
          >
            {isEstablishmentActive
              ? t("edit.deactivateButton")
              : t("edit.reactivateButton")}
          </Button>
        ) : null}
      </ScrollView>

      <PickerModal<ServiceCategory>
        footer={
          <Pressable
            accessibilityRole="button"
            style={styles.suggestCategoryButton}
            onPress={() => {
              setCategoryModalOpen(false);
              openSuggestCategoryMail(
                t("edit.suggestCategorySubject"),
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
        onConfirm={() => setOpeningHoursEditedByUser(true)}
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
      {toggleConfirm ? (
        <AlertDialog
          buttons={[
            {
              label: t("common.cancel"),
              onPress: () => {
                if (!toggleActiveMutation.isPending) {
                  setToggleConfirm(null);
                }
              },
              variant: "secondary",
            },
            {
              label: toggleActiveMutation.isPending
                ? t("edit.toggleUpdatingButton")
                : toggleConfirm.nextActive
                  ? t("edit.toggleReactivateButton")
                  : t("edit.toggleDeactivateButton"),
              onPress: confirmToggleActive,
              variant: toggleConfirm.nextActive ? "primary" : "destructive",
            },
          ]}
          message={
            toggleConfirm.nextActive
              ? t("edit.reactivateConfirmMessage")
              : t("edit.deactivateConfirmMessage")
          }
          title={
            toggleConfirm.nextActive
              ? t("edit.reactivateConfirmTitle")
              : t("edit.deactivateConfirmTitle")
          }
          visible
          onRequestClose={() => {
            if (!toggleActiveMutation.isPending) {
              setToggleConfirm(null);
            }
          }}
        />
      ) : null}
      {feedbackDialog ? (
        <AlertDialog
          buttons={[
            {
              label: t("common.ok"),
              onPress: () => {
                const fn = feedbackDialog.onDismiss;
                setFeedbackDialog(null);
                fn?.();
              },
              variant: "primary",
            },
          ]}
          message={feedbackDialog.message}
          title={feedbackDialog.title}
          visible
          onRequestClose={() => {
            const fn = feedbackDialog.onDismiss;
            setFeedbackDialog(null);
            fn?.();
          }}
        />
      ) : null}
      <FullScreenBlockingLoader visible={galleryPickerLaunching} />
    </SafeAreaView>
  );
}
