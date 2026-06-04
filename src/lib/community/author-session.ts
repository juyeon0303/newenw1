const STORAGE_KEY = 'saju-explore-community-author';

export interface CommunityAuthor {
  id: string;
  name: string;
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function loadAuthor(): CommunityAuthor | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CommunityAuthor;
    if (typeof parsed?.id === 'string' && typeof parsed?.name === 'string') {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveAuthor(author: CommunityAuthor): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(author));
}

export function ensureAuthor(displayName: string): CommunityAuthor {
  const existing = loadAuthor();
  const name = displayName.trim() || existing?.name || '익명';
  const author: CommunityAuthor = {
    id: existing?.id ?? randomId(),
    name,
  };
  saveAuthor(author);
  return author;
}
