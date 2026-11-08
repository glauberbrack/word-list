import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'solid' | 'outline';
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = 'solid',
}: TPrimaryButtonProps) {
  const outline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, outline && styles.outline, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : colors.background} />
      ) : (
        <Text style={[styles.label, outline && styles.outlineLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.background,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.label,
    color: colors.background,
  },
  outlineLabel: {
    color: colors.primary,
  },
});
