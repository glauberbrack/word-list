import { formatThousands } from '@/utils/format/count';

const SOURCE_NOUNS: Record<TWordSource, string> = {
  list: 'palavra',
  history: 'no histórico',
  favorites: 'favorita',
};

export function toPositionLabel(
  source: TWordSource,
  position: TWordPosition | null,
): string | null {
  if (!position?.total) return null;

  const index = formatThousands(position.index);
  const total = formatThousands(position.total);

  if (source === 'history') return `${index} de ${total} ${SOURCE_NOUNS.history}`;

  return `${SOURCE_NOUNS[source]} ${index} de ${total}`;
}
