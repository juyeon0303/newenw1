'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExploreDashboard } from '@/components/explore/ExploreDashboard';
import { SynergyClient } from '@/components/SynergyClient';
import { LifestyleClient } from '@/components/lifestyle/LifestyleClient';

type ExploreTab = 'dashboard' | 'synergy' | 'lifestyle';

const TABS: { id: ExploreTab; label: string }[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'synergy', label: '시너지' },
  { id: 'lifestyle', label: '라이프' },
];

function tabFromParam(raw: string | null): ExploreTab {
  if (raw === 'synergy' || raw === 'lifestyle') return raw;
  return 'dashboard';
}

function ExploreClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = tabFromParam(searchParams.get('tab'));

  const setTab = useCallback(
    (next: ExploreTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === 'dashboard') params.delete('tab');
      else params.set('tab', next);
      const q = params.toString();
      router.push(q ? `/explore?${q}` : '/explore');
    },
    [router, searchParams],
  );

  return (
    <div className="explore-route px-2 py-6 md:py-10 max-w-5xl mx-auto">
      <nav className="explore-tabs" aria-label="명리 탐색">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'dashboard' && <ExploreDashboard />}
      {tab === 'synergy' && (
        <Suspense fallback={<p className="synergy-muted">…</p>}>
          <SynergyClient embedded />
        </Suspense>
      )}
      {tab === 'lifestyle' && <LifestyleClient embedded />}
    </div>
  );
}

export function ExploreClient() {
  return (
    <Suspense
      fallback={
        <div className="explore-empty">
          <p>8-BIT…</p>
        </div>
      }
    >
      <ExploreClientInner />
    </Suspense>
  );
}
