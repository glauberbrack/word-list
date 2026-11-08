export function createLocalOnlyTransport(): TSyncTransport {
  return {
    push: async () => undefined,
  };
}
