export function formatLiveTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 60_000) return '방금';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}분`;
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}
