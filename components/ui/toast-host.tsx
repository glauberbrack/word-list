import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore } from '@/store/toast.store';
import { colors, radius, spacing, typography } from '@/theme';

const TOAST_DURATION_MS = 3_000;

export function ToastHost() {
  const message = useToastStore((state) => state.message);
  const hide = useToastStore((state) => state.hide);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { bottom: insets.bottom + spacing.lg }]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.text,
  },
  message: {
    ...typography.body,
    color: colors.background,
    textAlign: 'center',
  },
});
