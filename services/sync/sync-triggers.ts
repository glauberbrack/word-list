import { addEventListener as addNetInfoListener } from '@react-native-community/netinfo';
import { AppState } from 'react-native';

export function startSyncTriggers(engine: TSyncEngine): () => void {
  const appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') void engine.flush();
  });
  const unsubscribeNetInfo = addNetInfoListener((state) => {
    if (state.isConnected) void engine.flush();
  });

  void engine.flush();

  return () => {
    appStateSubscription.remove();
    unsubscribeNetInfo();
    engine.dispose();
  };
}
