import type { MaterialTopTabBarProps } from 'expo-router/js-top-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

export function PillTabBar({ state, descriptors, emitter, navigateToTab }: MaterialTopTabBarProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const title = descriptors[route.key]?.options.title ?? route.name;

        function handlePress() {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={handlePress}
            style={[styles.tab, focused && styles.tabActive]}
          >
            <Text style={[styles.label, focused && styles.labelActive]}>{title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 1,
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: colors.card,
    ...shadows.raised,
  },
  label: {
    ...typography.tab,
    color: colors.primaryMuted,
  },
  labelActive: {
    color: colors.primaryStrong,
    fontWeight: '700',
  },
});
