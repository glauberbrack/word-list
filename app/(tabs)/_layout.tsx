import { TopTabs } from 'expo-router/js-top-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { PillTabBar } from '@/components/layout/pill-tab-bar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <TopTabs tabBar={(props) => <PillTabBar {...props} />}>
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
