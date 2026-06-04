'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BirthFormValues } from '@/components/BirthForm';
import { chartFingerprint } from '@/lib/session/chart-fingerprint';
import {
  type ChartExploreData,
  type MemoryFragment,
  type BookmarkEntry,
  loadChartData,
  loadSavedSession,
  saveChartData,
  saveSession,
} from '@/lib/session/explore-storage';
import type { ManseryeokInput } from '@/lib/manseryeok';

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ExploreSessionApi {
  fingerprint: string | null;
  data: ChartExploreData;
  markVisited: (itemKey: string) => void;
  getNote: (itemKey: string) => string;
  saveNote: (itemKey: string, text: string) => void;
  toggleBookmark: (entry: BookmarkEntry) => void;
  isBookmarked: (questionId: string) => boolean;
  addMemory: (text: string, tag?: string) => void;
  removeMemory: (id: string) => void;
  visitedCount: number;
  noteCount: number;
  setLastItem: (itemKey: string) => void;
}

export function useExploreSession(input: ManseryeokInput | null): ExploreSessionApi {
  const fingerprint = useMemo(
    () => (input ? chartFingerprint(input) : null),
    [input],
  );

  const [data, setData] = useState<ChartExploreData>(() =>
    fingerprint ? loadChartData(fingerprint) : {
      version: 1,
      visited: {},
      notes: {},
      bookmarks: [],
      memories: [],
    },
  );

  useEffect(() => {
    if (!fingerprint) return;
    setData(loadChartData(fingerprint));
  }, [fingerprint]);

  const persist = useCallback(
    (next: ChartExploreData) => {
      if (!fingerprint) return;
      setData(next);
      saveChartData(fingerprint, next);
    },
    [fingerprint],
  );

  const markVisited = useCallback(
    (itemKey: string) => {
      persist({
        ...data,
        visited: { ...data.visited, [itemKey]: Date.now() },
        lastItemKey: itemKey,
      });
    },
    [data, persist],
  );

  const getNote = useCallback(
    (itemKey: string) => data.notes[itemKey]?.text ?? '',
    [data.notes],
  );

  const saveNote = useCallback(
    (itemKey: string, text: string) => {
      const trimmed = text.trim();
      const notes = { ...data.notes };
      if (!trimmed) {
        delete notes[itemKey];
      } else {
        notes[itemKey] = { text: trimmed, updatedAt: Date.now() };
      }
      persist({ ...data, notes, lastItemKey: itemKey });
    },
    [data, persist],
  );

  const toggleBookmark = useCallback(
    (entry: BookmarkEntry) => {
      const exists = data.bookmarks.some((b) => b.id === entry.id);
      const bookmarks = exists
        ? data.bookmarks.filter((b) => b.id !== entry.id)
        : [...data.bookmarks, entry];
      persist({ ...data, bookmarks });
    },
    [data, persist],
  );

  const isBookmarked = useCallback(
    (questionId: string) => data.bookmarks.some((b) => b.id === questionId),
    [data.bookmarks],
  );

  const addMemory = useCallback(
    (text: string, tag?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const mem: MemoryFragment = {
        id: newId(),
        text: trimmed,
        createdAt: Date.now(),
        tag,
      };
      persist({
        ...data,
        memories: [mem, ...data.memories].slice(0, 200),
      });
    },
    [data, persist],
  );

  const removeMemory = useCallback(
    (id: string) => {
      persist({
        ...data,
        memories: data.memories.filter((m) => m.id !== id),
      });
    },
    [data, persist],
  );

  const setLastItem = useCallback(
    (itemKey: string) => {
      persist({ ...data, lastItemKey: itemKey });
    },
    [data, persist],
  );

  const visitedCount = Object.keys(data.visited).length;
  const noteCount = Object.keys(data.notes).length;

  return {
    fingerprint,
    data,
    markVisited,
    getNote,
    saveNote,
    toggleBookmark,
    isBookmarked,
    addMemory,
    removeMemory,
    visitedCount,
    noteCount,
    setLastItem,
  };
}

export function useRestoreSession() {
  return useMemo(() => loadSavedSession(), []);
}

export function persistSessionMeta(
  input: BirthFormValues,
  lastTab: 'chart' | 'explore' | 'journal',
): void {
  saveSession({ input, lastTab });
}
