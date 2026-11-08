import { isFavoriteActive, listActiveFavorites, toggleFavorite } from '../favorites';

describe('toggleFavorite', () => {
  it('cria o favorito quando ainda não existe', () => {
    expect(toggleFavorite(undefined, 'hello', 10)).toEqual({
      word: 'hello',
      createdAt: 10,
      updatedAt: 10,
      deleted: false,
    });
  });

  it('marca como removido mantendo a data de criação', () => {
    const current = toggleFavorite(undefined, 'hello', 10);

    expect(toggleFavorite(current, 'hello', 20)).toEqual({
      word: 'hello',
      createdAt: 10,
      updatedAt: 20,
      deleted: true,
    });
  });

  it('favorita de novo uma palavra removida', () => {
    const removed: TFavorite = { word: 'hello', createdAt: 10, updatedAt: 20, deleted: true };

    expect(toggleFavorite(removed, 'hello', 30).deleted).toBe(false);
  });
});

describe('listActiveFavorites', () => {
  it('ignora removidos e ordena do mais recente para o mais antigo', () => {
    const items: Record<string, TFavorite> = {
      a: { word: 'a', createdAt: 1, updatedAt: 1, deleted: false },
      b: { word: 'b', createdAt: 3, updatedAt: 3, deleted: false },
      c: { word: 'c', createdAt: 2, updatedAt: 4, deleted: true },
    };

    expect(listActiveFavorites(items).map((item) => item.word)).toEqual(['b', 'a']);
  });
});

describe('isFavoriteActive', () => {
  it('só é verdadeiro para favoritos existentes e não removidos', () => {
    expect(isFavoriteActive(undefined)).toBe(false);
    expect(isFavoriteActive({ word: 'a', createdAt: 1, updatedAt: 1, deleted: true })).toBe(false);
    expect(isFavoriteActive({ word: 'a', createdAt: 1, updatedAt: 1, deleted: false })).toBe(true);
  });
});
