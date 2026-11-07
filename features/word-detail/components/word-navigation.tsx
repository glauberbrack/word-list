import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TWordNavigationProps = {
  onPrevious?: () => void;
  onNext?: () => void;
};

type TNavigationButtonProps = {
  label: string;
  onPress?: () => void;
};

function NavigationButton({ label, onPress }: TNavigationButtonProps) {
  const disabled = !onPress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

export function WordNavigation({ onPrevious, onNext }: TWordNavigationProps) {
  return (
    <View style={styles.container}>
      <NavigationButton label="Voltar" onPress={onPrevious} />
      <NavigationButton label="Próximo" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    borderColor: colors.primary,
  },
  buttonPressed: {
    backgroundColor: colors.primarySoft,
  },
  buttonDisabled: {
    borderColor: colors.border,
  },
  label: {
    ...typography.label,
    color: colors.primary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
