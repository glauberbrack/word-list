import { createMemoryKeyValueStorage } from '@/test/memory-key-value-storage';

import { createFavoritesRepository } from '../favorites.repository';

describe('createFavoritesRepository', () => {
  it('separa os favoritos por usuário', () => {
    const { storage } = createMemoryKeyValueStorage();
    const local = createFavoritesRepository(storage, 'local');
    const other = createFavoritesRepository(storage, 'user-2');

    local.save({ word: 'hello', createdAt: 1, updatedAt: 1, deleted: false });

    expect(Object.keys(local.getAll())).toEqual(['hello']);
    expect(other.getAll()).toEqual({});
  });
});
