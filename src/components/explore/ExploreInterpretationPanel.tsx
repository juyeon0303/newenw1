'use client';

import { useMemo } from 'react';
import type { ManseryeokResult } from '@/lib/manseryeok';
import { buildInterpretationProfile } from '@/lib/interpretation/engine';
import { CommentaryBlock } from '@/components/CommentaryBlock';
import { EIGHT_BIT_SUPERIORITY } from '@/lib/business/competitive-landscape';

interface Props {
  chart: ManseryeokResult;
}

export function ExploreInterpretationPanel({ chart }: Props) {
  const profile = useMemo(() => buildInterpretationProfile(chart), [chart]);

  return (
    <section className="interpretation-panel mt-8 space-y-6">
      <header className="interpretation-panel__header">
        <p className="text-xs tracking-[0.25em] text-white/40">OPEN INTERPRETATION · 탐구</p>
        <h2 className="text-xl font-semibold mt-1">철학 맞춤 해설</h2>
        <p className="text-sm text-white/55 mt-2 leading-relaxed max-w-2xl">
          {profile.policy.superiorityHeadline}. 경쟁 앱의 블랙박스·LLM 서술 대신,{' '}
          <strong className="text-white/70 font-medium">우선순위 엔진 + 고전 출처 + 탐구 질문</strong>
          으로 읽습니다.
        </p>
      </header>

      <details className="interpretation-panel__vs">
        <summary>경쟁 서비스 대비 8-BIT 방식</summary>
        <ul className="interpretation-panel__vs-list">
          {EIGHT_BIT_SUPERIORITY.pillars.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <span className="interpretation-panel__vs-them">그들: {p.vs}</span>
              <span className="interpretation-panel__vs-us">우리: {p.ours}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="interpretation-panel__prompts">
        <h3 className="interpretation-panel__sub">일간 탐구 질문</h3>
        <ul>
          {profile.dayMasterPrompts.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="interpretation-insights">
        <h3 className="interpretation-panel__sub">우선순위 해설 ({profile.insights.length})</h3>
        <p className="text-xs text-white/45 mb-4">
          {profile.policy.explorePhilosophy.body.slice(0, 120)}…
        </p>
        <div className="interpretation-insights__list space-y-4">
          {profile.insights.map((ins) => (
            <article key={ins.id} className="interpretation-insight">
              <div className="interpretation-insight__head">
                <span className={`interpretation-insight__tier interpretation-insight__tier--${ins.tier}`}>
                  {ins.tierLabel}
                </span>
                <h4>{ins.label}</h4>
                {ins.reason && (
                  <p className="interpretation-insight__reason">가중: {ins.reason}</p>
                )}
              </div>
              {ins.questions.length > 0 && (
                <ul className="interpretation-insight__questions">
                  {ins.questions.slice(0, 2).map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              )}
              {ins.commentary && <CommentaryBlock note={ins.commentary} />}
            </article>
          ))}
        </div>
      </div>

      <div className="interpretation-axes">
        <h3 className="interpretation-panel__sub">탐구 4축</h3>
        <div className="interpretation-axes__grid">
          {profile.axes.map((axis) => (
            <article key={axis.id} className="interpretation-axis">
              <h4>{axis.title}</h4>
              <p>{axis.opener}</p>
              <ul>
                {axis.prompts.slice(0, 1).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="interpretation-month">
        <h3 className="interpretation-panel__sub">월령 · 당령 맥락</h3>
        <CommentaryBlock note={profile.monthCommandNote} />
      </div>
    </section>
  );
}
