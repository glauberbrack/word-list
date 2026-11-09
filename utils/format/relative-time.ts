const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;

function plural(value: number, singular: string, pluralForm: string) {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

export function formatRelativeTime(timestamp: number, now: number): string {
  const elapsed = Math.max(now - timestamp, 0);

  if (elapsed < MINUTE_MS) return 'agora';
  if (elapsed < HOUR_MS) return `há ${Math.floor(elapsed / MINUTE_MS)} min`;
  if (elapsed < DAY_MS) return `há ${Math.floor(elapsed / HOUR_MS)} h`;
  if (elapsed < MONTH_MS) return `há ${plural(Math.floor(elapsed / DAY_MS), 'dia', 'dias')}`;

  return `há ${plural(Math.floor(elapsed / MONTH_MS), 'mês', 'meses')}`;
}
