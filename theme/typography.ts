import type { TextStyle } from 'react-native';

export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  heading: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const satisfies Record<string, TextStyle>;
