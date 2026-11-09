import type { ErrorBoundaryProps } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppProviders } from '@/components/providers/app-providers';
import { ErrorState } from '@/components/ui/error-state';
import { ToastHost } from '@/components/ui/toast-host';
import { colors } from '@/theme';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ErrorState
        message="Não foi possível abrir o app. Tente de novo."
        onRetry={() => void retry()}
      />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="word/[word]" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="account" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <ToastHost />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
