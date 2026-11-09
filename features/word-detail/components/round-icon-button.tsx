import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type TRoundIconButtonProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  color?: string;
  accessibilityLabel: string;
  selected?: boolean;
  onPress: () => void;
};

const SIZE = 40;

export function RoundIconButton({
  icon,
  color = colors.text,
  accessibilityLabel,
  selected,
  onPress,
}: TRoundIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={selected === undefined ? undefined : { selected }}
      hitSlop={spacing.sm}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.7,
  },
});
