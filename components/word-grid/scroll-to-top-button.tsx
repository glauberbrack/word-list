import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadows, spacing } from '@/theme';

type TScrollToTopButtonProps = {
  visible: boolean;
  onPress: () => void;
};

const BUTTON_SIZE = 48;
const ANIMATION_MS = 180;
const HIDDEN_OFFSET = 16;

export function ScrollToTopButton({ visible, onPress }: TScrollToTopButtonProps) {
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: ANIMATION_MS,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [HIDDEN_OFFSET, 0] });

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        { bottom: insets.bottom + spacing.md, opacity: progress, transform: [{ translateY }] },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar ao topo da lista"
        accessibilityElementsHidden={!visible}
        importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-up" size={22} color={colors.card} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    ...shadows.raised,
  },
  pressed: {
    opacity: 0.85,
  },
});
