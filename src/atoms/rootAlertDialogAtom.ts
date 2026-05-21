import { atom } from "jotai";

import type { AlertDialogButton } from "../components/AlertDialog/AlertDialog.types";

export type RootAlertDialogPayload = {
  buttons: AlertDialogButton[];
  message: string;
  onRequestClose: () => void;
  requestId: number;
  title: string;
};

export const rootAlertDialogAtom = atom<RootAlertDialogPayload | null>(null);
