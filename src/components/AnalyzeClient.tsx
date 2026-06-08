'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  calculateManseryeok,
  type ManseryeokInput,
  type ManseryeokResult,
} from '@/lib/manseryeok';
import { buildPersonalitySummary } from '@/lib/personality';
import { EightCodeBirthForm } from '@/components/eightcode/EightCodeBirthForm';
import { GradientCard } from '@/components/eightcode/GradientCard';
import { ElementChart } from '@/components/eightcode/ElementChart';
import { DaewoonTimeline } from '@/components/eightcode/DaewoonTimeline';
import { StoryExportCard } from '@/components/eightcode/StoryExportCard';
import {
  birthFormToInput,
  loadSavedSession,
  saveSession,
} from '@/lib/session/explore-storage';

export function AnalyzeClient() {
  const [chart, setChart] = useState<ManseryeokResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadSavedSession();
    if (!saved?.input) {
      setLoading(false);
      return;
    }
    try {
      setChart(calculateManseryeok(birthFormToInput(saved.input)));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!chart?.meta.input) return;
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
        longitude: v.timeCorrection?.longitude ?? 127,
      },
      lastTab: 'chart',
    });
  }, [chart]);

  const summary = useMemo(
    () => (chart ? buildPersonalitySummary(chart) : null),
    [chart],
  );

  function handleSubmit(input: ManseryeokInput) {
    try {
      setError(null);
      setChart(calculateManseryeok(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : '계산 오류');
    }
  }

  function handleReset() {
    setChart(null);
    setError(null);
  }

  const savedInput = loadSavedSession()?.input;
  const formInitial = savedInput
    ? {
        year: savedInput.year,
        month: savedInput.month,
        day: savedInput.day,
        hour: savedInput.hour,
        minute: savedInput.minute,
        gender: savedInput.gender,
      }
    : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-white/40 text-sm tracking-widest"
        >
          8CODE…
        </motion.div>
      </div>
    );
  }

  if (!chart || !summary) {
    return (
      <div className="flex flex-col items-center justify-center px-2 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg rounded-3xl p-[1px] bg-gradient-to-br from-violet-500/80 via-fuchsia-500/60 to-amber-400/50"
        >
          <div className="rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/5 px-8 py-10 md:px-12 md:py-14">
            <header className="text-center mb-10">
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold tracking-[0.2em]"
              >
                8CODE
              </motion.h1>
              <p className="text-white/45 text-sm mt-2 tracking-widest">에잇코드</p>
              <p className="text-white/55 text-sm mt-6 leading-relaxed">
                생년월일시로 만세력 좌표를 산출합니다.
                <br />
                미니멀 입력, 벤토 결과.
              </p>
            </header>
            <EightCodeBirthForm onSubmit={handleSubmit} initial={formInitial} />
            {error && (
              <p className="text-rose-400/90 text-sm text-center mt-4">{error}</p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-2 py-6 md:py-10 max-w-5xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs tracking-[0.35em] text-white/40">8CODE RESULT</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            {chart.pillars.day.pillar}
            <span className="text-white/40 font-normal text-lg ml-3">
              {chart.pillars.hour.pillar} · {chart.pillars.month.pillar} ·{' '}
              {chart.pillars.year.pillar}
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn--ghost btn--sm"
          >
            다시 입력
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 auto-rows-min">
        <GradientCard
          className="md:col-span-1"
          gradient="from-cyan-500 via-violet-500 to-fuchsia-500"
          delay={0.05}
        >
          <h2 className="text-sm font-medium text-white/50 mb-4">타고난 오행 비율</h2>
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
    </div>
  );
}
