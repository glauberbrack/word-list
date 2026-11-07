import {
  createSyncOperation,
  getRetryDelay,
  isReadyToSync,
  scheduleRetry,
  SyncPermanentError,
} from '@/core/domain/sync';

export const SYNC_DEBOUNCE_MS = 500;

type TSyncEngineDeps = {
  queue: TSyncQueue;
  transport: TSyncTransport;
  onPermanentFailure?: (operation: TSyncOperation) => void;
  now?: () => number;
  debounceMs?: number;
};

export function createSyncEngine({
  queue,
  transport,
  onPermanentFailure,
  now = Date.now,
  debounceMs = SYNC_DEBOUNCE_MS,
}: TSyncEngineDeps): TSyncEngine {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running: Promise<void> | null = null;

  function schedule(delay: number) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, delay);
  }

  async function processQueue() {
    for (const operation of queue.getAll()) {
      if (!isReadyToSync(operation, now())) continue;

      try {
        await transport.push(operation);
        queue.remove(operation.id);
      } catch (error) {
        if (error instanceof SyncPermanentError) {
          queue.remove(operation.id);
          onPermanentFailure?.(operation);
          continue;
        }

        queue.update(scheduleRetry(operation, now()));
        schedule(getRetryDelay(operation.attempts));
        return;
      }
    }

    const pending = queue.getAll();
    if (pending.length > 0) {
      const nextAttemptAt = Math.min(...pending.map((operation) => operation.nextAttemptAt));
      schedule(Math.max(nextAttemptAt - now(), 0));
    }
  }

  function flush() {
    running ??= processQueue().finally(() => {
      running = null;
    });

    return running;
  }

  return {
    enqueue(input) {
      queue.enqueue(createSyncOperation(input));
      schedule(debounceMs);
    },
    flush,
    dispose() {
      if (timer) clearTimeout(timer);
      timer = null;
    },
  };
}
