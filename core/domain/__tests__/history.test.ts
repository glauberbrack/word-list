import { listHistory, recordView } from '../history';

describe('history', () => {
  it('registra a palavra com o horário da visualização', () => {
    expect(recordView('hello', 42)).toEqual({ word: 'hello', viewedAt: 42 });
  });

  it('lista da visualização mais recente para a mais antiga', () => {
    const items = {
      a: recordView('a', 1),
      b: recordView('b', 3),
      c: recordView('c', 2),
    };

    expect(listHistory(items).map((item) => item.word)).toEqual(['b', 'c', 'a']);
  });
});
