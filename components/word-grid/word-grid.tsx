import { FlashList } from '@shopify/flash-list';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useScrollToTop } from '@/hooks/use-scroll-to-top';

import { ScrollToTopButton } from './scroll-to-top-button';
import { WORD_CELL_GAP, WordCell } from './word-cell';

const COLUMNS = 3;
const SCROLL_EVENT_THROTTLE_MS = 32;

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
  const { listRef, visible, onLayout, onScroll, scrollToTop } = useScrollToTop<TWordGridItem>();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <FlashList
          ref={listRef}
          data={items}
          numColumns={COLUMNS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <WordCell item={item} onPress={onPressItem} onLongPress={onLongPressItem} />
          )}
          onLayout={onLayout}
          onScroll={onScroll}
          scrollEventThrottle={SCROLL_EVENT_THROTTLE_MS}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={footer}
        />
      </View>
      <ScrollToTopButton visible={visible} onPress={scrollToTop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flex: 1,
    marginHorizontal: -WORD_CELL_GAP / 2,
  },
});
