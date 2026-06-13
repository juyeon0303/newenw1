'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useChart } from '@/contexts/ChartContext';
import { buildPersonalitySummary } from '@/lib/personality';
import { buildFreePrincipleReport } from '@/lib/analysis/free-report';
import { GradientCard } from '@/components/eightcode/GradientCard';
import { ElementChart } from '@/components/eightcode/ElementChart';
import { DaewoonTimeline } from '@/components/eightcode/DaewoonTimeline';
import { StoryExportCard } from '@/components/eightcode/StoryExportCard';
import { PrincipleReport } from '@/components/eightcode/PrincipleReport';
import { ExploreInterpretationPanel } from '@/components/explore/ExploreInterpretationPanel';
import { HoverTip } from '@/components/ui/HoverTip';

export function ExploreDashboard() {
  const { chart, ready, clear } = useChart();

  const summary = useMemo(
    () => (chart ? buildPersonalitySummary(chart) : null),
    [chart],
  );
  const report = useMemo(
    () => (chart ? buildFreePrincipleReport(chart) : null),
    [chart],
  );

  if (!ready) {
    return (
      <div className="explore-empty">
        <p>8-BIT…</p>
      </div>
    );
  }

  if (!chart || !summary || !report) {
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

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs tracking-[0.35em] text-white/40">FREE · 명리 탐색</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            {chart.pillars.day.pillar}
            <span className="text-white/40 font-normal text-lg ml-3">
              {chart.pillars.hour.unknown ? '시간모름' : chart.pillars.hour.pillar} ·{' '}
              {chart.pillars.month.pillar} · {chart.pillars.year.pillar}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/community" className="btn btn--ghost btn--sm">
            운명 광장
          </Link>
          <Link href="/" className="btn btn--ghost btn--sm">
            다시 입력
          </Link>
          <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
            초기화
          </button>
        </div>
      </motion.header>

      <div className="explore-stats mb-6">
        <HoverTip tip={report.gyeokguk.principle}>
          <span className="explore-stats__chip">
            격국 <strong>{report.gyeokguk.name}</strong>
          </span>
        </HoverTip>
        <HoverTip tip={report.yongsin.principle}>
          <span className="explore-stats__chip">
            용신 <strong>{report.yongsin.candidates[0]}</strong>
          </span>
        </HoverTip>
        <HoverTip tip={report.dayMaster.strengthReason}>
          <span className="explore-stats__chip">
            일간 <strong>{report.dayMaster.stemKo}</strong> ·{' '}
            {report.dayMaster.strength === 'strong'
              ? '신강'
              : report.dayMaster.strength === 'weak'
                ? '신약'
                : '중화'}
          </span>
        </HoverTip>
        <HoverTip tip={report.monthCommand.principle}>
          <span className="explore-stats__chip">
            당령 <strong>{report.monthCommand.dangryeongKo}</strong>
          </span>
        </HoverTip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 auto-rows-min">
        <GradientCard
          className="md:col-span-1"
          gradient="from-cyan-500 via-violet-500 to-fuchsia-500"
          delay={0.05}
        >
          <h2 className="text-sm font-medium text-white/50 mb-4 flex items-center gap-1">
            <HoverTip tip={report.elementBalance.principle}>
              <span>타고난 오행 비율</span>
            </HoverTip>
          </h2>
          <ElementChart counts={chart.elementCount} />
        </GradientCard>

        <GradientCard
          className="md:col-span-1"
          gradient="from-amber-400 via-orange-500 to-rose-500"
          delay={0.1}
        >
          <h2 className="text-sm font-medium text-white/50 mb-3">성향 요약</h2>
          <p className="text-lg font-semibold leading-snug">{summary.headline}</p>
          <p className="text-sm text-white/65 mt-4 leading-relaxed">{summary.body}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {summary.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </GradientCard>

        <GradientCard
          className="md:col-span-2"
          gradient="from-violet-600 via-indigo-500 to-cyan-400"
          delay={0.15}
        >
          <h2 className="text-sm font-medium text-white/50 mb-4">10년 대운 타임라인</h2>
          <DaewoonTimeline
            daewoon={chart.daewoon}
            chart={chart}
            currentIndex={chart.luckMeta.currentDaewoonIndex}
          />
        </GradientCard>

        <GradientCard
          className="md:col-span-2"
          gradient="from-fuchsia-500 via-pink-500 to-violet-600"
          delay={0.2}
        >
          <h2 className="text-sm font-medium text-white/50 mb-4">스토리 공유 카드</h2>
          <StoryExportCard chart={chart} />
        </GradientCard>
      </div>

      <PrincipleReport chart={chart} />

      <ExploreInterpretationPanel chart={chart} />

      <aside className="explore-premium-teaser">
        <p className="text-xs tracking-widest text-white/35">PREMIUM ZONE</p>
        <p className="text-sm text-white/55 mt-1">
          원리는 무료입니다. 인생 타이밍 가이드는{' '}
          <Link href="/premium">프리미엄</Link>에서 준비 중입니다.
        </p>
      </aside>
    </>
  );
}
