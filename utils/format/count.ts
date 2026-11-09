export function formatThousands(value: number): string {
  return String(Math.trunc(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatQuantity(value: number, singular: string, plural: string): string {
  return `${formatThousands(value)} ${value === 1 ? singular : plural}`;
}
