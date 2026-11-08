export function createMemoryKeyValueStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));

  const storage: TKeyValueStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };

  return { storage, data };
}
