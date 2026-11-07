import { StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export function ScreenTitle({ children }: { children: string }) {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.text,
    paddingVertical: spacing.md,
  },
});
