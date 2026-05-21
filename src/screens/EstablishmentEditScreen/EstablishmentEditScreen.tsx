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
import {
  ESTABLISHMENT_PLACE_REVIEW_NAV_TITLE,
  ESTABLISHMENT_PLACE_STEP0_NAV_TITLE,
} from "../EstablishmentRegisterScreen/EstablishmentPlaceReviewStep";
import { EstablishmentRegisterForm } from "../EstablishmentRegisterScreen/EstablishmentRegisterForm";
import { getEstablishmentRegisterScreenStyles } from "../EstablishmentRegisterScreen/styles";
import { useEstablishmentPlaceFormState } from "../EstablishmentRegisterScreen/useEstablishmentPlaceFormState";
import { BRAZIL_STATES, type BrazilState } from "../../data/brazilRegions";
import {
  useEstablishmentEditCategoriesData,
  useEstablishmentEditEstablishmentData,
} from "./fetch/useEstablishmentEditData";
import { useEstablishmentEditToggleActive } from "./hooks/useEstablishmentEditToggleActive";

const SUPPORT_EMAIL = "suporte.agendo@gmail.com";

function openSuggestCategoryMail() {
  const subject = "Sugestão de nova categoria (edição de estabelecimento)";
  const body =
    "Não encontrei a categoria do meu negócio no app. Descreva o ramo e o tipo de serviço:\n\n";
  void Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
}

export function EstablishmentEditScreen({
  navigation,
  route,
}: ProfileScreenProps<"EstablishmentEdit">) {
  const { establishmentId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => getEstablishmentRegisterScreenStyles(theme),
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
          ? ESTABLISHMENT_PLACE_REVIEW_NAV_TITLE.edit
          : ESTABLISHMENT_PLACE_STEP0_NAV_TITLE.edit,
    });
  }, [form.step, navigation]);

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
        addGalleryPhoto({
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
  }, [addGalleryPhoto, canManage, galleryPhotos]);

  const onSubmit = useCallback(async () => {
    if (!session || !canManage || !est) {
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
    if (!form.category) {
      setFeedbackDialog({
        title: "Categoria",
        message: "Escolha uma categoria.",
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
          "Mantenha entre 1 e 5 fotos do estabelecimento. Envie novamente as que faltarem.",
      });
      return;
    }
    if (photoStorageKeys.length !== form.galleryPhotos.length) {
      setFeedbackDialog({
        title: "Fotos",
        message:
          "Alguma imagem ainda não está associada ao servidor. Remova-a e adicione outra vez.",
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
        title: "Salvo",
        message: "Os dados do estabelecimento foram atualizados.",
        onDismiss: () => navigation.goBack(),
      });
    } catch (e) {
      setFeedbackDialog({
        title: "Erro",
        message: e instanceof Error ? e.message : "Não foi possível salvar.",
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
        <Text variant="body">
          Apenas dono ou gestor pode editar os dados deste local.
        </Text>
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
            Este local está desativado: não aparece na busca pública. Reative
            abaixo para voltar a exibir.
          </Text>
        ) : null}

        {hasLegacyGalleryPhotos ? (
          <Text
            style={[styles.body, styles.legacyGalleryBanner]}
            variant="body"
          >
            Estas fotos vêm de uma versão antiga: remova-as com × e envie de
            novo (1 a 5) para poder guardar.
          </Text>
        ) : null}

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
          mode="edit"
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

        {form.step === 0 && canToggleActive ? (
          <Button
            disabled={toggleActiveMutation.isPending}
            loading={toggleActiveMutation.isPending}
            variant="outline"
            onPress={() => onToggleActive(!isEstablishmentActive)}
          >
            {isEstablishmentActive
              ? "Desativar local (arquivar)"
              : "Reativar local"}
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
        onConfirm={() => setOpeningHoursEditedByUser(true)}
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
      {toggleConfirm ? (
        <AlertDialog
          buttons={[
            {
              label: "Cancelar",
              onPress: () => {
                if (!toggleActiveMutation.isPending) {
                  setToggleConfirm(null);
                }
              },
              variant: "secondary",
            },
            {
              label: toggleActiveMutation.isPending
                ? "A atualizar…"
                : toggleConfirm.nextActive
                  ? "Reativar"
                  : "Desativar",
              onPress: confirmToggleActive,
              variant: toggleConfirm.nextActive ? "primary" : "destructive",
            },
          ]}
          message={
            toggleConfirm.nextActive
              ? "O local volta a aparecer na busca pública para novos clientes."
              : "O local deixa de aparecer na busca pública. Agendamentos já existentes não são apagados; pode reativar quando quiser."
          }
          title={
            toggleConfirm.nextActive ? "Reativar local?" : "Desativar local?"
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
              label: "OK",
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
