'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { ManseryeokResult } from '@/lib/manseryeok';
import { buildFreePrincipleReport } from '@/lib/analysis/free-report';
import { FREE_TIER_MANIFESTO, MONETIZATION_TIERS } from '@/lib/business/monetization-plan';
import { GradientCard } from '@/components/eightcode/GradientCard';
import { ManseryeokChart } from '@/components/ManseryeokChart';

interface Props {
  chart: ManseryeokResult;
}

export function PrincipleReport({ chart }: Props) {
  const report = useMemo(() => buildFreePrincipleReport(chart), [chart]);
  const actionTier = MONETIZATION_TIERS.find((t) => t.id === 'action_report');

  return (
    <section className="principle-report space-y-4 md:space-y-5 mt-6">
      <header className="principle-report__intro">
        <p className="text-xs tracking-[0.25em] text-white/40">OPEN PRINCIPLE · 무료</p>
        <h2 className="text-xl font-semibold mt-1">명리 원리 공개 리포트</h2>
        <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-2xl">
          {FREE_TIER_MANIFESTO}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <GradientCard gradient="from-indigo-500 via-violet-500 to-purple-600" delay={0.22}>
          <h3 className="text-sm font-medium text-white/50 mb-3">월령 · 당령</h3>
          <p className="text-lg font-semibold">
            생령 {report.monthCommand.saenglingKo} · 당령 {report.monthCommand.dangryeongKo}
          </p>
          <p className="text-sm text-white/65 mt-3 leading-relaxed">
            {report.monthCommand.principle}
          </p>
        </GradientCard>

        <GradientCard gradient="from-violet-500 via-purple-500 to-fuchsia-500" delay={0.24}>
          <h3 className="text-sm font-medium text-white/50 mb-3">격국 (월간 기준)</h3>
          <p className="text-lg font-semibold">{report.gyeokguk.name}</p>
          <p className="text-sm text-white/65 mt-2">{report.gyeokguk.basis}</p>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">{report.gyeokguk.principle}</p>
          <Link href="/wiki" className="principle-report__wiki-link">
            격국 · 명리 위키 →
          </Link>
        </GradientCard>

        <GradientCard gradient="from-cyan-600 via-blue-500 to-indigo-500" delay={0.26}>
          <h3 className="text-sm font-medium text-white/50 mb-3">일간 강약</h3>
          <p className="text-lg font-semibold">
            {report.dayMaster.stemKo}({report.dayMaster.elementKo}) ·{' '}
            {report.dayMaster.strength === 'strong'
              ? '신강'
              : report.dayMaster.strength === 'weak'
                ? '신약'
                : '중화'}
          </p>
          <p className="text-sm text-white/65 mt-2">{report.dayMaster.strengthReason}</p>
          <p className="text-sm text-white/50 mt-2">{report.dayMaster.monthCommandFit}</p>
        </GradientCard>

        <GradientCard gradient="from-emerald-500 via-teal-500 to-cyan-500" delay={0.28}>
          <h3 className="text-sm font-medium text-white/50 mb-3">용신 후보 (1차)</h3>
          <ul className="text-sm text-white/75 space-y-1.5 list-none p-0 m-0">
            {report.yongsin.candidates.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
          <p className="text-sm text-white/55 mt-3">{report.yongsin.principle}</p>
          <p className="text-xs text-white/40 mt-2">{report.yongsin.disclaimer}</p>
          <Link href="/wiki" className="principle-report__wiki-link">
            용신 · 명리 위키 →
          </Link>
        </GradientCard>

        <GradientCard
          className="md:col-span-2"
          gradient="from-amber-500 via-orange-500 to-rose-500"
          delay={0.3}
        >
          <h3 className="text-sm font-medium text-white/50 mb-3">십성 분포</h3>
          <p className="text-sm text-white/60 mb-4">{report.elementBalance.principle}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {report.tenStarSummary.map((t) => (
              <span
                key={t.name}
                className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10"
              >
                {t.name} ×{t.count}
              </span>
            ))}
          </div>
          <ul className="principle-report__hits">
            {report.tenStars.map((h) => (
              <li key={h.label}>
                <span>{h.label}</span>
                <Link href="/wiki" className="principle-report__wiki-link">
                  읽기
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/wiki" className="principle-report__wiki-link mt-3 inline-block">
            십성 · 명리 위키 →
          </Link>
        </GradientCard>

        {(report.branchRelations.length > 0 || report.spirits.length > 0) && (
          <GradientCard
            className="md:col-span-2"
            gradient="from-slate-500 via-zinc-600 to-slate-700"
            delay={0.32}
          >
            <h3 className="text-sm font-medium text-white/50 mb-3">지지 관계 · 신살</h3>
            {report.branchRelations.length > 0 && (
              <ul className="text-sm text-white/70 space-y-2 mb-4">
                {report.branchRelations.map((r) => (
                  <li key={r.label}>
                    <strong className="text-white/90">{r.label}</strong> — {r.note}
                  </li>
                ))}
              </ul>
            )}
            {report.spirits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.spirits.map((s) => (
                  <Link
                    key={s}
                    href="/wiki"
                    className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/15 hover:border-violet-400/40"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            )}
          </GradientCard>
        )}

        <GradientCard
          className="md:col-span-2"
          gradient="from-zinc-600 via-zinc-700 to-zinc-800"
          delay={0.34}
        >
          <h3 className="text-sm font-medium text-white/50 mb-2">상세 만세력 차트</h3>
          <p className="text-xs text-white/45 mb-4">{report.transparencyNote}</p>
          <ManseryeokChart chart={chart} />
        </GradientCard>

        {actionTier && (
          <article className="principle-report__coming md:col-span-2">
            <p className="text-xs tracking-widest text-white/35">COMING SOON · 유료 예정</p>
            <h3 className="text-base font-medium mt-1 text-white/70">{actionTier.title}</h3>
            <p className="text-sm text-white/45 mt-2">{actionTier.rationale}</p>
            <p className="text-xs text-white/30 mt-2">예상 {actionTier.priceHint} — 아직 결제 없음</p>
          </article>
        )}
      </div>
    </section>
  );
}
