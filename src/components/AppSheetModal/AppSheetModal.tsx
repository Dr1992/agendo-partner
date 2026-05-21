import { Ionicons } from "@expo/vector-icons";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";

import { getAppSheetModalStyles } from "./styles";

const SCRIM_FADE_MS = 220;
const SHEET_SLIDE_MS = 280;

const SIZE_FRACTION = {
  full: 0.98,
  half: 0.5,
  large: 0.88,
  medium: 0.55,
} as const;

export type AppSheetModalSize = keyof typeof SIZE_FRACTION;

export type ModalHeaderBarProps = {
  /** When set, title is not shown (e.g. custom full header row as `left` only + `right` only with flex title in children — prefer using `title` + slots). */
  bottomBorder?: boolean;
  left?: ReactNode;
  onCloseRequest: () => void;
  /** Base horizontal padding (before safe area), e.g. 8 in bottom sheets. */
  paddingHorizontalBase?: number;
  paddingTop?: number;
  right?: ReactNode;
  /** Screen safe area (Modal has no automatic horizontal inset). */
  safeInsetLeft?: number;
  safeInsetRight?: number;
  showCloseButton?: boolean;
  title: string;
  /** `surface` for full-screen modals with raised header; default `background` for bottom sheets. */
  tone?: "background" | "surface";
};

/**
 * Header: optional `left`, centered `title`, optional `right` or default close (X) on the right.
 */
export function ModalHeaderBar({
  bottomBorder = true,
  left,
  onCloseRequest,
  paddingHorizontalBase = 8,
  paddingTop = 0,
  right,
  safeInsetLeft = 0,
  safeInsetRight = 0,
  showCloseButton = true,
  title,
  tone = "background",
}: ModalHeaderBarProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getAppSheetModalStyles(theme), [theme]);

  const useDefaultClose = right === undefined && showCloseButton;
  const end = useDefaultClose ? (
    <Pressable
      accessibilityLabel="Fechar"
      accessibilityRole="button"
      hitSlop={12}
      onPress={onCloseRequest}
      style={styles.headerCloseHit}
    >
      <Ionicons color={theme.textPrimary} name="close" size={26} />
    </Pressable>
  ) : right !== undefined ? (
    right
  ) : null;

  return (
    <View
      style={[
        styles.headerBar,
        tone === "surface" && styles.headerBarSurface,
        {
          paddingLeft: paddingHorizontalBase + safeInsetLeft,
          paddingRight: paddingHorizontalBase + safeInsetRight,
          paddingTop,
        },
        !bottomBorder && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.headerColLeft}>{left}</View>
      <View style={styles.headerColMid}>
        <Text numberOfLines={1} style={styles.headerTitle} variant="listTitle">
          {title}
        </Text>
      </View>
      <View style={styles.headerColRight}>{end}</View>
    </View>
  );
}

export type AppSheetModalProps = {
  /**
   * `slide`: escurecimento do fundo em fade + folha a subir (sem mover o scrim com o slide nativo do Modal).
   * `fade`: fade do overlay inteiro (scrim + folha).
   */
  animationType?: "fade" | "none" | "slide";
  children: ReactNode;
  /** Horizontal padding of the scroll/content area (before safe area). Default 24. Use 0 for full-width pickers. */
  contentPaddingH?: number;
  footer?: ReactNode;
  /** Replaces default X on the right (e.g. “OK” text). */
  headerEnd?: ReactNode;
  /** Replaces empty left slot (e.g. “Cancelar”). */
  headerStart?: ReactNode;
  /**
   * Max height in px. Takes precedence over `size` when set.
   * Use to cap list modals (e.g. `min(0.78 * height, 560)`).
   */
  maxHeightPx?: number;
  onRequestClose: () => void;
  /**
   * If true, no X when `headerEnd` is undefined (e.g. custom close elsewhere).
   * Default: show X when both header slots are empty.
   */
  showCloseButton?: boolean;
  size?: AppSheetModalSize;
  title: string;
  visible: boolean;
};

/**
 * Bottom sheet: scrim, slide-up panel, `ModalHeaderBar` (title + X by default), body, optional footer.
 * Use `size` or `maxHeightPx` to control height; body uses `flex: 1` for scrollable children.
 */
export function AppSheetModal({
  animationType = "slide",
  children,
  contentPaddingH = 24,
  footer,
  headerEnd,
  headerStart,
  maxHeightPx,
  onRequestClose,
  showCloseButton: showCloseButtonProp,
  size = "large",
  title,
  visible,
}: AppSheetModalProps) {
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();
  const { theme } = useAppTheme();
  const styles = useMemo(() => getAppSheetModalStyles(theme), [theme]);

  const maxH = useMemo(() => {
    if (maxHeightPx !== undefined) {
      return maxHeightPx;
    }
    if (size === "full") {
      return windowH - insets.top;
    }
    return Math.round(windowH * SIZE_FRACTION[size]);
  }, [insets.top, maxHeightPx, size, windowH]);

  const slideDistance = useMemo(
    () => Math.min(windowH, maxH + insets.bottom + 48),
    [windowH, maxH, insets.bottom],
  );

  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(slideDistance)).current;
  const runningAnim = useRef<Animated.CompositeAnimation | null>(null);

  const [presented, setPresented] = useState(visible);

  useLayoutEffect(() => {
    if (visible) {
      setPresented(true);
    }
  }, [visible]);

  const stopRunningAnim = useCallback(() => {
    runningAnim.current?.stop();
    runningAnim.current = null;
  }, []);

  useLayoutEffect(() => {
    if (!presented) {
      return;
    }
    stopRunningAnim();
    if (animationType === "none") {
      scrimOpacity.setValue(visible ? 1 : 0);
      sheetTranslateY.setValue(visible ? 0 : slideDistance);
      if (!visible) {
        setPresented(false);
      }
      return;
    }
    if (visible) {
      scrimOpacity.setValue(0);
      if (animationType === "slide") {
        sheetTranslateY.setValue(slideDistance);
      } else {
        sheetTranslateY.setValue(0);
      }
    }
  }, [
    animationType,
    presented,
    scrimOpacity,
    sheetTranslateY,
    slideDistance,
    stopRunningAnim,
    visible,
  ]);

  useEffect(() => {
    if (!presented) {
      return;
    }
    stopRunningAnim();

    if (animationType === "none") {
      return;
    }

    if (visible) {
      if (animationType === "fade") {
        const anim = Animated.timing(scrimOpacity, {
          duration: SCRIM_FADE_MS,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        });
        runningAnim.current = anim;
        anim.start(() => {
          runningAnim.current = null;
        });
        return;
      }
      const anim = Animated.parallel([
        Animated.timing(scrimOpacity, {
          duration: SCRIM_FADE_MS,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          duration: SHEET_SLIDE_MS,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]);
      runningAnim.current = anim;
      anim.start(() => {
        runningAnim.current = null;
      });
      return;
    }

    if (animationType === "fade") {
      const anim = Animated.timing(scrimOpacity, {
        duration: SCRIM_FADE_MS,
        easing: Easing.in(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      });
      runningAnim.current = anim;
      anim.start(({ finished }) => {
        runningAnim.current = null;
        if (finished) {
          setPresented(false);
        }
      });
      return;
    }

    const anim = Animated.parallel([
      Animated.timing(scrimOpacity, {
        duration: SCRIM_FADE_MS,
        easing: Easing.in(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        duration: SHEET_SLIDE_MS,
        easing: Easing.in(Easing.cubic),
        toValue: slideDistance,
        useNativeDriver: true,
      }),
    ]);
    runningAnim.current = anim;
    anim.start(({ finished }) => {
      runningAnim.current = null;
      if (finished) {
        setPresented(false);
      }
    });
  }, [
    animationType,
    presented,
    scrimOpacity,
    sheetTranslateY,
    slideDistance,
    stopRunningAnim,
    visible,
  ]);

  useEffect(() => {
    return () => {
      stopRunningAnim();
    };
  }, [stopRunningAnim]);

  const showCloseButton =
    showCloseButtonProp !== undefined
      ? showCloseButtonProp
      : headerStart === undefined && headerEnd === undefined;

  const safeBottom = Math.max(insets.bottom, 12);
  const padBodyLeft = contentPaddingH + insets.left;
  const padBodyRight = contentPaddingH + insets.right;
  const padFooterLeft = 24 + insets.left;
  const padFooterRight = 24 + insets.right;

  const sheetOpacity = animationType === "fade" ? scrimOpacity : undefined;

  return (
    <Modal
      animationType="none"
      transparent
      visible={presented}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.scrimGrow, { opacity: scrimOpacity }]}>
          <Pressable
            accessibilityRole="button"
            style={StyleSheet.absoluteFillObject}
            onPress={onRequestClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              /** Altura fixa para o corpo `flex:1` + ScrollView encolherem e rolarem até ao fim. */
              height: maxH,
              maxHeight: maxH,
              opacity: sheetOpacity ?? 1,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View
            style={[
              styles.sheetInner,
              { paddingBottom: footer ? 0 : safeBottom },
            ]}
          >
            <ModalHeaderBar
              left={headerStart}
              onCloseRequest={onRequestClose}
              paddingHorizontalBase={8}
              right={headerEnd}
              safeInsetLeft={insets.left}
              safeInsetRight={insets.right}
              showCloseButton={showCloseButton}
              title={title}
            />
            <View
              style={[
                styles.body,
                {
                  paddingLeft: padBodyLeft,
                  paddingRight: padBodyRight,
                },
              ]}
            >
              {children}
            </View>
            {footer ? (
              <View
                style={[
                  styles.footer,
                  {
                    paddingBottom: safeBottom,
                    paddingLeft: padFooterLeft,
                    paddingRight: padFooterRight,
                  },
                ]}
              >
                {footer}
              </View>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
