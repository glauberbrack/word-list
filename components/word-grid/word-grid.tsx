import { FlashList } from '@shopify/flash-list';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { WordCell } from './word-cell';

const COLUMNS = 3;

type TWordGridProps = {
  items: TWordGridItem[];
  onPressItem: (item: TWordGridItem) => void;
  onLongPressItem?: (item: TWordGridItem) => void;
  onEndReached?: () => void;
  footer?: ReactElement | null;
};

export function WordGrid({
  items,
  onPressItem,
  onLongPressItem,
  onEndReached,
  footer,
}: TWordGridProps) {
  return (
    <View style={styles.grid}>
      <FlashList
        data={items}
        numColumns={COLUMNS}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <WordCell item={item} onPress={onPressItem} onLongPress={onLongPressItem} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={footer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
