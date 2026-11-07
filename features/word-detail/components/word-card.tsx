import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TWordCardProps = {
  word: string;
  phonetic: string | null;
  action?: ReactNode;
};

export function WordCard({ word, phonetic, action }: TWordCardProps) {
  return (
    <View style={styles.card}>
      {action ? <View style={styles.action}>{action}</View> : null}
      <Text style={styles.word} accessibilityRole="header">
        {word}
      </Text>
      {phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },
  action: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  word: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  phonetic: {
    ...typography.body,
    color: colors.textMuted,
  },
});
