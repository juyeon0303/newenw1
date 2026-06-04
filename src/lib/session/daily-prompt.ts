import type { ManseryeokResult } from '@/lib/manseryeok';
import type { ExploreBundle } from '@/lib/philosophy/build-explore';
import { DAILY_EXPLORE_SEEDS } from '@/lib/philosophy/content';

export interface DailyPrompt {
  title: string;
  body: string;
  /** explore overview item key */
  suggestKey?: string;
  suggestCategory?: 'relation' | 'tenstar' | 'spirit' | 'hidden';
}

const DAY_SEEDS = DAILY_EXPLORE_SEEDS;

/** 날짜 + 팔자 기반 — 매일 다른 한 줄 */
export function buildDailyPrompt(
  chart: ManseryeokResult,
  bundle: ExploreBundle,
  date = new Date(),
): DailyPrompt {
  const year = date.getFullYear();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(year, 0, 0).getTime()) / 86400000,
  );
  const seed = DAY_SEEDS[dayOfYear % DAY_SEEDS.length];

  const sewoon = chart.sewoon.find((s) => s.year === year);
  const daewoon = chart.daewoon.find(
    (d) => year >= d.startYear && year <= d.endYear,
  );

  const parts: string[] = [seed];

  if (sewoon) {
    parts.push(
      `${year}년 세운 ${sewoon.pillar}(${sewoon.stemTenStarKo}) — 올해 몸·기억이 먼저 반응하는 테마가 있으면 적어 본다. 정답은 없다.`,
    );
  }

  if (daewoon) {
    parts.push(
      `지금 대운 ${daewoon.pillar}(${daewoon.startAge}~${daewoon.endAge}세) — 이 10년을 예전과 다르게 보게 된 이유가 있으면 한 줄.`,
    );
  }

  const next = bundle.overview.find(
    (item) => !item.key.startsWith('hidden:'),
  ) ?? bundle.overview[0];

  return {
    title: '오늘의 탐구',
    body: parts.join(' '),
    suggestKey: next?.key,
    suggestCategory: next?.category,
  };
}
