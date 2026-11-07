export const SYNC_BASE_RETRY_DELAY_MS = 1_000;
export const SYNC_MAX_RETRY_DELAY_MS = 60_000;

export class SyncPermanentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncPermanentError';
  }
}

export function createSyncOperation(input: TSyncOperationInput): TSyncOperation {
  return {
    ...input,
    id: `${input.entity}:${input.word}:${input.at}`,
    attempts: 0,
    nextAttemptAt: input.at,
  };
}

export function coalesceOperation(
  queue: TSyncOperation[],
  operation: TSyncOperation,
): TSyncOperation[] {
  return [
    ...queue.filter((item) => item.entity !== operation.entity || item.word !== operation.word),
    operation,
  ];
}

export function getRetryDelay(attempts: number): number {
  return Math.min(SYNC_BASE_RETRY_DELAY_MS * 2 ** attempts, SYNC_MAX_RETRY_DELAY_MS);
}

export function scheduleRetry(operation: TSyncOperation, now: number): TSyncOperation {
  return {
    ...operation,
    attempts: operation.attempts + 1,
    nextAttemptAt: now + getRetryDelay(operation.attempts),
  };
}

export function isReadyToSync(operation: TSyncOperation, now: number): boolean {
  return operation.nextAttemptAt <= now;
}
