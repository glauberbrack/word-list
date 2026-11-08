import { getNextCursor } from '../pagination';

const entries = (ids: number[]): TWordEntry[] => ids.map((id) => ({ id, word: `w${id}` }));

describe('getNextCursor', () => {
  it('usa o id do último item quando a página veio cheia', () => {
    expect(getNextCursor(entries([1, 2, 3]), 3)).toBe(3);
  });

  it('retorna null quando a página veio incompleta', () => {
    expect(getNextCursor(entries([4, 5]), 3)).toBeNull();
    expect(getNextCursor([], 3)).toBeNull();
  });
});
