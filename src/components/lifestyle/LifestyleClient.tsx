'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  calculateManseryeok,
  type ManseryeokInput,
  type ManseryeokResult,
} from '@/lib/manseryeok';
import { BirthForm, type BirthFormValues } from '@/components/BirthForm';
import { buildCareerMonthlyChart } from '@/lib/lifestyle/career-monthly';
import { buildWealthCalendar } from '@/lib/lifestyle/wealth-calendar';
import { buildTalisman } from '@/lib/lifestyle/talisman';
import { useChart } from '@/contexts/ChartContext';
import { birthFormToInput, loadSavedSession } from '@/lib/session/explore-storage';
import { AlgorithmTransparency } from '@/components/explore/AlgorithmTransparency';
import {
  careerEnergyBreakdown,
  wealthScoreBreakdown,
} from '@/lib/interpretation/transparency';
type Tab = 'career' | 'wealth' | 'lucky' | 'counsel';

const TABS: { id: Tab; label: string }[] = [
  { id: 'career', label: '이직·커리어' },
  { id: 'wealth', label: '재물 달력' },
  { id: 'lucky', label: '행운 부적' },
  { id: 'counsel', label: '운명 공동체' },
];

interface LifestyleClientProps {
  embedded?: boolean;
}

export function LifestyleClient({ embedded = false }: LifestyleClientProps) {
  const { chart: sessionChart, compute } = useChart();
  const [tab, setTab] = useState<Tab>('career');
  const [chart, setChart] = useState<ManseryeokResult | null>(sessionChart);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (sessionChart) {
      setChart(sessionChart);
      return;
    }
    const saved = loadSavedSession();
    if (!saved?.input) return;
    try {
      setChart(calculateManseryeok(birthFormToInput(saved.input)));
    } catch {
      /* ignore */
    }
  }, [sessionChart]);

  const career = useMemo(
    () => (chart ? buildCareerMonthlyChart(chart, year) : null),
    [chart, year],
  );
  const wealth = useMemo(() => (chart ? buildWealthCalendar(chart) : null), [chart]);
  const talisman = useMemo(() => (chart ? buildTalisman(chart) : null), [chart]);

  function handleSubmit(input: ManseryeokInput) {
    setChart(compute(input));
  }

  const formInitial: Partial<BirthFormValues> | undefined = chart?.meta.input
    ? {
        year: chart.meta.input.year,
        month: chart.meta.input.month,
        day: chart.meta.input.day,
        hour: chart.meta.input.hour,
        minute: chart.meta.input.minute ?? 0,
        gender: chart.meta.input.gender,
        yajasi: chart.meta.input.yajasi ?? false,
        unknownTime: chart.meta.input.unknownTime ?? false,
      }
    : undefined;

  return (
    <div className={`lifestyle-page${embedded ? ' lifestyle-page--embedded' : ''}`}>
      {!embedded && (
        <header className="lifestyle-page__header">
          <p className="lifestyle-page__eyebrow">LIFESTYLE · CASH-COW</p>
          <h1>라이프스타일</h1>
          <p className="lifestyle-page__lead">
            커리어·재물·행운·공동체 — 사주 좌표를 매일 켜야 하는 이유.
          </p>
          <Link href="/explore" className="btn btn--ghost btn--sm">
            ← 명리 탐색
          </Link>
        </header>
      )}

      <section className="lifestyle-page__form">
        <BirthForm onSubmit={handleSubmit} initial={formInitial} />
      </section>

      {chart && (
        <>
          <div className="lifestyle-tabs">
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
          </div>

          {tab === 'career' && career && (
            <section className="lifestyle-panel">
              <p className="lifestyle-panel__summary">
                유년 십성·합충 규칙으로 에너지를 산출합니다. 조언은 타이밍 참고용이며, 각 달의
                「점수 산식」에서 근거를 확인할 수 있습니다.
              </p>
              <div className="lifestyle-panel__toolbar">
                <label>
                  연도{' '}
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="lifestyle-year-input"
                  />
                </label>
                <span className="lifestyle-badge">
                  피크 {career.peakMonth}월
                  {career.cautionMonth ? ` · 주의 ${career.cautionMonth}월` : ''}
                </span>
              </div>
              <div className="career-chart">
                {career.months.map((m) => (
                  <div key={m.month} className="career-chart__bar-wrap">
                    <div
                      className="career-chart__bar"
                      style={{ height: `${m.energy}%` }}
                      title={`${m.energy}`}
                    />
                    <span className="career-chart__label">{m.label}</span>
                  </div>
                ))}
              </div>
              <ul className="lifestyle-actions">
                {career.months.map((m) => (
                  <li key={m.month} className="lifestyle-action-card">
                    <div className="lifestyle-action-card__head">
                      <strong>
                        {m.label} · {m.pillar} ({m.stemTenStarKo})
                      </strong>
                      <span className={`lifestyle-energy lifestyle-energy--${m.energy >= 60 ? 'high' : m.energy < 40 ? 'low' : 'mid'}`}>
                        {m.energy}
                      </span>
                    </div>
                    <p>{m.actionItem}</p>
                    {m.tags.length > 0 && (
                      <div className="lifestyle-tags">
                        {m.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <AlgorithmTransparency breakdown={careerEnergyBreakdown(m)} />
                  </li>
                ))}
              </ul>
              <p className="lifestyle-upsell">
                면접 최적 요일·시간 추출권 (2,900원) — 준비 중 · API:{' '}
                <code>POST /api/lifestyle/career</code>
              </p>
            </section>
          )}

          {tab === 'wealth' && wealth && (
            <section className="lifestyle-panel">
              <p className="lifestyle-panel__summary">
                {wealth.startDate} ~ {wealth.endDate} · 매수 유리 {wealth.buyCount}일 ·
                매매 금지 {wealth.avoidCount}일
              </p>
              <div className="wealth-calendar">
                {wealth.days.map((d) => (
                  <div
                    key={d.date}
                    className={`wealth-day wealth-day--${d.signal}`}
                    title={`${d.pillar} ${d.stemTenStarKo} · ${d.score}`}
                  >
                    <span className="wealth-day__date">{d.date.slice(5)}</span>
                    <span className="wealth-day__star">{d.stemTenStarKo}</span>
                  </div>
                ))}
              </div>
              <ul className="lifestyle-alerts">
                {wealth.days
                  .filter((d) => d.alert)
                  .slice(0, 5)
                  .map((d) => (
                    <li key={d.date}>
                      <strong>{d.date}</strong> — {d.alert}
                      <AlgorithmTransparency breakdown={wealthScoreBreakdown(d)} />
                    </li>
                  ))}
              </ul>
              <p className="lifestyle-upsell">
                아침 푸시 알림 (구독) — 준비 중 · API:{' '}
                <code>POST /api/lifestyle/wealth</code>
              </p>
            </section>
          )}

          {tab === 'lucky' && talisman && (
            <section className="lifestyle-panel lifestyle-panel--lucky">
              <div className="talisman-preview">
                <img src={talisman.svgDataUrl} alt="맞춤 행운 배경" className="talisman-preview__img" />
              </div>
              <div className="talisman-meta">
                <h2>부족한 {talisman.missingElement} 기운 · {talisman.mantra}</h2>
                <p>
                  일주 {talisman.dayPillar} — 네온 컬러 맞춤 배경화면 (1080×1920 SVG)
                </p>
                <a
                  href={talisman.svgDataUrl}
                  download={`8-BIT-talisman-${talisman.dayPillar}.svg`}
                  className="btn btn--primary"
                >
                  배경화면 다운로드
                </a>
                <p className="lifestyle-upsell">
                  POD 키링·폰케이스 원클릭 주문 — 파트너 연동 준비 중
                </p>
              </div>
            </section>
          )}

          {tab === 'counsel' && (
            <section className="lifestyle-panel">
              <h2>익명 사주 카운셀링 광장</h2>
              <p className="lifestyle-panel__summary">
                당신의 8-BIT(팔자)를 기반으로 익명 한탄·위로. 비슷한 코드를 가진 사람들이
                모입니다.
              </p>
              <div className="lifestyle-code-card">
                <p className="lifestyle-code-card__pillar">{chart.pillars.day.pillar}</p>
                <p>
                  목{chart.elementCount.木} 화{chart.elementCount.火} 토{chart.elementCount.土}{' '}
                  금{chart.elementCount.金} 수{chart.elementCount.水}
                </p>
              </div>
              <div className="lifestyle-counsel-actions">
                <Link
                  href="/community/new"
                  className="btn btn--primary"
                >
                  익명 글 쓰기
                </Link>
                <Link href="/community" className="btn btn--ghost">
                  운명 공동체 보기
                </Link>
              </div>
              <p className="lifestyle-upsell">
                1:1 젊은 사주 전문가 상담 (중개 수수료) — 전문가 온보딩 준비 중
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
