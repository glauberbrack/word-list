export const FAKE_SYNC_LATENCY_MS = 300;

export function createFakeSyncTransport(latencyMs = FAKE_SYNC_LATENCY_MS): TSyncTransport {
  return {
    push: () => new Promise((resolve) => setTimeout(resolve, latencyMs)),
  };
}
