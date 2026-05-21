import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { AppTheme } from "../../theme";

export type EstablishmentRowCardProps = {
  theme: AppTheme;
  /** Nome do estabelecimento (obrigatório). */
  title: string;
  /** Tipo / categoria principal (obrigatório). */
  categoryLabel: string;
  /** Linha de endereço curta para o card (obrigatório). */
  addressShort: string;
  thumbnailUrl?: string | null;
  hint?: ReactNode;
  nextSlotLabel?: string;
  /** Com `distanceKm` finito e > 0, mostra pill sob a miniatura. */
  showDistance?: boolean;
  distanceKm?: number | null;
  showRating?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  showEditIcon?: boolean;
  inactive?: boolean;
  onPress?: () => void;
  onEditPress?: () => void;
  /** Por defeito `true` (sombra como lista Explorar). */
  elevated?: boolean;
  /** Lista agenda colaborador: menos padding e miniatura mais baixa. */
  compact?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};
