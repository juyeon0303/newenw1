import { calculateManseryeok, type ManseryeokResult } from '@/lib/manseryeok';
import {
  detectBranchRelations,
  type BranchRelation,
} from '@/lib/manseryeok/compute/relations';
import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';
import type { Locale } from '@/lib/i18n/locale';
import { ELEMENT_I18N, t } from '@/lib/i18n/ui-strings';

export type DailyActionSeverity = 'caution' | 'go' | 'info';

export interface DailyAction {
  severity: DailyActionSeverity;
  title: string;
  body: string;
  timeHint?: string;
}

export interface ElementBiorhythm {
  element: keyof ElementCount;
  score: number;
  label: string;
}

export interface DailyGuide {
  dateLabel: string;
  todayPillar: string;
  todayStemTenStarKo: string;
  branchHits: BranchRelation[];
  biorhythm: ElementBiorhythm[];
  actions: DailyAction[];
  headline: string;
}

const ELEMENTS: (keyof ElementCount)[] = ['木', '火', '土', '金', '水'];

function todayChart(date: Date): ManseryeokResult {
  return calculateManseryeok({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: 12,
    minute: 0,
    gender: 'male',
  });
}

function natalBranches(chart: ManseryeokResult) {
  const { year, month, day, hour } = chart.pillars;
  return [
    { slot: 'year', branch: year.branch, ko: '년지' },
    { slot: 'month', branch: month.branch, ko: '월지' },
    { slot: 'day', branch: day.branch, ko: '일지' },
    { slot: 'hour', branch: hour.branch, ko: '시지' },
  ] as const;
}

function actionCopy(
  type: BranchRelation['type'],
  slotKo: string,
  locale: Locale,
): { title: string; body: string; severity: DailyActionSeverity; timeHint?: string } {
  const ko = {
    충: {
      title: `${slotKo}에 충(沖)`,
      body: '계약·중요 미팅·대면 결정은 오후 3시 이후로 미루는 편이 낫습니다.',
      severity: 'caution' as const,
      timeHint: '15:00+',
    },
    합: {
      title: `${slotKo}에 합(合)`,
      body: '협업·조율·관계 정리에 유리한 날입니다. 먼저 연락해 보세요.',
      severity: 'go' as const,
    },
    형: {
      title: `${slotKo}에 형(刑)`,
      body: '말다툼·규칙 충돌이 올라오기 쉽습니다. 서면·기록을 남기세요.',
      severity: 'caution' as const,
    },
    해: {
      title: `${slotKo}에 해(害)`,
      body: '작은 오해가 커질 수 있습니다. 확인 질문을 한 번 더.',
      severity: 'info' as const,
    },
    파: {
      title: `${slotKo}에 파(破)`,
      body: '기존 루틴이 깨지기 쉽습니다. Plan B를 준비하세요.',
      severity: 'info' as const,
    },
  };
  const en: typeof ko = {
    충: {
      title: `Clash (冲) on ${slotKo}`,
      body: 'Defer contracts and key meetings until after 3 PM.',
      severity: 'caution',
      timeHint: '15:00+',
    },
    합: {
      title: `Harmony (合) on ${slotKo}`,
      body: 'Good for collaboration and alignment. Reach out first.',
      severity: 'go',
    },
    형: {
      title: `Penalty (刑) on ${slotKo}`,
      body: 'Friction rises easily. Keep written records.',
      severity: 'caution',
    },
    해: {
      title: `Harm (害) on ${slotKo}`,
      body: 'Small misunderstandings may grow. Double-check.',
      severity: 'info',
    },
    파: {
      title: `Break (破) on ${slotKo}`,
      body: 'Routines may crack. Have a plan B.',
      severity: 'info',
    },
  };
  const table = locale === 'ko' ? ko : en;
  const entry = table[type as keyof typeof table];
  return (
    entry ?? {
      title: `${slotKo} · ${type}`,
      body: locale === 'ko' ? '오늘 이 축을 탐구해 보세요.' : 'Explore this axis today.',
      severity: 'info',
    }
  );
}

export function buildDailyGuide(
  chart: ManseryeokResult,
  date = new Date(),
  locale: Locale = 'ko',
): DailyGuide {
  const today = todayChart(date);
  const todayBranch = today.pillars.day.branch;
  const natal = natalBranches(chart);

  const branchHits: BranchRelation[] = [];
  const actions: DailyAction[] = [];

  for (const n of natal) {
    const rels = detectBranchRelations([n.branch, todayBranch]);
    for (const r of rels) {
      branchHits.push(r);
      const copy = actionCopy(r.type, n.ko, locale);
      actions.push({
        severity: copy.severity,
        title: copy.title,
        body: copy.body,
        timeHint: copy.timeHint,
      });
    }
  }

  if (actions.length === 0) {
    actions.push({
      severity: 'go',
      title: locale === 'ko' ? '특이 충돌 없음' : 'No sharp clash',
      body:
        locale === 'ko'
          ? '오늘 일진과 원국 지지가 크게 부딪히지 않습니다. 평소 리듬대로 탐구하세요.'
          : 'Today’s branch does not sharply clash with your natal branches.',
    });
  }

  const biorhythm: ElementBiorhythm[] = ELEMENTS.map((el) => {
    const need = Math.max(0, 3 - chart.elementCount[el]);
    const todayBoost = today.elementCount[el];
    const score = Math.min(100, Math.round((need * 18 + todayBoost * 12)));
    return {
      element: el,
      score,
      label: ELEMENT_I18N[el][locale],
    };
  });

  const dateLabel = date.toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );

  const headline =
    locale === 'ko'
      ? actions[0]?.severity === 'caution'
        ? '오늘은 속도를 늦추는 편이 낫습니다'
        : '오늘은 탐구·연결에 유리합니다'
      : actions[0]?.severity === 'caution'
        ? 'Slow down today'
        : 'Good day to explore and connect';

  return {
    dateLabel,
    todayPillar: today.pillars.day.pillar,
    todayStemTenStarKo: today.pillars.day.stemTenStarKo,
    branchHits,
    biorhythm,
    actions,
    headline,
  };
}
