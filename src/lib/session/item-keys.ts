/** 탐구 노트·진행률용 localStorage 키 */

export function relationItemKey(key: string): string {
  return `relation:${key}`;
}

export function tenStarItemKey(name: string): string {
  return `tenstar:${name}`;
}

export function hiddenItemKey(name: string): string {
  return `hidden:${name}`;
}

export function spiritItemKey(name: string): string {
  return `spirit:${name}`;
}

export function daewoonItemKey(startAge: number): string {
  return `daewoon:${startAge}`;
}

export function monthCommandItemKey(): string {
  return 'month-command:season';
}

export function overviewStorageKey(category: string, key: string): string {
  if (category === 'hidden') return hiddenItemKey(key);
  if (category === 'tenstar') return tenStarItemKey(key);
  if (category === 'spirit') return spiritItemKey(key);
  return relationItemKey(key);
}

export function parseStorageKey(full: string): { category: string; key: string } {
  const i = full.indexOf(':');
  if (i < 0) return { category: 'unknown', key: full };
  const head = full.slice(0, i);
  const rest = full.slice(i + 1);
  if (head === 'month-command') return { category: 'month-command', key: rest };
  return { category: head, key: rest };
}
