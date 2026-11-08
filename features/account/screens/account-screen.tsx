import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/auth.store';
import { colors, spacing, typography } from '@/theme';

import { PrimaryButton } from '../components/primary-button';
import { SignInForm } from '../components/sign-in-form';

export function AccountScreen() {
  const { status, user, pending, signOut, clearError } = useAuthStore();

  useEffect(() => clearError, [clearError]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={spacing.md}
            onPress={() => router.back()}
          >
            <Text style={styles.close}>✕</Text>
          </Pressable>
          <Text style={styles.title} accessibilityRole="header">
            Conta
          </Text>

          {status === 'unavailable' ? (
            <Text style={styles.description}>
              Login indisponível nesta build: defina EXPO_PUBLIC_SUPABASE_URL e
              EXPO_PUBLIC_SUPABASE_KEY no arquivo .env. Favoritos e histórico continuam salvos neste
              aparelho.
            </Text>
          ) : null}

          {status === 'signed-in' ? (
            <>
              <Text style={styles.description}>Conectado como {user?.email ?? 'usuário'}.</Text>
              <PrimaryButton label="Sair" onPress={signOut} loading={pending} variant="outline" />
            </>
          ) : null}

          {status === 'signed-out' || status === 'loading' ? (
            <SignInForm onSignedIn={() => router.back()} />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.md,
  },
  close: {
    ...typography.heading,
    color: colors.text,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
  },
});
