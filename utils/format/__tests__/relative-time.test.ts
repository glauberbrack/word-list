import { formatRelativeTime } from '../relative-time';

const now = Date.UTC(2026, 10, 9, 12);
const ago = (ms: number) => now - ms;

describe('formatRelativeTime', () => {
  it('descreve o tempo passado em português', () => {
    expect(formatRelativeTime(ago(10_000), now)).toBe('agora');
    expect(formatRelativeTime(ago(5 * 60_000), now)).toBe('há 5 min');
    expect(formatRelativeTime(ago(3 * 3_600_000), now)).toBe('há 3 h');
    expect(formatRelativeTime(ago(86_400_000), now)).toBe('há 1 dia');
    expect(formatRelativeTime(ago(2 * 86_400_000), now)).toBe('há 2 dias');
    expect(formatRelativeTime(ago(65 * 86_400_000), now)).toBe('há 2 meses');
  });

  it('trata horários no futuro como agora', () => {
    expect(formatRelativeTime(now + 5_000, now)).toBe('agora');
  });
});
