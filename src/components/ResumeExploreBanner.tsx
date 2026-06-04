'use client';

import Link from 'next/link';
import {
  loadSavedSession,
  birthFormToInput,
  loadChartData,
} from '@/lib/session/explore-storage';
import { chartLabel, chartFingerprint } from '@/lib/session/chart-fingerprint';

export function ResumeExploreBanner() {
  const saved = loadSavedSession();
  if (!saved) return null;

  const fp = chartFingerprint(birthFormToInput(saved.input));
  const data = loadChartData(fp);
  const visited = Object.keys(data.visited).length;
  const notes = Object.keys(data.notes).length;

  return (
    <div className="resume-banner">
      <p>
        <strong>{chartLabel(birthFormToInput(saved.input))}</strong>
        {visited > 0 || notes > 0
          ? ` — 탐구 ${visited}항목 · 노트 ${notes}개 저장됨`
          : ' — 이 브라우저에 저장됨'}
      </p>
      <Link href="/explore" className="btn btn--primary resume-banner__link">
        이어서 탐구하기
      </Link>
    </div>
  );
}
