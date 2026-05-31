import type { PillarSlot } from '@/lib/manseryeok';

export type RelationKind = 'branch' | 'stem';
export type RelationType =
  | '충'
  | '합'
  | '형'
  | '해'
  | '파'
  | '회'
  | '원진'
  | '귀문'
  | '천라'
  | '지망';

export interface RelationSlotRef {
  slot: PillarSlot;
  slotKo: string;
  part: '천간' | '지지';
}

export interface RelationHit {
  kind: RelationKind;
  type: RelationType;
  label: string;
  /** 예: 자오충 (월지·일지) */
  displayLabel: string;
  slots: RelationSlotRef[];
  priority: number;
  tier: ExploreTier;
}

export type ExploreTier = 'core' | 'important' | 'reference';

export interface RelationQuestion {
  id: string;
  text: string;
  tag?: 'core' | 'position' | 'mirror';
}

const TYPE_HINT: Record<RelationType, string> = {
  충: '부딪힘·이동·깨짐',
  합: '붙음·고정·타협',
  형: '긴장·마찰·각도',
  해: '서서히 갉음·불편',
  파: '깨짐·단절',
  회: '방향·계절·묶음',
  원진: '말 없이 불편·엇갈림',
  귀문: '문턱·전환·불안',
  천라: '막힘·정체',
  지망: '허무·끊김',
};

const TYPE_TEMPLATES: Record<
  RelationType,
  { core: string[]; dayInvolved?: string[]; mirror?: string[] }
> = {
  충: {
    core: [
      '갑자기 방향이 바뀌었던 때 — 이사·이별·이직·큰 싸움 중 뭐가 먼저 떠오르는가?',
      '겉으론 괜찮은데 속이 불안한 시기 — 그때 겉과 속이 엇갈렸던 장면은?',
    ],
    dayInvolved: [
      '가장 가까운 관계·일·몸 건강 중, "부딪혀서 바뀐" 쪽이 있었는가?',
    ],
    mirror: ['충처럼 느꼈는데 오히려 문이 열린 적 — 그때 뭐가 달랐는가?'],
  },
  합: {
    core: [
      '오래 붙어 있는 사람·일·습관 — 끊기 어려운 쪽이 있는가?',
      '합쳐졌을 때 편했는가, 답답했는가?',
    ],
    dayInvolved: ['지금 내 삶의 중심에 "붙어 있는" 것 — 이름을 적어 본다.'],
  },
  형: {
    core: [
      '말은 안 해도 불편한 사람·상황 — 몸 어디가 먼저 반응하는가?',
      '비슷한 갈등이 다른 관계에서도 반복됐는가?',
    ],
  },
  해: {
    core: [
      '서서히 멀어진 관계 — 언제부터였는지 기억나는가?',
      '겉으론 유지되는데 속이 닳는 일 — 아직도 있는가?',
    ],
  },
  파: {
    core: [
      '갑자기 끊겼던 것 — 그 직전에 신호가 있었는가?',
    ],
  },
  회: {
    core: [
      '한 방향으로만 몰아붙은 시기 — 그때 집중한 테마는?',
    ],
  },
  원진: {
    core: [
      '이유 없이 거슬리거나 피하고 싶은 사람 — 누구인가?',
      '말 안 해도 분위기가 어색한 관계 — 패턴이 있는가?',
    ],
  },
  귀문: {
    core: [
      '문턱 앞에서 멈칫했던 순간 — 들어가지 못한 이유는?',
    ],
  },
  천라: {
    core: [
      '막혀 있다고 느낀 시기 — 밖에서 막힌 건지, 안에서 막힌 건지?',
    ],
  },
  지망: {
    core: [
      '의미가 비는 느낌이 든 적 — 그때 무엇을 놓치고 있었는가?',
    ],
  },
};

export function relationHint(type: RelationType): string {
  return TYPE_HINT[type];
}

export function buildRelationQuestions(hit: RelationHit): RelationQuestion[] {
  const tpl = TYPE_TEMPLATES[hit.type];
  if (!tpl) return [];

  const out: RelationQuestion[] = [];
  const push = (text: string, tag: RelationQuestion['tag']) => {
    out.push({ id: `${hit.label}-${tag}-${out.length}`, text, tag });
  };

  for (const q of tpl.core) push(q, 'core');

  const touchesDay = hit.slots.some((s) => s.slot === 'day');
  if (touchesDay && tpl.dayInvolved) {
    for (const q of tpl.dayInvolved) push(q, 'position');
  }

  if (tpl.mirror) {
    for (const q of tpl.mirror) push(q, 'mirror');
  }

  return out;
}

export function tierLabel(tier: ExploreTier): string {
  switch (tier) {
    case 'core':
      return '핵심';
    case 'important':
      return '중요';
    default:
      return '참고';
  }
}

export function scoreToTier(score: number): ExploreTier {
  if (score >= 120) return 'core';
  if (score >= 75) return 'important';
  return 'reference';
}
