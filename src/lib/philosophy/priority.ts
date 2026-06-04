/**
 * 탐구 중요도(경중) 산정 — 고정 규칙
 *
 * 원칙 (전통 명리 읽기 순서를 UI 정렬에만 사용, 해석 단정 아님):
 * 1. 일주(日) > 월주(月) > 시주(時) > 년주(年) — 자아·월령·말년·유년 순
 * 2. 형충(冲·刑·害·破) > 합·회 — 역동·긴장 우선
 * 3. 천간·지지(透·坐) > 지장간(藏) — 겉팔자 우선
 * 4. 일지·일간 기준 신살 > 그 외 기준
 */

import type { PillarSlot } from '@/lib/manseryeok';
import type { TenStarLayer } from './templates/ten-star';
import type { RelationKind, RelationType, ExploreTier } from './templates/relations';

/** UI·문서용 — 사용자에게 노출 */
export const PRIORITY_CRITERIA = {
  tiers: {
    core: {
      label: '핵심',
      rule: '일주(日)에 걸린 충·형, 또는 일주 천간·지지 십성(透), 또는 총점 130 이상',
    },
    important: {
      label: '중요',
      rule: '월주·일주·시주에 걸린 충합·십성·신살, 또는 총점 90–129',
    },
    reference: {
      label: '참고',
      rule: '년주만 해당, 지장간만 해당, 합·회·천라·지망 단독, 또는 총점 90 미만',
    },
  },
  pillars: {
    day: '일주(日) — 자아·배우자·건강·핵심 관계 (+40)',
    month: '월주(月) — 월령·직업·사회 (+28)',
    hour: '시주(時) — 말년·자녀·결과 (+20)',
    year: '년주(年) — 유년·가문·환경 (+12)',
  },
  layers: {
    stem: '천간 십성 — 겉으로 드러남 (+45)',
    branch: '지지 십성 — 좌支 (+48)',
    hidden: '지장간 — 잠재, 겉팔자에 없음 (+10, 항상 참고)',
  },
  relations: {
    order: '충(100) > 형(85) > 해(75) > 파(70) > 원진(62) > 귀문(58) > 합(50) > 회(45) > 천라·지망(40)',
    stemChong: '천간충 — 겉 의도·역할 충돌 (+15)',
    dayTouch: '일주 관련 시 (+30)',
    monthDay: '월·일 동시 관련 시 (+18)',
  },
  spirits: {
    basis: '일지(+40) > 일간(+32) > 월지(+22) > 시지(+18) > 년지(+10)',
    category: '귀인(+38) > 흉살(+32) > 12신살(+24) > 기타(+20)',
  },
} as const;

/** 기둥 가중 — 일주 최대 */
const PILLAR: Record<PillarSlot, number> = {
  day: 40,
  month: 28,
  hour: 20,
  year: 12,
};

/** 십성 층 — 지장간은 구조상 상한 */
const LAYER: Record<TenStarLayer, number> = {
  stem: 45,
  branch: 48,
  hidden: 10,
};

const RELATION_BASE: Record<RelationType, number> = {
  충: 100,
  형: 85,
  해: 75,
  파: 70,
  원진: 62,
  귀문: 58,
  합: 50,
  회: 45,
  천라: 40,
  지망: 40,
};

const SPIRIT_BASIS: Record<string, number> = {
  일지: 40,
  일간: 32,
  월지: 22,
  시지: 18,
  년지: 10,
};

const SPIRIT_CATEGORY: Record<string, number> = {
  귀인: 38,
  흉살: 32,
  '12신살': 24,
  기타: 20,
};

const TIER_CORE = 130;
const TIER_IMPORTANT = 90;

export interface PriorityResult {
  score: number;
  tier: ExploreTier;
  /** UI용 한 줄 근거 */
  reason: string;
}

function uniqueSlots(slots: PillarSlot[]): PillarSlot[] {
  return [...new Set(slots)];
}

function tierFromScore(score: number): ExploreTier {
  if (score >= TIER_CORE) return 'core';
  if (score >= TIER_IMPORTANT) return 'important';
  return 'reference';
}

/** 지장간은 규칙상 항상 참고 */
function capHiddenTier(tier: ExploreTier, layer?: TenStarLayer): ExploreTier {
  if (layer === 'hidden') return 'reference';
  return tier;
}

export function scoreTenStar(slot: PillarSlot, layer: TenStarLayer): PriorityResult {
  const score = LAYER[layer] + PILLAR[slot];
  let tier = tierFromScore(score);

  const reasons: string[] = [`${layer === 'stem' ? '천간' : layer === 'branch' ? '지지' : '지장간'} +${LAYER[layer]}`, `${slot === 'day' ? '일주' : slot === 'month' ? '월주' : slot === 'hour' ? '시주' : '년주'} +${PILLAR[slot]}`];

  if (slot === 'day' && layer !== 'hidden') {
    tier = 'core';
    reasons.push('일주 십성(透) → 핵심');
  }

  tier = capHiddenTier(tier, layer);
  if (layer === 'hidden') reasons.push('지장간만 → 참고 고정');

  return { score, tier, reason: reasons.join(' · ') };
}

export function scoreRelation(
  type: RelationType,
  kind: RelationKind,
  slots: PillarSlot[],
): PriorityResult {
  let score = RELATION_BASE[type] ?? 35;
  const reasons: string[] = [`${type} +${RELATION_BASE[type] ?? 35}`];

  if (kind === 'stem' && type === '충') {
    score += 15;
    reasons.push('천간충 +15');
  } else if (kind === 'stem' && type === '합') {
    score += 5;
    reasons.push('천간합 +5');
  }

  const uniq = uniqueSlots(slots);
  for (const s of uniq) {
    score += PILLAR[s];
    reasons.push(`${s === 'day' ? '일주' : s === 'month' ? '월주' : s === 'hour' ? '시주' : '년주'} +${PILLAR[s]}`);
  }

  const hasDay = uniq.includes('day');
  const hasMonth = uniq.includes('month');

  if (hasDay) {
    score += 30;
    reasons.push('일주 관련 +30');
  }
  if (hasDay && hasMonth) {
    score += 18;
    reasons.push('월·일 동시 +18');
  }

  let tier = tierFromScore(score);

  // 규칙 오버라이드
  if (hasDay && (type === '충' || type === '형')) {
    tier = 'core';
    reasons.push('일주 충·형 → 핵심');
  } else if (hasDay && tier === 'reference') {
    tier = 'important';
  }

  if (!hasDay && !hasMonth && !uniq.includes('hour') && type === '합') {
    tier = 'reference';
    reasons.push('년주만 합 → 참고');
  }

  if (type === '천라' || type === '지망') {
    tier = tier === 'core' ? 'important' : tier;
  }

  return { score, tier, reason: reasons.join(' · ') };
}

export function scoreSpirit(
  category: string,
  basis?: string,
  slotKo?: string,
): PriorityResult {
  const catScore = SPIRIT_CATEGORY[category] ?? SPIRIT_CATEGORY.기타;
  let score = catScore;
  const reasons: string[] = [`${category} +${catScore}`];

  if (basis && SPIRIT_BASIS[basis]) {
    score += SPIRIT_BASIS[basis];
    reasons.push(`${basis} +${SPIRIT_BASIS[basis]}`);
  } else if (slotKo === '원국') {
    score += 15;
    reasons.push('원국 신살 +15');
  }

  let tier = tierFromScore(score);

  if (basis === '일지' || basis === '일간') {
    tier = tier === 'reference' ? 'important' : tier;
    if (score >= 70) tier = 'core';
    reasons.push('일지·일간 기준 → 상향');
  } else if (basis === '년지') {
    tier = 'reference';
    reasons.push('년지 기준 → 참고');
  }

  return { score, tier, reason: reasons.join(' · ') };
}

export function scoreToTier(score: number): ExploreTier {
  return tierFromScore(score);
}

const TIER_RANK: Record<ExploreTier, number> = {
  core: 3,
  important: 2,
  reference: 1,
};

export function maxTier(a: ExploreTier, b: ExploreTier): ExploreTier {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

export { tierLabel } from './templates/relations';
