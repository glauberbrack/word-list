import type { FlashListRef } from '@shopify/flash-list';
import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export const SCROLL_TO_TOP_VIEWPORTS = 1.5;

export function isPastScrollToTopThreshold(offset: number, viewportHeight: number): boolean {
  return viewportHeight > 0 && offset > viewportHeight * SCROLL_TO_TOP_VIEWPORTS;
}

export function useScrollToTop<T>() {
  const listRef = useRef<FlashListRef<T>>(null);
  const viewportHeight = useRef(0);
  const [visible, setVisible] = useState(false);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = isPastScrollToTopThreshold(
      event.nativeEvent.contentOffset.y,
      viewportHeight.current,
    );
    setVisible((current) => (current === next ? current : next));
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToTop({ animated: true });
  }, []);

  return { listRef, visible, onLayout, onScroll, scrollToTop };
}
