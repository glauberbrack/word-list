import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useAuthStore } from '@/store/auth.store';
import { colors, radius, spacing } from '@/theme';

const AVATAR_SIZE = 42;

export function AccountButton() {
  const signedIn = useAuthStore((state) => state.status === 'signed-in');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={signedIn ? 'Minha conta' : 'Entrar'}
      hitSlop={spacing.sm}
      onPress={() => router.push('/account')}
      style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
    >
      <Ionicons
        name={signedIn ? 'person-circle' : 'person-circle-outline'}
        size={26}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
});
