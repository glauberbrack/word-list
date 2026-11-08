import { buildSyncOperation } from '@/test/fixtures';

import {
  coalesceOperation,
  createSyncOperation,
  getRetryDelay,
  isReadyToSync,
  scheduleRetry,
  SYNC_MAX_RETRY_DELAY_MS,
} from '../sync';

describe('createSyncOperation', () => {
  it('gera id estável e começa pronta para envio', () => {
    expect(
      createSyncOperation({ entity: 'favorite', type: 'upsert', word: 'hello', at: 5 }),
    ).toEqual(buildSyncOperation({ id: 'favorite:hello:5', at: 5, nextAttemptAt: 5 }));
  });
});

describe('coalesceOperation', () => {
  it('substitui a operação pendente da mesma palavra e entidade', () => {
    const upsert = buildSyncOperation({ id: 'favorite:hello:1', type: 'upsert' });
    const remove = buildSyncOperation({ id: 'favorite:hello:2', type: 'delete' });

    expect(coalesceOperation([upsert], remove)).toEqual([remove]);
  });

  it('mantém operações de outras palavras e entidades', () => {
    const otherWord = buildSyncOperation({ id: 'favorite:world:1', word: 'world' });
    const history = buildSyncOperation({ id: 'history:hello:1', entity: 'history' });
    const next = buildSyncOperation({ id: 'favorite:hello:2' });

    expect(coalesceOperation([otherWord, history], next)).toEqual([otherWord, history, next]);
  });
});

describe('retry', () => {
  it('dobra a espera a cada tentativa até o limite', () => {
    expect(getRetryDelay(0)).toBe(1_000);
    expect(getRetryDelay(1)).toBe(2_000);
    expect(getRetryDelay(3)).toBe(8_000);
    expect(getRetryDelay(20)).toBe(SYNC_MAX_RETRY_DELAY_MS);
  });

  it('agenda a próxima tentativa e conta a tentativa', () => {
    const retried = scheduleRetry(buildSyncOperation({ attempts: 1 }), 10_000);

    expect(retried.attempts).toBe(2);
    expect(retried.nextAttemptAt).toBe(12_000);
  });

  it('só considera pronta a operação cujo horário já chegou', () => {
    const operation = buildSyncOperation({ nextAttemptAt: 100 });

    expect(isReadyToSync(operation, 99)).toBe(false);
    expect(isReadyToSync(operation, 100)).toBe(true);
  });
});
