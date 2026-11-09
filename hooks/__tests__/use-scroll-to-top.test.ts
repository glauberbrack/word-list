import { isPastScrollToTopThreshold } from '../use-scroll-to-top';

describe('isPastScrollToTopThreshold', () => {
  it('só aparece depois de rolar mais de uma tela e meia', () => {
    expect(isPastScrollToTopThreshold(0, 800)).toBe(false);
    expect(isPastScrollToTopThreshold(1200, 800)).toBe(false);
    expect(isPastScrollToTopThreshold(1201, 800)).toBe(true);
  });

  it('não aparece antes de saber a altura da lista', () => {
    expect(isPastScrollToTopThreshold(5000, 0)).toBe(false);
  });
});
