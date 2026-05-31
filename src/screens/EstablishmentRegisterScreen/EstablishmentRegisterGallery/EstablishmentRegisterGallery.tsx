import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, View } from "react-native";

import { Text } from "../../../components/Text";
import { useAppTheme } from "../../../hooks/useAppTheme";

import type { EstablishmentGalleryPhoto } from "../useEstablishmentPlaceFormState";
import { getEstablishmentRegisterGalleryStyles } from "./styles";

export type EstablishmentRegisterGalleryProps = {
  busy: boolean;
  onPressAdd: () => void;
  onRemove: (id: string) => void;
  photos: EstablishmentGalleryPhoto[];
  readOnly: boolean;
};

export function EstablishmentRegisterGallery({
  busy,
  onPressAdd,
  onRemove,
  photos,
  readOnly,
}: EstablishmentRegisterGalleryProps) {
  const { t } = useTranslation("partner");
  const { theme } = useAppTheme();
  const galleryStyles = useMemo(
    () => getEstablishmentRegisterGalleryStyles(theme),
    [theme],
  );

  if (readOnly && photos.length === 0) {
    return null;
  }

  const canAddMore = !readOnly && photos.length < 5 && !busy;

  return (
    <>
      <Text variant="fieldLabel">{t("placeForm.galleryTitle")}</Text>
      <Text style={galleryStyles.hint} variant="hint">
        {readOnly
          ? t("placeForm.galleryHintReadOnly")
          : t("placeForm.galleryHintEditable")}
      </Text>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={galleryStyles.row}
      >
        {photos.map((photo) => (
          <View key={photo.id} style={galleryStyles.thumbWrap}>
            <View style={galleryStyles.thumb}>
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: photo.previewUri }}
                style={galleryStyles.thumbImage}
              />
            </View>
            {!readOnly ? (
              <Pressable
                accessibilityLabel={t("placeForm.removePhotoAccessibility")}
                accessibilityRole="button"
                hitSlop={6}
                style={({ pressed }) => [
                  galleryStyles.removeHit,
                  pressed && galleryStyles.removePressed,
                ]}
                onPress={() => onRemove(photo.id)}
              >
                <Ionicons
                  color={theme.textDestructive}
                  name="close-circle"
                  size={22}
                />
              </Pressable>
            ) : null}
          </View>
        ))}
        {canAddMore ? (
          <Pressable
            accessibilityLabel={t("placeForm.addPhotoAccessibility")}
            accessibilityRole="button"
            disabled={busy}
            style={({ pressed }) => [
              galleryStyles.addTile,
              busy && galleryStyles.addTileDisabled,
              pressed && !busy && galleryStyles.addTilePressed,
            ]}
            onPress={onPressAdd}
          >
            <Ionicons color={theme.accent} name="add" size={36} />
          </Pressable>
        ) : null}
      </ScrollView>
    </>
  );
}
