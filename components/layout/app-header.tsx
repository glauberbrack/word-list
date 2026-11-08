import { StyleSheet, View } from 'react-native';

import { AccountButton } from '@/components/account/account-button';
import { colors, spacing } from '@/theme';

export function AppHeader() {
  return (
    <View style={styles.container}>
      <AccountButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
});
