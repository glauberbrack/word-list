import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, spacing } from '@/theme';

type TFavoriteButtonProps = {
  active: boolean;
  onPress: () => void;
};

export function FavoriteButton({ active, onPress }: TFavoriteButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      accessibilityState={{ selected: active }}
      hitSlop={spacing.sm}
      onPress={onPress}
      style={styles.button}
    >
      <Ionicons
        name={active ? 'star' : 'star-outline'}
        size={26}
        color={active ? colors.primary : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.xs,
  },
});
