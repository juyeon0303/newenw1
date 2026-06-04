import type { ManseryeokResult } from '@/lib/manseryeok';
import { STEM_ELEMENT, ELEMENT_KO } from '@/lib/manseryeok/constants/ganji';
import { MONTH_COMMAND } from '@/lib/manseryeok/compute/monthly-command';
import type { EarthBranch } from '@/lib/manseryeok/constants/ganji';
import { SOURCES } from './sources';
import type { CommentaryNote } from './types';

const J = SOURCES.jaPYeong;
const Q = SOURCES.qiongTong;
const S = SOURCES.samMyeong;

type Element = '木' | '火' | '土' | '金' | '水';

const GENERATES: Record<Element, Element> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
};

const CONTROLS: Record<Element, Element> = {
  木: '土',
  火: '金',
  土: '水',
  金: '木',
  水: '火',
};

function elementRelation(dayEl: Element, commandEl: Element): {
  label: string;
  note: string;
} {
  if (dayEl === commandEl) {
    return {
      label: '比和',
      note: '일간과 월령 오행이 같다 — 계절·환경과 「비슷한 기운」으로 맞서거나 흐름을 탈 수 있다.',
    };
  }
  if (GENERATES[dayEl] === commandEl) {
    return {
      label: '我生(泄)',
      note: '일간이 월령을 생한다 — 표현·생산·밖으로 드러내는 쪽에 기운이 흐르기 쉽다.',
    };
  }
  if (GENERATES[commandEl] === dayEl) {
    return {
      label: '生我',
      note: '월령이 일간을 생한다 — 《窮通寶鑑》에서 「得令·得生」에 가깝게, 환경·계절이 받쳐 주는 쪽으로 읽히기도 한다.',
    };
  }
  if (CONTROLS[dayEl] === commandEl) {
    return {
      label: '我克(財)',
      note: '일간이 월령을 극한다 — 재물·일·관리·현실 문제에 힘이 실리기 쉬운 구조로 본다.',
    };
  }
  if (CONTROLS[commandEl] === dayEl) {
    return {
      label: '克我(官殺)',
      note: '월령이 일간을 극한다 — 규칙·압박·책임·환경의 제약이 두드러질 수 있다.',
    };
  }
  return { label: '관계', note: '' };
}

const SEASON_KO: Record<EarthBranch, string> = {
  寅: '초봄', 卯: '봄', 辰: '늦봄',
  巳: '초여름', 午: '여름', 未: '늦여름',
  申: '초가을', 酉: '가을', 戌: '늦가을',
  亥: '초겨울', 子: '겨울', 丑: '늦겨울',
};

export function buildMonthCommandCommentary(chart: ManseryeokResult): CommentaryNote {
  const monthBranch = chart.pillars.month.branch;
  const cmd = MONTH_COMMAND[monthBranch];
  const dayEl = STEM_ELEMENT[chart.dayMaster.stem] as Element;
  const commandEl = cmd.dangryeong as Element;
  const rel = elementRelation(dayEl, commandEl);

  const monthTenStar = chart.pillars.month.stemTenStarKo;
  const dayTenOnMonth = chart.pillars.month.branchTenStarKo;

  return {
    paragraphs: [
      {
        text: `월령(月令)은 태어난 절기·월지(${chart.pillars.month.branchKo})의 계절 기운이다. 이 팔자는 ${SEASON_KO[monthBranch]}(${monthBranch})에 해당하며, 사령(司令) ${chart.monthCommand.saenglingKo}(${chart.monthCommand.saengling}), 당령(本气) ${ELEMENT_KO[commandEl]}(${commandEl})로 잡힌다.`,
        sources: [Q, J],
      },
      {
        text: `일간 ${chart.dayMaster.stemKo}(${ELEMENT_KO[dayEl]})와 월령 ${ELEMENT_KO[commandEl]}의 관계 — ${rel.label}. ${rel.note} 《窮通寶鑑》은 계절·오행별로 일간의 「희·기」를 논하지만, 여기서는 「맞다/틀리다」가 아니라 몸·기분·환경이 어떤 계절에 살아 있는지를 떠올리게 한다.`,
        sources: [Q, J],
      },
      {
        text: `월주 천간 십성 ${monthTenStar}, 지지 십성 ${dayTenOnMonth}. 월령은 사회·직업·부모·청년기 환경의 축으로, 일간과의 생극과 함께 읽는다.`,
        sources: [J, S],
      },
    ],
    sources: [Q, J, S],
    reflection: `태어난 계절(${SEASON_KO[monthBranch]}) — 그 냄새·온도·빛이 아직 몸에 남아 있는지, 아니면 다른 계절이 더 편한지부터 본다.`,
    contextLine: `월지 ${chart.pillars.month.pillar} · 사령 ${chart.monthCommand.saenglingKo} · 일간↔월령 ${rel.label}`,
  };
}

export const MONTH_COMMAND_QUESTIONS = [
  '태어난 계절 — 그 계절에 태어난 친구·형제와 기질이 비슷한가, 다른가?',
  '일이 잘 풀렸던 달·잘 안 풀렸던 달 — 계절(봄·여름·가을·겨울)과 겹치는가?',
  '몸이 「활짝」 또는 「움츠러」 드는 계절 — 사주의 월령과 같은가?',
  '부모·학교·첫 사회 — 「차갑다/뜨겁다/습하다/건조하다」 중 뭐가 더 기억에 남는가?',
];
