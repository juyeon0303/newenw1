import type { ManseryeokResult, LuckPillarDetail, PillarSlot } from '@/lib/manseryeok';
import { parsePillar, STEM_KO, BRANCH_KO } from '@/lib/manseryeok/constants/ganji';
import {
  detectBranchRelations,
  detectStemRelations,
} from '@/lib/manseryeok/compute/relations';
import { SOURCES } from './sources';
import type { CommentaryNote } from './types';
import { TEN_STAR_COMMENTARY } from './ten-star';

const J = SOURCES.jaPYeong;
const S = SOURCES.samMyeong;

const SLOT_KO: Record<PillarSlot, string> = {
  year: '년주',
  month: '월주',
  day: '일주',
  hour: '시주',
};

function natalRelationLines(luck: LuckPillarDetail, chart: ManseryeokResult): string[] {
  const { stem, branch } = parsePillar(luck.pillar);
  const lines: string[] = [];
  const slots: PillarSlot[] = ['year', 'month', 'day', 'hour'];

  for (const slot of slots) {
    const p = chart.pillars[slot];
    for (const r of detectBranchRelations([branch, p.branch])) {
      if (r.branches.includes(branch) && r.branches.includes(p.branch)) {
        lines.push(
          `대운 ${BRANCH_KO[branch]} ↔ ${SLOT_KO[slot]} ${BRANCH_KO[p.branch]} — ${r.type}(지지)`,
        );
      }
    }
    for (const r of detectStemRelations([stem, p.stem])) {
      if (r.stems.includes(stem) && r.stems.includes(p.stem)) {
        lines.push(
          `대운 ${STEM_KO[stem]} ↔ ${SLOT_KO[slot]} ${STEM_KO[p.stem]} — ${r.type}(천간)`,
        );
      }
    }
  }

  return [...new Set(lines)];
}

export function buildDaewoonCommentary(
  luck: LuckPillarDetail,
  chart: ManseryeokResult,
  opts: { isCurrent: boolean; index: number },
): CommentaryNote {
  const { stem, branch } = parsePillar(luck.pillar);
  const tenStarNote = TEN_STAR_COMMENTARY[luck.stemTenStarKo];
  const natal = natalRelationLines(luck, chart);

  const paragraphs = [
    {
      text: `대운(大運)은 10년 단위로 바뀌는 운의 기둥이다. 《子平真诠》·《三命通會》에서 월령·통근과 함께 「시간의 층」으로 읽으며, 원국(本命) 위에 겹쳐지는 10년 테마로 본다. ${luck.startAge}~${luck.endAge}세(${luck.startYear}~${luck.endYear}년) 구간의 간지는 ${luck.pillar}(${STEM_KO[stem]}${BRANCH_KO[branch]})이다.`,
      sources: [J, S],
    },
  ];

  if (tenStarNote) {
    paragraphs.push({
      text: `천간 십성 ${luck.stemTenStarKo}, 12운성 ${luck.stageBongKo}. 대운 천간은 이 10년의 겉 역할·사건, 지지는 속 환경·몸·배경으로 읽는 경우가 많다. ${luck.stemTenStarKo}의 테마가 이 10년에 두드러지는지 본다.`,
      sources: [J],
    });
  } else {
    paragraphs.push({
      text: `천간 십성 ${luck.stemTenStarKo}, 12운성 ${luck.stageBongKo}. 이 10년의 겉·속 테마를 십성·운성으로 읽는다.`,
      sources: [J],
    });
  }

  if (natal.length > 0) {
    paragraphs.push({
      text: `원국과의 관계 — ${natal.join(' · ')}. 대운이 원국과 충·합·형이면 그 10년에 움직임·교체·붙음·마찰이 두드러질 수 있다고 본다. 반드시 흉한 10년을 뜻하지는 않는다.`,
      sources: [S, SOURCES.jeokCheon],
    });
  }

  if (opts.isCurrent) {
    paragraphs.push({
      text: '지금 걸쳐 있는 대운이다. 「올해 운세」보다, 이 10년(또는 이 구간)에 실제로 바뀐 일·반복되는 패턴을 먼저 떠올리는 편이 낫다.',
      sources: [J],
    });
  }

  const reflection = tenStarNote?.reflection
    ?? `${luck.startAge}~${luck.endAge}세 — 그때 이사·이직·연애·건강·돈 중 뭐가 크게 바뀌었는지, 하나만 골라 적어 본다.`;

  const contextLine = opts.isCurrent
    ? `현재 대운 (${luck.startAge}~${luck.endAge}세) — ${luck.pillar} · ${luck.stemTenStarKo}`
    : `${luck.startAge}~${luck.endAge}세 대운 — ${luck.pillar} · ${luck.stemTenStarKo}`;

  return {
    paragraphs,
    sources: [J, S],
    reflection,
    contextLine,
  };
}

export function buildDaewoonMetaNote(chart: ManseryeokResult): CommentaryNote {
  const { daewoonSu, isReverse, startLuckAge } = chart.luckMeta;
  return {
    paragraphs: [
      {
        text: `이 팔자는 ${daewoonSu}세에 대운이 시작하고(${startLuckAge}세부터), ${isReverse ? '역행(逆行)' : '순행(順行)'}한다. 대운은 원국의 월령·일간과 함께 「그 10년의 배경」을 읽는 좌표다.`,
        sources: [S, J],
      },
    ],
    sources: [S, J],
    reflection: '대운표에서 기억나는 구간 하나 — 그때의 나와 지금의 나, 무엇이 다른지 적어 본다.',
  };
}
