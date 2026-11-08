import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAuthStore } from '@/store/auth.store';
import { colors, spacing, typography } from '@/theme';

export function AccountButton() {
  const status = useAuthStore((state) => state.status);
  const signedIn = status === 'signed-in';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={signedIn ? 'Minha conta' : 'Entrar'}
      hitSlop={spacing.sm}
      onPress={() => router.push('/account')}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons
        name={signedIn ? 'person-circle' : 'person-circle-outline'}
        size={22}
        color={colors.primary}
      />
      <Text style={styles.label}>{signedIn ? 'Conta' : 'Entrar'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...typography.label,
    color: colors.primary,
  },
});
