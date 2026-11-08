import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/components/providers/app-providers';
import { ToastHost } from '@/components/ui/toast-host';
import { colors } from '@/theme';

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
