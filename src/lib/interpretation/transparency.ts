import type { SynergyReport } from '@/lib/philosophy/synergy';
import type { CareerMonthEntry } from '@/lib/lifestyle/career-monthly';
import type { WealthDayEntry } from '@/lib/lifestyle/wealth-calendar';

export interface ScoreLine {
  label: string;
  value: number;
  note?: string;
}

export interface TransparencyBreakdown {
  title: string;
  formula: string;
  lines: ScoreLine[];
  result: number;
  disclaimer: string;
}

const TIMING_DISCLAIMER =
  '점수는 십성·합충 규칙의 단순 합산이며, 인생 결정의 정답이 아닙니다. 근거를 보고 본인이 판단하세요.';

export function synergyScoreBreakdown(report: SynergyReport): TransparencyBreakdown {
  const harmony = report.crossBranchRelations.filter((r) =>
    ['합', '회'].includes(r.type),
  ).length;
  const clash = report.crossBranchRelations.filter((r) =>
    ['충', '형', '해', '파'].includes(r.type),
  ).length;
  const elementBonus = report.topCollaborator
    ? Math.min(report.topCollaborator.gap * 8, 40)
    : 0;
  const relationBonus = harmony * 6 - clash * 4;

  const lines: ScoreLine[] = [
    { label: '기본값', value: 50 },
    {
      label: '오행 보완',
      value: elementBonus,
      note: report.topCollaborator
        ? `부족 오행 갭 ${report.topCollaborator.gap} × 8 (최대 40)`
        : '보완 폭 없음',
    },
    {
      label: '지지 합·회',
      value: harmony * 6,
      note: `합·회 ${harmony}건 × 6`,
    },
    {
      label: '지지 충·형·해·파',
      value: -clash * 4,
      note: `충등 ${clash}건 × (−4)`,
    },
  ];

  return {
    title: '시너지 점수',
    formula: 'clamp(0, 100, 50 + 오행보완 + 합회×6 − 충등×4)',
    lines,
    result: report.synergyScore,
    disclaimer: TIMING_DISCLAIMER,
  };
}

export function careerEnergyBreakdown(entry: CareerMonthEntry): TransparencyBreakdown {
  const lines: ScoreLine[] = [{ label: '기본값', value: 52 }];

  if (entry.tags.includes('관성')) {
    const add = entry.stemTenStarKo === '정관' ? 18 : 8;
    lines.push({
      label: '관성',
      value: add,
      note: `${entry.stemTenStarKo} 유년 천간 십성`,
    });
  }
  if (entry.tags.includes('재성')) {
    const add = entry.stemTenStarKo === '정재' ? 14 : 10;
    lines.push({ label: '재성', value: add });
  }
  if (entry.tags.includes('식상')) {
    lines.push({ label: '식상', value: 12 });
  }
  if (entry.tags.includes('충')) {
    lines.push({ label: '원국 충·형', value: -22 });
  }
  if (entry.tags.includes('합')) {
    lines.push({ label: '원국 합', value: 8 });
  }

  return {
    title: `${entry.label} 커리어 에너지`,
    formula: 'clamp(0, 100, 52 + 십성가산 + 합가산 − 충감산)',
    lines,
    result: entry.energy,
    disclaimer: TIMING_DISCLAIMER,
  };
}

export function wealthScoreBreakdown(entry: WealthDayEntry): TransparencyBreakdown {
  const lines: ScoreLine[] = [{ label: '기본값', value: 50 }];

  if (entry.stemTenStarKo === '정재' || entry.stemTenStarKo === '편재') {
    lines.push({
      label: '재성 유일',
      value: entry.signal === 'buy' ? 18 : 18,
      note: '합 있으면 +28으로 상향',
    });
  }
  if (entry.stemTenStarKo === '겁재') {
    lines.push({ label: '겁재', value: -35 });
  }
  if (entry.alert?.includes('충') || entry.signal === 'avoid') {
    lines.push({ label: '충·파', value: -25, note: '원국과 충·파 겹침' });
  }

  return {
    title: `${entry.date} 재물 신호`,
    formula: 'clamp(0, 100, 50 + 재성가산 − 겁재 − 충파) → buy/hold/avoid',
    lines,
    result: entry.score,
    disclaimer: TIMING_DISCLAIMER,
  };
}
