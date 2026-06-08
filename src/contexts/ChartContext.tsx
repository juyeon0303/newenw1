'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  calculateManseryeok,
  type ManseryeokInput,
  type ManseryeokResult,
} from '@/lib/manseryeok';
import {
  birthFormToInput,
  clearSavedSession,
  loadSavedSession,
  saveSession,
} from '@/lib/session/explore-storage';

interface ChartContextValue {
  chart: ManseryeokResult | null;
  ready: boolean;
  error: string | null;
  compute: (input: ManseryeokInput) => ManseryeokResult;
  clear: () => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

function inputToSaved(chart: ManseryeokResult) {
  const v = chart.meta.input;
  saveSession({
    input: {
      year: v.year,
      month: v.month,
      day: v.day,
      hour: v.hour,
      minute: v.minute ?? 0,
      gender: v.gender,
      yajasi: v.yajasi ?? false,
      unknownTime: v.unknownTime ?? false,
    },
    lastTab: 'chart',
  });
}

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const [chart, setChart] = useState<ManseryeokResult | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSavedSession();
    if (saved?.input) {
      try {
        setChart(calculateManseryeok(birthFormToInput(saved.input)));
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  const compute = useCallback((input: ManseryeokInput) => {
    const result = calculateManseryeok(input);
    setChart(result);
    setError(null);
    inputToSaved(result);
    return result;
  }, []);

  const clear = useCallback(() => {
    clearSavedSession();
    setChart(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ chart, ready, error, compute, clear }),
    [chart, ready, error, compute, clear],
  );

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChart must be used within ChartProvider');
  return ctx;
}
