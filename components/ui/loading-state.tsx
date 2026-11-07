import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

export function LoadingState() {
  return (
    <View style={styles.container} accessibilityLabel="Carregando">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
