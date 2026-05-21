import { type ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";

/** Fade-in mais longo e suave */
const DEFAULT_DURATION = 520;
const DEFAULT_STAGGER = 58;
const MAX_STAGGER = 480;

export type AnimatedListItemProps = {
  children: ReactNode;
  index: number;
  /** Identidade da linha (ex.: item.id) — muda ao reciclar célula no FlatList */
  itemKey: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  staggerMs?: number;
  translateFrom?: number;
};

/**
 * Fade-in + leve slide vertical ao entrar; atraso por índice (com teto).
 */
export function AnimatedListItem({
  children,
  duration = DEFAULT_DURATION,
  index,
  itemKey,
  staggerMs = DEFAULT_STAGGER,
  style,
  translateFrom = 6,
}: AnimatedListItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(translateFrom)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(translateFrom);
    const delay = Math.min(index * staggerMs, MAX_STAGGER);
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        delay,
        duration,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        delay,
        duration,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [duration, index, itemKey, opacity, translateFrom, staggerMs, translateY]);

  return (
    <Animated.View
      renderToHardwareTextureAndroid
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
