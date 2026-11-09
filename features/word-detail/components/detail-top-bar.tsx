import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { FavoriteButton } from './favorite-button';
import { RoundIconButton } from './round-icon-button';

type TDetailTopBarProps = {
  positionLabel: string | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
};

export function DetailTopBar({
  positionLabel,
  isFavorite,
  onClose,
  onToggleFavorite,
}: TDetailTopBarProps) {
  return (
    <View style={styles.container}>
      <RoundIconButton icon="close" accessibilityLabel="Fechar" onPress={onClose} />
      {positionLabel ? <Text style={styles.position}>{positionLabel}</Text> : <View />}
      <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  position: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryMuted,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
});
