import { InteractionManager } from "react-native";

import { waitAnimationFrames } from "./waitAnimationFrames";

/**
 * Depois de `visible={false}` num `Modal` do React Native, o sistema precisa de um
 * momento antes de apresentar outro controlador nativo (ex.: galeria de fotos).
 * Sem esta pausa, o picker pode não aparecer.
 */
export async function waitAfterDismissingReactNativeModal(): Promise<void> {
  await waitAnimationFrames(2);
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
  await waitAnimationFrames(2);
}
