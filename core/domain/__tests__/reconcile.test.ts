import { favoritesToUpload, historyToUpload, mergeFavorites, mergeHistory } from '../reconcile';

const favorite = (word: string, updatedAt: number, deleted = false): TFavorite => ({
  word,
  createdAt: 1,
  updatedAt,
  deleted,
});

describe('mergeFavorites', () => {
  it('fica com a versão escrita por último em cada palavra', () => {
    const local = { hello: favorite('hello', 20, true), world: favorite('world', 5) };
    const remote = { hello: favorite('hello', 10), extra: favorite('extra', 7) };

    expect(mergeFavorites(remote, local)).toEqual({
      hello: favorite('hello', 20, true),
      world: favorite('world', 5),
      extra: favorite('extra', 7),
    });
  });
});

describe('favoritesToUpload', () => {
  it('envia só o que o servidor não tem ou tem mais antigo', () => {
    const merged = {
      hello: favorite('hello', 20, true),
      world: favorite('world', 5),
      extra: favorite('extra', 7),
    };
    const remote = { hello: favorite('hello', 10), extra: favorite('extra', 7) };

    expect(favoritesToUpload(merged, remote)).toEqual([
      { entity: 'favorite', type: 'delete', word: 'hello', at: 20 },
      { entity: 'favorite', type: 'upsert', word: 'world', at: 5 },
    ]);
  });
});

describe('history', () => {
  it('mantém a visualização mais recente e envia o que falta no servidor', () => {
    const local = { hello: { word: 'hello', viewedAt: 30 } };
    const remote = {
      hello: { word: 'hello', viewedAt: 10 },
      other: { word: 'other', viewedAt: 5 },
    };
    const merged = mergeHistory(remote, local);

    expect(merged.hello?.viewedAt).toBe(30);
    expect(merged.other?.viewedAt).toBe(5);
    expect(historyToUpload(merged, remote)).toEqual([
      { entity: 'history', type: 'upsert', word: 'hello', at: 30 },
    ]);
  });
});
