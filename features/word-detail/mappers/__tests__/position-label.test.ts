import { toPositionLabel } from '../position-label';

describe('toPositionLabel', () => {
  it('mostra a posição na lista de palavras', () => {
    expect(toPositionLabel('list', { index: 135716, total: 370098 })).toBe(
      'palavra 135.716 de 370.098',
    );
  });

  it('mostra a posição no histórico e nos favoritos', () => {
    expect(toPositionLabel('history', { index: 2, total: 5 })).toBe('2 de 5 no histórico');
    expect(toPositionLabel('favorites', { index: 1, total: 3 })).toBe('favorita 1 de 3');
  });

  it('esconde enquanto o total não é conhecido', () => {
    expect(toPositionLabel('list', { index: 9, total: null })).toBeNull();
    expect(toPositionLabel('list', null)).toBeNull();
  });
});
