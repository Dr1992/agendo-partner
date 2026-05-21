import type { AppTheme } from "../../theme";
import type { Establishment } from "../../types/establishment";

export type EstablishmentCardProps = {
  item: Establishment;
  theme: AppTheme;
  onPress?: (id: string) => void;
};
