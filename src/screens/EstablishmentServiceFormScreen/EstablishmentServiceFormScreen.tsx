import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Button } from "../../components/Button";
import { DurationPickerModal } from "../../components/DurationPickerModal/DurationPickerModal";
import { LoadingCentered } from "../../components/LoadingCentered";
import { ServicePerformersModal } from "../../components/ServicePerformersModal/ServicePerformersModal";
import { Text } from "../../components/Text";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import {
  formatCentsAsBrazilReais,
  maskBrazilMoneyInput,
} from "../../utils/brazilMoney";
import { formatDurationMinutesLabel } from "../../utils/formatDurationLabel";

import {
  useEstablishmentServiceFormEstablishmentData,
  useEstablishmentServiceFormServicesData,
} from "./fetch/useEstablishmentServiceFormData";
import { useEstablishmentServiceFormMutations } from "./hooks/useEstablishmentServiceFormMutations";
import { getEstablishmentServiceFormScreenStyles } from "./styles";

export function EstablishmentServiceFormScreen({
  navigation,
  route,
}: ProfileScreenProps<"EstablishmentServiceForm">) {
  const { establishmentId, establishmentName, serviceId } = route.params;
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const formStyles = useMemo(
    () => getEstablishmentServiceFormScreenStyles(theme),
    [theme],
  );

  const [name, setName] = useState("");
  const [durationText, setDurationText] = useState("60");
  const [priceText, setPriceText] = useState("");
  const [description, setDescription] = useState("");
  const [allPerformers, setAllPerformers] = useState(true);
  const [selectedPerformerIds, setSelectedPerformerIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [busy, setBusy] = useState(false);
  const [durationModalOpen, setDurationModalOpen] = useState(false);
  const [performersModalOpen, setPerformersModalOpen] = useState(false);
  const [formErrorDialog, setFormErrorDialog] = useState<{
    message: string;
    title: string;
  } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: est, isPending: estPending } =
    useEstablishmentServiceFormEstablishmentData(establishmentId);

  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";

  const { data: servicesRes, isPending: servicesPending } =
    useEstablishmentServiceFormServicesData(establishmentId, serviceId);

  const existing = useMemo(() => {
    if (!serviceId || !servicesRes?.data) {
      return undefined;
    }
    return servicesRes.data.find((s) => s.id === serviceId);
  }, [serviceId, servicesRes?.data]);

  useEffect(() => {
    if (!existing) {
      return;
    }
    setName(existing.name);
    setDurationText(String(existing.durationMinutes));
    setPriceText(formatCentsAsBrazilReais(existing.priceCents));
    setDescription(existing.description ?? "");
    const ids = existing.performerUserIds;
    if (ids.length === 0) {
      setAllPerformers(true);
      setSelectedPerformerIds(new Set());
    } else {
      setAllPerformers(false);
      setSelectedPerformerIds(new Set(ids));
    }
  }, [existing]);

  const bookableProfessionals = useMemo(
    () => (est ? est.professionals : []),
    [est],
  );

  /** Pelo menos um colaborador no local e (todos realizam OU pelo menos um escolhido). */
  const performersSelectionValid = useMemo(() => {
    if (bookableProfessionals.length === 0) {
      return false;
    }
    if (allPerformers) {
      return true;
    }
    return selectedPerformerIds.size >= 1;
  }, [allPerformers, bookableProfessionals.length, selectedPerformerIds]);

  const durationMinutesDisplay = useMemo(() => {
    const parsedMinutes = Number.parseInt(durationText.trim(), 10);
    if (Number.isNaN(parsedMinutes) || parsedMinutes < 1) {
      return 60;
    }
    return Math.min(parsedMinutes, 24 * 60);
  }, [durationText]);

  const { confirmDeactivateService, deleteMutation, onDelete, onSave } =
    useEstablishmentServiceFormMutations({
      bookableProfessionals,
      establishmentId,
      navigation,
      serviceId,
      setBusy,
      setDeleteConfirmOpen,
      setFormErrorDialog,
    });

  if (estPending && est === undefined) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (!est || !canManage) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <Text style={styles.body} variant="body">
          {t("serviceForm.permissionDenied", { name: establishmentName })}
        </Text>
      </SafeAreaView>
    );
  }

  if (serviceId && servicesPending && !existing) {
    return (
      <SafeAreaView edges={[]} style={styles.container}>
        <LoadingCentered />
      </SafeAreaView>
    );
  }

  if (serviceId && !existing && !servicesPending) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text variant="body">{t("serviceForm.serviceNotFound")}</Text>
        <Button
          style={styles.ctaMarginTopTight}
          variant="outline"
          onPress={() => navigation.goBack()}
        >
          {t("serviceForm.backButton")}
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
        <View style={formStyles.fieldLabelRow}>
          <Ionicons color={theme.accent} name="create-outline" size={15} />
          <Text style={formStyles.fieldLabelText} variant="fieldLabel">
            {t("serviceForm.nameLabel")}
          </Text>
        </View>
        <TextInput
          autoCapitalize="sentences"
          editable={!busy}
          placeholder={t("serviceForm.namePlaceholder")}
          placeholderTextColor={theme.textHint}
          style={styles.field}
          value={name}
          onChangeText={setName}
        />

        <View style={formStyles.fieldLabelRow}>
          <Ionicons color={theme.accent} name="time-outline" size={15} />
          <Text style={formStyles.fieldLabelText} variant="fieldLabel">
            {t("serviceForm.durationLabel")}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          style={({ pressed }) => [
            styles.field,
            pressed && { opacity: 0.92 },
            busy && { opacity: 0.55 },
          ]}
          onPress={() => setDurationModalOpen(true)}
        >
          <View style={formStyles.durationRowInner}>
            <Text variant="bodyTight">
              {formatDurationMinutesLabel(durationMinutesDisplay)}
            </Text>
            <Ionicons color={theme.textMuted} name="chevron-down" size={22} />
          </View>
        </Pressable>

        <View style={formStyles.fieldLabelRow}>
          <Ionicons color={theme.accent} name="cash-outline" size={15} />
          <Text style={formStyles.fieldLabelText} variant="fieldLabel">
            {t("serviceForm.priceLabel")}
          </Text>
        </View>
        <TextInput
          autoComplete="off"
          autoCorrect={false}
          editable={!busy}
          keyboardType="number-pad"
          placeholder={t("serviceForm.pricePlaceholder")}
          placeholderTextColor={theme.textHint}
          style={styles.field}
          value={priceText}
          onChangeText={(t) => setPriceText(maskBrazilMoneyInput(t))}
        />

        <View style={formStyles.fieldLabelRow}>
          <Ionicons
            color={theme.accent}
            name="document-text-outline"
            size={15}
          />
          <Text style={formStyles.fieldLabelText} variant="fieldLabel">
            {t("serviceForm.descriptionLabel")}
          </Text>
        </View>
        <TextInput
          editable={!busy}
          multiline
          placeholder={t("serviceForm.descriptionPlaceholder")}
          placeholderTextColor={theme.textHint}
          style={[styles.field, formStyles.descriptionField]}
          value={description}
          onChangeText={setDescription}
        />

        <View style={formStyles.fieldLabelRow}>
          <Ionicons color={theme.accent} name="people-outline" size={15} />
          <Text style={formStyles.fieldLabelText} variant="fieldLabel">
            {t("serviceForm.performersLabel")}
          </Text>
        </View>
        <Text style={formStyles.sectionHint} variant="hint">
          {t("serviceForm.performersHint")}
        </Text>

        <View style={formStyles.switchRow}>
          <Text style={formStyles.switchRowLabel} variant="bodyTight">
            {t("serviceForm.allPerformersLabel")}
          </Text>
          <View style={formStyles.switchWrap}>
            <Switch
              disabled={busy}
              thumbColor={theme.surface}
              trackColor={{
                false: theme.border,
                true: theme.accent,
              }}
              value={allPerformers}
              onValueChange={(v) => {
                setAllPerformers(v);
                if (v) {
                  setSelectedPerformerIds(new Set());
                }
              }}
            />
          </View>
        </View>

        {!allPerformers ? (
          <>
            {bookableProfessionals.length === 0 ? (
              <Text variant="hint">
                {t("serviceForm.noProfessionalsHint")}
              </Text>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                style={({ pressed }) => [
                  formStyles.choosePerformersRow,
                  pressed && formStyles.choosePerformersRowPressed,
                  busy && { opacity: 0.55 },
                ]}
                onPress={() => setPerformersModalOpen(true)}
              >
                <View style={formStyles.collaboratorRowLabel}>
                  <Text variant="bodyTight">
                    {t("serviceForm.choosePerformers")}
                  </Text>
                  <Text style={formStyles.fieldHintTight} variant="hint">
                    {t("serviceForm.performersSelectedCount", {
                      selected: selectedPerformerIds.size,
                      total: bookableProfessionals.length,
                    })}
                  </Text>
                </View>
                <Ionicons
                  color={theme.textMuted}
                  name="chevron-forward"
                  size={22}
                />
              </Pressable>
            )}
          </>
        ) : null}

        <Button
          disabled={busy || !performersSelectionValid}
          style={formStyles.footer}
          onPress={() =>
            onSave({
              allPerformers,
              description,
              durationText,
              name,
              priceText,
              selectedPerformerIds,
            })
          }
        >
          {t("serviceForm.saveButton")}
        </Button>

        {serviceId ? (
          <Button
            disabled={busy}
            style={styles.ctaMarginTopTight}
            variant="outline"
            onPress={onDelete}
          >
            {t("serviceForm.deactivateButton")}
          </Button>
        ) : null}
      </ScrollView>

      <DurationPickerModal
        initialMinutes={durationMinutesDisplay}
        visible={durationModalOpen}
        onClose={() => setDurationModalOpen(false)}
        onConfirm={(m) => setDurationText(String(m))}
      />

      <ServicePerformersModal
        initialSelected={selectedPerformerIds}
        professionals={bookableProfessionals}
        visible={performersModalOpen}
        onApply={(ids) => setSelectedPerformerIds(ids)}
        onClose={() => setPerformersModalOpen(false)}
      />

      <AlertDialog
        buttons={[
          {
            label: t("common.cancel"),
            onPress: () => {
              if (!deleteMutation.isPending) {
                setDeleteConfirmOpen(false);
              }
            },
            variant: "secondary",
          },
          {
            label: deleteMutation.isPending
              ? t("serviceForm.deactivatingButton")
              : t("serviceForm.toggleDeactivateLabel"),
            onPress: confirmDeactivateService,
            variant: "destructive",
          },
        ]}
        message={t("serviceForm.deactivateConfirmMessage")}
        title={t("serviceForm.deactivateConfirmTitle")}
        visible={deleteConfirmOpen}
        onRequestClose={() => {
          if (!deleteMutation.isPending) {
            setDeleteConfirmOpen(false);
          }
        }}
      />
      {formErrorDialog ? (
        <AlertDialog
          buttons={[
            {
              label: t("common.ok"),
              onPress: () => setFormErrorDialog(null),
              variant: "primary",
            },
          ]}
          message={formErrorDialog.message}
          title={formErrorDialog.title}
          visible
          onRequestClose={() => setFormErrorDialog(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}
