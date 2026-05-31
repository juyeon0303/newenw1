'use client';

import { useState } from 'react';
import { calculateManseryeok, type ManseryeokInput, type ManseryeokResult } from '@/lib/manseryeok';
import { BirthForm } from '@/components/BirthForm';
import { ManseryeokChart } from '@/components/ManseryeokChart';
import { ExplorePanel } from '@/components/ExplorePanel';

type Tab = 'chart' | 'explore';

export function ExploreClient() {
  const [chart, setChart] = useState<ManseryeokResult | null>(null);
  const [tab, setTab] = useState<Tab>('chart');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(input: ManseryeokInput) {
    try {
      setError(null);
      const result = calculateManseryeok(input);
      setChart(result);
      setTab('chart');
    } catch (e) {
      setError(e instanceof Error ? e.message : '계산 오류');
    }
  }

  return (
    <div className="explore-page">
      <section className="explore-page__form">
        <h1>사주 탐구</h1>
        <p className="lead">
          만세력 데이터는 산출합니다. 해석은 고정하지 않습니다.
          읽다가 떠오른 것만 골라도 됩니다.
        </p>
        <BirthForm onSubmit={handleSubmit} />
        {error && <p className="error">{error}</p>}
      </section>

      {chart && (
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
            </button>
          </div>
          {tab === 'chart' ? <ManseryeokChart chart={chart} /> : <ExplorePanel chart={chart} />}
        </section>
      )}
    </div>
  );
}
