import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TWordCardProps = {
  word: string;
  phonetic: string | null;
};

export function WordCard({ word, phonetic }: TWordCardProps) {
  return (
    <View style={styles.card}>
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
