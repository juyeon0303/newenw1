export function formatCommunityDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function categoryLabel(
  categories: readonly { id: string; label: string }[],
  id: string,
): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
