import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useIsFavorite } from '@/hooks/use-favorites';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type TWordCellProps = {
  item: TWordGridItem;
  onPress: (item: TWordGridItem) => void;
  onLongPress?: (item: TWordGridItem) => void;
};

export const WORD_CELL_HEIGHT = 86;
export const WORD_CELL_GAP = 10;

export const WordCell = memo(function WordCell({ item, onPress, onLongPress }: TWordCellProps) {
  const isFavorite = useIsFavorite(item.word);

  return (
    <View style={styles.slot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? `${item.word}, favorita` : item.word}
        onPress={() => onPress(item)}
        onLongPress={onLongPress ? () => onLongPress(item) : undefined}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {isFavorite ? (
          <Ionicons name="star" size={14} color={colors.primary} style={styles.star} />
        ) : null}
        <Text style={styles.word} numberOfLines={2}>
          {item.word}
        </Text>
        {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  slot: {
    padding: WORD_CELL_GAP / 2,
  },
  card: {
    height: WORD_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  cardPressed: {
    backgroundColor: colors.primarySoft,
  },
  star: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  word: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  caption: {
    ...typography.micro,
    color: colors.textSubtle,
  },
});
