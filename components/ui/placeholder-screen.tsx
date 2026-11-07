import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TPlaceholderScreenProps = {
  title: string;
  description?: string;
};

export function PlaceholderScreen({ title, description }: TPlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
  },
});
