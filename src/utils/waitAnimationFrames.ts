/**
 * Espera um número de frames de animação (`requestAnimationFrame`).
 * Útil antes de retirar um overlay para o sistema apresentar outro UI nativo (ex.: galeria).
 */
export function waitAnimationFrames(frameCount: number): Promise<void> {
  if (frameCount <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const tick = (remaining: number): void => {
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => tick(remaining - 1));
    };
    tick(frameCount);
  });
}
