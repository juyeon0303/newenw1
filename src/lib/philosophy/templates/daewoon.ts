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
    `${luck.startAge}~${luck.endAge}세 — 그 구간에 이사·이직·연애·건강·돈 중 크게 바뀐 것이 있었는가?`,
    'core',
  );
  push(
    `${luck.startYear}~${luck.endYear}년 — 기억나는 해 하나를 골라, 그해에 무슨 일이 있었는지 적어 본다.`,
    'core',
  );

  const ts = TENSTAR_PROMPTS[luck.stemTenStarKo];
  if (ts) for (const q of ts) push(q, 'tenstar');

  if (isCurrent) {
    push('지금 이 10년 — 아직 절반도 안 지났다면, 앞으로 바꾸고 싶은 것 하나는?', 'current');
    push('올해 — 벌써 반복되는 테마·사람·감정이 있는가?', 'current');
  } else {
    push('그 10년이 끝난 뒤 — 다음 10년과 비교해 뭐가 달라졌는지.', 'mirror');
  }

  return out;
}
