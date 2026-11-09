import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type TNeighborNavigationProps = {
  previous: TWordLink | null;
  next: TWordLink | null;
  onNavigate: (link: TWordLink) => void;
};

type TNeighborButtonProps = {
  direction: 'previous' | 'next';
  link: TWordLink | null;
  onNavigate: (link: TWordLink) => void;
};

const COPY = {
  previous: { caption: 'anterior', empty: 'início', label: 'Palavra anterior' },
  next: { caption: 'próxima', empty: 'fim', label: 'Próxima palavra' },
} as const;

function NeighborButton({ direction, link, onNavigate }: TNeighborButtonProps) {
  const isNext = direction === 'next';
  const copy = COPY[direction];
  const disabled = link === null;
  const tint = isNext && !disabled ? colors.card : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={link ? `${copy.label}: ${link.word}` : copy.label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => link && onNavigate(link)}
      style={({ pressed }) => [
        styles.button,
        isNext && styles.buttonNext,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.caption, isNext && styles.captionNext, disabled && styles.textDisabled]}>
        {copy.caption}
      </Text>
      <View style={[styles.wordRow, isNext && styles.wordRowNext]}>
        {!isNext && !disabled ? <Ionicons name="chevron-back" size={18} color={tint} /> : null}
        <Text
          style={[styles.word, { color: tint }, disabled && styles.textDisabled]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {link?.word ?? copy.empty}
        </Text>
        {isNext && !disabled ? <Ionicons name="chevron-forward" size={18} color={tint} /> : null}
      </View>
    </Pressable>
  );
}

export function NeighborNavigation({ previous, next, onNavigate }: TNeighborNavigationProps) {
  return (
    <View style={styles.container}>
      <NeighborButton direction="previous" link={previous} onNavigate={onNavigate} />
      <NeighborButton direction="next" link={next} onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 4,
    paddingBottom: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    borderColor: colors.primaryTrack,
    backgroundColor: colors.card,
  },
  buttonNext: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    borderColor: colors.primaryTrack,
    backgroundColor: colors.card,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  caption: {
    ...typography.micro,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  captionNext: {
    color: colors.primaryTrack,
    textAlign: 'right',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  wordRowNext: {
    justifyContent: 'flex-end',
  },
  word: {
    ...typography.body,
    fontWeight: '700',
    flexShrink: 1,
  },
  textDisabled: {
    color: colors.textSubtle,
  },
});
