export type AlertDialogButton = {
  /** Chave React estável quando `label` se repete entre botões. */
  buttonKey?: string;
  label: string;
  onPress: () => void;
  variant: "destructive" | "primary" | "secondary";
};
