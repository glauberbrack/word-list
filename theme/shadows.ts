import type { ViewStyle } from 'react-native';

export const shadows = {
  card: {
    shadowColor: '#4C1D95',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#4C1D95',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
} as const satisfies Record<string, ViewStyle>;
