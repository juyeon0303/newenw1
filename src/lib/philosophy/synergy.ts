import type { ManseryeokResult } from '@/lib/manseryeok';
import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';
import {
  detectBranchRelations,
  detectStemRelations,
  type BranchRelation,
  type StemRelation,
} from '@/lib/manseryeok/compute/relations';
import type { Locale } from '@/lib/i18n/locale';
import { ELEMENT_I18N, t } from '@/lib/i18n/ui-strings';

const ELEMENTS: (keyof ElementCount)[] = ['木', '火', '土', '金', '水'];

const COLLABORATOR_KO: Record<keyof ElementCount, string> = {
  木: '성장·기획형 동업자 — 새 판을 여는 사람',
  火: '추진·영감형 동업자 — 열기를 끼워 주는 사람',
  土: '운영·중재형 동업자 — 판을 붙잡는 사람',
  金: '분석·결단형 동업자 — 기준을 세우는 사람',
  水: '통찰·연결형 동업자 — 흐름을 읽는 사람',
};

const COLLABORATOR_EN: Record<keyof ElementCount, string> = {
  木: 'Growth planner — opens new ground',
  火: 'Momentum spark — brings heat and drive',
  土: 'Operator mediator — holds the frame',
  金: 'Analyst decider — sets standards',
  水: 'Insight connector — reads the flow',
};

const COLLABORATOR_JA: Record<keyof ElementCount, string> = {
  木: '成長・企画型 — 新しい盤を開く人',
  火: '推進・インスピレーション型 — 熱を足す人',
  土: '運営・調停型 — 盤を保つ人',
  金: '分析・決断型 — 基準を立てる人',
  水: '洞察・接続型 — 流れを読む人',
};

export interface ElementComplement {
  element: keyof ElementCount;
  countA: number;
  countB: number;
  gap: number;
  collaboratorType: string;
}

export interface SynergyReport {
  elementComplements: ElementComplement[];
  topCollaborator: ElementComplement | null;
  crossBranchRelations: BranchRelation[];
  crossStemRelations: StemRelation[];
  synergyScore: number;
  summaryKo: string;
}

function collaboratorType(el: keyof ElementCount, locale: Locale): string {
  if (locale === 'en') return COLLABORATOR_EN[el];
  if (locale === 'ja') return COLLABORATOR_JA[el];
  return COLLABORATOR_KO[el];
}

function branchesOf(chart: ManseryeokResult) {
  const { year, month, day, hour } = chart.pillars;
  return [year.branch, month.branch, day.branch, hour.branch];
}

function stemsOf(chart: ManseryeokResult) {
  const { year, month, day, hour } = chart.pillars;
  return [year.stem, month.stem, day.stem, hour.stem];
}

export function buildSynergyReport(
  chartA: ManseryeokResult,
  chartB: ManseryeokResult,
  locale: Locale = 'ko',
): SynergyReport {
  const elementComplements: ElementComplement[] = ELEMENTS.map((el) => {
    const countA = chartA.elementCount[el];
    const countB = chartB.elementCount[el];
    const gap = countB - countA;
    return {
      element: el,
      countA,
      countB,
      gap,
      collaboratorType: collaboratorType(el, locale),
    };
  }).sort((x, y) => x.gap - y.gap);

  const topCollaborator =
    [...elementComplements]
      .filter((c) => c.gap > 0)
      .sort((a, b) => a.countA - b.countA || b.gap - a.gap)[0] ?? null;

  const branches = [...branchesOf(chartA), ...branchesOf(chartB)];
  const stems = [...stemsOf(chartA), ...stemsOf(chartB)];

  const crossBranchRelations = detectBranchRelations(branches);
  const crossStemRelations = detectStemRelations(stems);

  const harmony = crossBranchRelations.filter((r) =>
    ['합', '회'].includes(r.type),
  ).length;
  const clash = crossBranchRelations.filter((r) =>
    ['충', '형', '해', '파'].includes(r.type),
  ).length;

  const elementBonus = topCollaborator ? Math.min(topCollaborator.gap * 8, 40) : 0;
  const relationBonus = harmony * 6 - clash * 4;
  const synergyScore = Math.max(
    0,
    Math.min(100, 50 + elementBonus + relationBonus),
  );

  const elName = topCollaborator
    ? ELEMENT_I18N[topCollaborator.element][locale]
    : '';
  const summaryKo =
    locale === 'ko'
      ? topCollaborator
        ? `당신에게 부족한 ${elName} 기운을 상대가 ${topCollaborator.gap}만큼 보완합니다. ${topCollaborator.collaboratorType}`
        : '오행 보완 폭이 작습니다. 관계 축을 탐구해 보세요.'
      : topCollaborator
        ? `${t('synergy_collaborator', locale)}: ${elName} (+${topCollaborator.gap}) — ${topCollaborator.collaboratorType}`
        : t('synergy_cross_relations', locale);

  return {
    elementComplements,
    topCollaborator,
    crossBranchRelations,
    crossStemRelations,
    synergyScore,
    summaryKo,
  };
}
