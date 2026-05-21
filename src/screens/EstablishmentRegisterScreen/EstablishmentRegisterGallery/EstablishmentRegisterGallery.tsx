import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
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
      <Text variant="fieldLabel">Fotos do local</Text>
      <Text style={galleryStyles.hint} variant="hint">
        {readOnly
          ? "Imagens que aparecem na ficha do estabelecimento."
          : "Adicione entre 1 e 5 fotos do espaço (ambiente, equipamento ou trabalhos)."}
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
                accessibilityLabel="Remover foto"
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
            accessibilityLabel="Adicionar foto"
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
