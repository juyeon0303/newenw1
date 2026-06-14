export function normalizeChatBody(body: unknown): string | null {
  if (typeof body !== 'string') return null;
  const trimmed = body.trim().replace(/\s+/g, ' ');
  if (trimmed.length < 1 || trimmed.length > 280) return null;
  return trimmed;
}
