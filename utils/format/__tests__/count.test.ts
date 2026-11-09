import { formatQuantity, formatThousands } from '../count';

describe('count', () => {
  it('separa milhares com ponto', () => {
    expect(formatThousands(370098)).toBe('370.098');
    expect(formatThousands(999)).toBe('999');
    expect(formatThousands(1234567)).toBe('1.234.567');
  });

  it('usa singular só para 1', () => {
    expect(formatQuantity(1, 'favorita', 'favoritas')).toBe('1 favorita');
    expect(formatQuantity(0, 'favorita', 'favoritas')).toBe('0 favoritas');
    expect(formatQuantity(370098, 'palavra', 'palavras')).toBe('370.098 palavras');
  });
});
