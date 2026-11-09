import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

type TFlashCardProps = {
  word: string;
  phonetic: string | null;
  children?: ReactNode;
};

const STACK_OFFSET = 8;
const STACK_HEIGHT = 60;

export function FlashCard({ word, phonetic, children }: TFlashCardProps) {
  return (
    <View style={styles.stack}>
      <View style={[styles.back, styles.backFar]} />
      <View style={[styles.back, styles.backNear]} />
      <View style={styles.card}>
        <Text
          style={styles.word}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {word}
        </Text>
        <Text style={[styles.phonetic, !phonetic && styles.phoneticMissing]}>
          {phonetic ?? 'sem fonética'}
        </Text>
        {children ? <View style={styles.footer}>{children}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    paddingTop: STACK_OFFSET * 2,
  },
  back: {
    position: 'absolute',
    alignSelf: 'center',
    height: STACK_HEIGHT,
    borderRadius: radius.lg + 8,
    backgroundColor: colors.card,
  },
  backFar: {
    top: 0,
    width: '80%',
    opacity: 0.5,
  },
  backNear: {
    top: STACK_OFFSET,
    width: '90%',
    opacity: 0.8,
  },
  card: {
    alignItems: 'center',
    paddingTop: spacing.lg + 4,
    paddingHorizontal: spacing.md + 4,
    paddingBottom: spacing.md,
    borderRadius: radius.lg + 8,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  word: {
    ...typography.display,
    fontSize: 44,
    color: colors.text,
  },
  phonetic: {
    ...typography.body,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  phoneticMissing: {
    color: colors.textSubtle,
  },
  footer: {
    alignSelf: 'stretch',
    marginTop: spacing.md + 4,
  },
});
