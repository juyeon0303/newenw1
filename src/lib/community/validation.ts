const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidAuthorId(id: unknown): id is string {
  return typeof id === 'string' && UUID_RE.test(id);
}

export function normalizeAuthorName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (trimmed.length < 1 || trimmed.length > 24) return null;
  return trimmed;
}

export function normalizeTitle(title: unknown): string | null {
  if (typeof title !== 'string') return null;
  const trimmed = title.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return null;
  return trimmed;
}

export function normalizeBody(body: unknown, max = 4000): string | null {
  if (typeof body !== 'string') return null;
  const trimmed = body.trim();
  if (trimmed.length < 5 || trimmed.length > max) return null;
  return trimmed;
}
