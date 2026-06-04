'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateManseryeok,
  type ManseryeokInput,
  type ManseryeokResult,
} from '@/lib/manseryeok';
import { buildExploreBundle } from '@/lib/philosophy/build-explore';
import { BirthForm, type BirthFormValues } from '@/components/BirthForm';
import { ManseryeokChart } from '@/components/ManseryeokChart';
import { ExplorePanel } from '@/components/ExplorePanel';
import { ExploreJournal } from '@/components/ExploreJournal';
import {
  persistSessionMeta,
  useExploreSession,
  useRestoreSession,
} from '@/hooks/useExploreSession';
import { EXPLORE_PAGE_LEAD } from '@/lib/philosophy/content';
import { birthFormToInput } from '@/lib/session/explore-storage';
import { buildDailyPrompt } from '@/lib/session/daily-prompt';
import { overviewStorageKey } from '@/lib/session/item-keys';

type Tab = 'chart' | 'explore' | 'journal';

export interface ExploreNavigateTarget {
  category: string;
  key: string;
}

export function ExploreClient() {
  const saved = useRestoreSession();
  const [chart, setChart] = useState<ManseryeokResult | null>(() => {
    if (!saved?.input) return null;
    try {
      return calculateManseryeok(birthFormToInput(saved.input));
    } catch {
      return null;
    }
  });
  const [tab, setTab] = useState<Tab>(saved?.lastTab ?? 'chart');
  const [error, setError] = useState<string | null>(null);
  const [navigateTo, setNavigateTo] = useState<ExploreNavigateTarget | null>(null);
  const restored = useRef(false);

  const session = useExploreSession(chart?.meta.input ?? null);
  const bundle = useMemo(
    () => (chart ? buildExploreBundle(chart) : null),
    [chart],
  );

  const dailyPrompt = useMemo(
    () => (chart && bundle ? buildDailyPrompt(chart, bundle) : null),
    [chart, bundle],
  );

  const progressTotal = bundle?.overview.length ?? 0;
  const progressVisited = bundle
    ? bundle.overview.filter((item) =>
        session.data.visited[overviewStorageKey(item.category, item.key)],
      ).length
    : 0;

  const nextUnvisited = bundle?.overview.find(
    (item) => !session.data.visited[overviewStorageKey(item.category, item.key)],
  );

  useEffect(() => {
    if (restored.current || !saved?.input) return;
    restored.current = true;
  }, [saved]);

  useEffect(() => {
    if (!chart?.meta.input) return;
    const v = chart.meta.input;
    persistSessionMeta(
      {
        year: v.year,
        month: v.month,
        day: v.day,
        hour: v.hour,
        minute: v.minute ?? 0,
        gender: v.gender,
        yajasi: v.yajasi ?? false,
        longitude: v.timeCorrection?.longitude ?? 127,
      },
      tab,
    );
  }, [chart, tab]);

  function handleSubmit(input: ManseryeokInput) {
    try {
      setError(null);
      const result = calculateManseryeok(input);
      setChart(result);
      setTab('explore');
    } catch (e) {
      setError(e instanceof Error ? e.message : '계산 오류');
    }
  }

  function handleContinue() {
    if (!nextUnvisited) return;
    setTab('explore');
    setNavigateTo({ category: nextUnvisited.category, key: nextUnvisited.key });
  }

  function handleJournalOpen(category: string, key: string) {
    setTab('explore');
    setNavigateTo({ category, key });
  }

  const formInitial: Partial<BirthFormValues> | undefined = saved?.input ?? chart?.meta.input
    ? {
        year: chart?.meta.input.year ?? saved?.input.year,
        month: chart?.meta.input.month ?? saved?.input.month,
        day: chart?.meta.input.day ?? saved?.input.day,
        hour: chart?.meta.input.hour ?? saved?.input.hour,
        minute: chart?.meta.input.minute ?? saved?.input.minute ?? 0,
        gender: chart?.meta.input.gender ?? saved?.input.gender,
        yajasi: chart?.meta.input.yajasi ?? saved?.input.yajasi,
        longitude: chart?.meta.input.timeCorrection?.longitude ?? saved?.input.longitude,
      }
    : undefined;

  return (
    <div className="explore-page">
      <section className="explore-page__form">
        <h1>사주 탐구</h1>
        <p className="lead">{EXPLORE_PAGE_LEAD}</p>
        {chart && saved && (
          <p className="explore-page__resume">
            이전 탐구가 이 브라우저에 저장되어 있습니다. 이어서 읽을 수 있습니다.
          </p>
        )}
        <BirthForm onSubmit={handleSubmit} initial={formInitial} />
        {error && <p className="error">{error}</p>}
      </section>

      {chart && bundle && (
        <section className="explore-page__result">
          <div className="explore-page__tabs">
            <button
              type="button"
              className={tab === 'chart' ? 'active' : ''}
              onClick={() => setTab('chart')}
            >
              팔자
            </button>
            <button
              type="button"
              className={tab === 'explore' ? 'active' : ''}
              onClick={() => setTab('explore')}
            >
              탐구
              {progressVisited > 0 && (
                <span className="explore-page__tab-badge">{progressVisited}</span>
              )}
            </button>
            <button
              type="button"
              className={tab === 'journal' ? 'active' : ''}
              onClick={() => setTab('journal')}
            >
              노트
              {(session.noteCount > 0 || session.data.memories.length > 0) && (
                <span className="explore-page__tab-badge">
                  {session.noteCount + session.data.memories.length}
                </span>
              )}
            </button>
          </div>

          {tab === 'chart' && <ManseryeokChart chart={chart} />}

          {tab === 'explore' && (
            <ExplorePanel
              chart={chart}
              bundle={bundle}
              session={session}
              dailyPrompt={dailyPrompt}
              progress={{
                visited: progressVisited,
                total: progressTotal,
                notes: session.noteCount,
                memories: session.data.memories.length,
                canContinue: Boolean(nextUnvisited),
                onContinue: handleContinue,
              }}
              navigateTo={navigateTo}
              onNavigateConsumed={() => setNavigateTo(null)}
            />
          )}

          {tab === 'journal' && (
            <ExploreJournal
              chart={chart}
              bundle={bundle}
              session={session}
              onOpenItem={handleJournalOpen}
            />
          )}
        </section>
      )}
    </div>
  );
}
