import type { BirthFormValues } from '@/components/BirthForm';
import type { ManseryeokInput } from '@/lib/manseryeok';

const SESSION_KEY = 'saju-explore-session';
const DATA_PREFIX = 'saju-explore-data:';

export interface MemoryFragment {
  id: string;
  text: string;
  createdAt: number;
  /** relation:xxx, tenstar:상관 등 */
  tag?: string;
}

export interface ItemNote {
  text: string;
  updatedAt: number;
}

export interface BookmarkEntry {
  id: string;
  text: string;
  itemLabel: string;
  savedAt: number;
}

export interface ChartExploreData {
  version: 1;
  visited: Record<string, number>;
  notes: Record<string, ItemNote>;
  bookmarks: BookmarkEntry[];
  memories: MemoryFragment[];
  lastItemKey?: string;
}

export interface SavedSession {
  version: 1;
  savedAt: number;
  input: BirthFormValues;
  lastTab: 'chart' | 'explore' | 'journal' | 'daily';
}

function defaultChartData(): ChartExploreData {
  return {
    version: 1,
    visited: {},
    notes: {},
    bookmarks: [],
    memories: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadSavedSession(): SavedSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (parsed.version !== 1 || !parsed.input) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: Omit<SavedSession, 'version' | 'savedAt'>): void {
  if (!isBrowser()) return;
  const payload: SavedSession = {
    version: 1,
    savedAt: Date.now(),
    ...session,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function loadChartData(fingerprint: string): ChartExploreData {
  if (!isBrowser()) return defaultChartData();
  try {
    const raw = localStorage.getItem(`${DATA_PREFIX}${fingerprint}`);
    if (!raw) return defaultChartData();
    const parsed = JSON.parse(raw) as ChartExploreData;
    if (parsed.version !== 1) return defaultChartData();
    return {
      ...defaultChartData(),
      ...parsed,
      visited: parsed.visited ?? {},
      notes: parsed.notes ?? {},
      bookmarks: parsed.bookmarks ?? [],
      memories: parsed.memories ?? [],
    };
  } catch {
    return defaultChartData();
  }
}

export function saveChartData(fingerprint: string, data: ChartExploreData): void {
  if (!isBrowser()) return;
  localStorage.setItem(`${DATA_PREFIX}${fingerprint}`, JSON.stringify(data));
}

export function birthFormToInput(v: BirthFormValues): ManseryeokInput {
  return {
    year: v.year,
    month: v.month,
    day: v.day,
    hour: v.hour,
    minute: v.minute,
    gender: v.gender,
    yajasi: v.yajasi,
    timeCorrection: {
      longitude: v.longitude,
      applyEquationOfTime: true,
      applyDst: true,
    },
  };
}
