'use client';

import Link from 'next/link';
import { useChart } from '@/contexts/ChartContext';
import { ManseryeokChart } from '@/components/ManseryeokChart';

export function ExploreDashboard() {
  const { chart, ready, clear } = useChart();

  if (!ready) {
    return (
      <div className="explore-empty">
        <p>8-BIT…</p>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="explore-empty">
        <h1>명리 탐색</h1>
        <p>아직 8글자 좌표가 없습니다. 먼저 생년월일시를 입력해 주세요.</p>
        <Link href="/" className="btn btn--primary">
          8글자 추출하기
        </Link>
      </div>
    );
  }

  const { hour, day, month, year } = chart.pillars;

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.35em] text-[var(--text-muted)]">만세력</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 tracking-wide text-[var(--text)]">
            {hour.unknown ? '??' : hour.pillar} · {day.pillar} · {month.pillar} ·{' '}
            {year.pillar}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{chart.meta.lunarDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="btn btn--ghost btn--sm">
            다시 입력
          </Link>
          <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
            초기화
          </button>
        </div>
      </header>

      <ManseryeokChart chart={chart} />
    </>
  );
}
