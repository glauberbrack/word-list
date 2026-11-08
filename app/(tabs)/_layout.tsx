import { TopTabs } from 'expo-router/js-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppHeader } from '@/components/layout/app-header';
import { colors, typography } from '@/theme';

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <TopTabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarLabelStyle: { ...typography.label, textTransform: 'none' },
          tabBarStyle: { backgroundColor: colors.background },
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'Word list' }} />
        <TopTabs.Screen name="history" options={{ title: 'History' }} />
        <TopTabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      </TopTabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
