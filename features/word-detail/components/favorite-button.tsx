import { colors } from '@/theme';

import { RoundIconButton } from './round-icon-button';

type TFavoriteButtonProps = {
  active: boolean;
  onPress: () => void;
};

export function FavoriteButton({ active, onPress }: TFavoriteButtonProps) {
  return (
    <RoundIconButton
      icon={active ? 'star' : 'star-outline'}
      color={colors.primary}
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      selected={active}
      onPress={onPress}
    />
  );
}
