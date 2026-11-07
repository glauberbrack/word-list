import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TWordCellProps = {
  word: string;
  onPress: (word: string) => void;
};

export const WORD_CELL_HEIGHT = 80;

export const WordCell = memo(function WordCell({ word, onPress }: TWordCellProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={word}
      onPress={() => onPress(word)}
      style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
    >
      <Text style={styles.label} numberOfLines={2}>
        {word}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cell: {
    height: WORD_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cellPressed: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});
