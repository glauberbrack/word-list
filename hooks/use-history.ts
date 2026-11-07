import { useMemo } from 'react';

import { listHistory } from '@/core/domain/history';
import { useHistoryStore } from '@/store/history.store';

export function useHistoryWords(): string[] {
  const items = useHistoryStore((state) => state.items);

  return useMemo(() => listHistory(items).map((item) => item.word), [items]);
}

export function useRecordView() {
  return useHistoryStore((state) => state.record);
}
