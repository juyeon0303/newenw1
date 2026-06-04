import type { ManseryeokResult } from '@/lib/manseryeok';
import type { ExploreBundle } from '@/lib/philosophy/build-explore';

export interface DailyPrompt {
  title: string;
  body: string;
  /** explore overview item key */
  suggestKey?: string;
  suggestCategory?: 'relation' | 'tenstar' | 'spirit' | 'hidden';
}

const DAY_SEEDS = [
  '오늘 떠오른 사람 한 명만 적어 본다.',
  '몸이 먼저 반응했던 순간 — 언제였는지.',
  '설명은 안 맞는데 기억만 선명한 장면.',
  '반복되는 계절·달 — 그때마다 하는 행동.',
  '말하지 않고 참았던 때, 어디가 조였는지.',
  '뜻밖에 잘 풀렸던 해 — 그해 초반에 뭐가 있었는지.',
  '지금 대운 구간에서 바뀐 것 하나.',
];

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
      `${year}년 세운 ${sewoon.pillar}(${sewoon.stemTenStarKo}) — 올해 이미 터진 일·반복되는 테마가 있으면 적어 본다.`,
    );
  }

  if (daewoon) {
    parts.push(
      `지금 대운 ${daewoon.pillar}(${daewoon.startAge}~${daewoon.endAge}세) — 이 10년 중 기억나는 해 하나.`,
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
