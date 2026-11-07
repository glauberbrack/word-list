export function readJson<T>(storage: TKeyValueStorage, key: string, fallback: T): T {
  const raw = storage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    storage.removeItem(key);
    return fallback;
  }
}

export function writeJson<T>(storage: TKeyValueStorage, key: string, value: T): void {
  storage.setItem(key, JSON.stringify(value));
}
