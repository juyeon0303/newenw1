import type { LuckPillarDetail } from '@/lib/manseryeok';

export interface DaewoonQuestion {
  id: string;
  text: string;
  tag?: 'core' | 'current' | 'tenstar' | 'mirror';
}

const TENSTAR_PROMPTS: Record<string, string[]> = {
  비견: ['이 10년 — 나와 비슷한 사람·라이벌과의 경쟁·연대가 두드러졌는가?'],
  겁재: ['이 10년 — 돈·자리·파트너가 갑자기 재분배된 적이 있는가?'],
  식신: ['이 10년 — 만들기·표현·여유가 늘었거나, 반대로 바빠서 없어진 적이 있는가?'],
  상관: ['이 10년 — 말·규칙·체面과 부딪힌 적이 반복되는가?'],
  편재: ['이 10년 — 뜻밖의 기회·수입·이동이 있었는가?'],
  정재: ['이 10년 — 고정 수입·약속·가정·분담이 안정됐는가, 답답했는가?'],
  편관: ['이 10년 — 압박·위기·큰 결정을 버텼는가?'],
  정관: ['이 10년 — 직함·규칙·책임·체면이 커졌는가?'],
  편인: ['이 10년 — 혼자 파고든 주제·독학·내면이 두드러졌는가?'],
  정인: ['이 10년 — 배움·보호·도움·쉼터와 관련된 일이 있었는가?'],
};

export function buildDaewoonQuestions(
  luck: LuckPillarDetail,
  isCurrent: boolean,
): DaewoonQuestion[] {
  const out: DaewoonQuestion[] = [];
  const push = (text: string, tag: DaewoonQuestion['tag']) => {
    out.push({ id: `dw-${luck.startAge}-${tag}-${out.length}`, text, tag });
  };

  push(
    `${luck.startAge}~${luck.endAge}세 — 그 구간에 에너지가 크게 움직였던 때가 있었는가? 정답을 맞히려 하지 않는다.`,
    'core',
  );
  push(
    `${luck.startYear}~${luck.endYear}년 — 기억나는 해 하나. 예전 탐구와 지금 떠오르는 장면이 다르면, 그것도 괜찮다.`,
    'core',
  );

  const ts = TENSTAR_PROMPTS[luck.stemTenStarKo];
  if (ts) for (const q of ts) push(q, 'tenstar');

  if (isCurrent) {
    push('지금 이 10년 — 벗어나려 하든 따르려 하든, 모두 이 운 안의 움직임이다.', 'current');
    push('올해 — 더 묻고 싶지 않다면, 정착해도 된다.', 'current');
  } else {
    push('그 10년을 다시 볼 때 — 예전과 다른 기억이 떠오르는가?', 'mirror');
  }

  return out;
}
