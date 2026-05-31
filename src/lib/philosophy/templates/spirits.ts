/** 신살 질문 — 장면·반복·몸에서 떠오르게 */

export interface SpiritTemplate {
  name: string;
  category: '12신살' | '귀인' | '흉살' | '기타';
  hint: string;
  core: string[];
  byBasis?: Record<string, string[]>;
  mirror?: string[];
}

export const SPIRIT_TEMPLATES: Record<string, SpiritTemplate> = {
  겁살: {
    name: '겁살',
    category: '12신살',
    hint: '갑작스런 변화',
    core: [
      '갑자기 계획이 틀어졌던 때 — 그 직전에 뭐가 있었는지?',
      '그런 일이 생기면 몸이 먼저 굳는가, 바로 움직이는가?',
    ],
    mirror: ['갑자기 바뀐 뒤에 오히려 나아진 적이 있는가?'],
  },
  재살: {
    name: '재살',
    category: '12신살',
    hint: '경쟁·재물·환경',
    core: [
      '돈·일·사람 때문에 경쟁이 붙었던 시기 — 지금도 비슷한가?',
      '그때 "지키려" 했던 게 뭐였는지?',
    ],
  },
  천살: {
    name: '천살',
    category: '12신살',
    hint: '통제 밖 사건',
    core: [
      '막을 수 없었던 일 — 그때 내가 한 선택 하나는?',
      '운이 없다고 느낀 해와 운이 좋다고 느낀 해가 있다면?',
    ],
  },
  지살: {
    name: '지살',
    category: '12신살',
    hint: '자리·이사·근거',
    core: [
      '이사·전직·관계 끊김 — 자리가 바뀔 때마다 비슷한 패턴이 있는가?',
      '지금 사는 곳·하는 일 — 몸이 편한가?',
    ],
  },
  년살: {
    name: '년살',
    category: '12신살',
    hint: '매년 비슷한 시기',
    core: [
      '매년 비슷한 달·계절에 기분·일이 흔들리는가?',
      '그때 반복해서 하는 행동(피함·과식·연락 등)이 있는가?',
    ],
  },
  월살: {
    name: '월살',
    category: '12신살',
    hint: '짧은 파도',
    core: [
      '한두 달 단위로 기분·운이 확 바뀌는가?',
      '그때 주변 사람에게 어떻게 보였는지 기억나는가?',
    ],
  },
  망신살: {
    name: '망신살',
    category: '12신살',
    hint: '창피·노출·평판',
    core: [
      '실수·창피가 떠올라 밤에 잠 설친 적 — 아직 남아 있는가?',
      '그 일 이후에 사람 만나는 방식이 바뀌었는가?',
    ],
    mirror: ['창피당한 뒤에 오히려 관계가 가까워진 적이 있는가?'],
  },
  장성살: {
    name: '장성살',
    category: '12신살',
    hint: '앞에 서기·책임',
    core: [
      '"네가 하자" "네가 대장" — 듣기 좋은가, 부담인가?',
      '앞에 섰을 때 몸이 커지는가, 조이는가?',
    ],
  },
  반안살: {
    name: '반안살',
    category: '12신살',
    hint: '올라탄 상태·안정',
    core: [
      '지금 "올라탄" 느낌 — 직장·관계·지역 중 어디인가?',
      '더 올라가고 싶은가, 지금 자리에 머물고 싶은가?',
    ],
  },
  역마살: {
    name: '역마살',
    category: '12신살',
    hint: '이동·변화·멀리',
    core: [
      '여행·출장·이사 후에 기분·일이 바뀌었던 적?',
      '정착과 떠돌기 — 어느 쪽에서 더 살아있다고 느끼는가?',
    ],
  },
  육해살: {
    name: '육해살',
    category: '12신살',
    hint: '가까운 사람과 미묘한 거리',
    core: [
      '가깝지만 불편한 사람 — 지금 떠오르는 이름이 있는가?',
      '말 안 하고 거리 두는 편인가, 터뜨리는 편인가?',
    ],
  },
  화개살: {
    name: '화개살',
    category: '12신살',
    hint: '혼자·고독·내면',
    core: [
      '혼자 있을 때 제일 편한가, 외로운가?',
      '혼자 할 때만 하는 일(생각·취미·습관)이 있는가?',
    ],
    mirror: ['혼자보다 사람 많을 때 더 나았던 시기가 있었는가?'],
  },
  천을귀인: {
    name: '천을귀인',
    category: '귀인',
    hint: '뜻밖의 도움',
    core: [
      '막혔을 때 뜻밖에 손 내밀어준 사람 — 누구였는가?',
      '도움 받을 때 "고맙다"보다 "왜 나한테?"가 먼저인가?',
    ],
  },
  문창귀인: {
    name: '문창귀인',
    category: '귀인',
    hint: '글·공부·시험',
    core: [
      '공부·시험·글 — "흐름 탔다"고 느낀 적과 "막혔다"고 느낀 적?',
      '지금도 배우고 싶은 게 있는가, 이름만 있는가?',
    ],
  },
  태극귀인: {
    name: '태극귀인',
    category: '귀인',
    hint: '양극·종교·깊은 생각',
    core: [
      '밤에 혼자 깊은 생각에 빠지는 주제 — 뭐인가?',
      '종교·명상·철학 — 당긴 적이 있거나 지금 당기는가?',
    ],
  },
  천덕귀인: {
    name: '천덕귀인',
    category: '귀인',
    hint: '갈등이 풀림',
    core: [
      '틀어졌다가 저절로 풀린 관계 — 어떻게 풀렸는지 기억나는가?',
      '화해를 내가 먼저 하는 편인가, 기다리는 편인가?',
    ],
  },
  월덕귀인: {
    name: '월덕귀인',
    category: '귀인',
    hint: '특정 계절·시기',
    core: [
      '특정 계절·달에 일·기분이 잘 풀린다고 느낀 적?',
      '그때 시작한 일 중 아직 이어지는 게 있는가?',
    ],
  },
  학당귀인: {
    name: '학당귀인',
    category: '귀인',
    hint: '학교·자격·제도',
    core: [
      '시험·자격·학교 — "됐다" / "망했다" 기억 중 뭐가 더 많은가?',
      '공식적인 길(학위·자격)이 도움이 됐는가, 발목이 됐는가?',
    ],
  },
  복성귀인: {
    name: '복성귀인',
    category: '귀인',
    hint: '운 좋게 넘어감',
    core: [
      '"운 좋았다"고 생각하는 일 — 최근에도 있었는가?',
      '운을 타고난 것 같다 vs 노력한 것 같다 — 본인은 어느 쪽인가?',
    ],
  },
  도화살: {
    name: '도화살',
    category: '흉살',
    hint: '인기·매력·관계',
    core: [
      '사람들이 끌리는 내 모습 — 본인이 아는 그 모습과 같은가?',
      '인기 때문에 피곤했던 적이 있는가?',
    ],
    mirror: ['인기 없을 때 오히려 편했던 시기가 있었는가?'],
  },
  양인살: {
    name: '양인살',
    category: '흉살',
    hint: '극단·한 방·칼',
    core: [
      '한 번에 올인했던 일 — 돈·연애·말싸움·결정 중 뭐가 떠오르는가?',
      '화가 나면 말보다 행동이 먼저인가?',
    ],
    mirror: ['참고 넘겼을 때 더 후회한 적 vs 올인해서 후회한 적?'],
  },
  백호살: {
    name: '백호살',
    category: '흉살',
    hint: '급변·수술·사고',
    core: [
      '갑자기 몸·일·관계가 바뀐 경험 — 그 전후로 뭐가 달라졌는가?',
      '위험한 선택을 했을 때 — 후회인가, 필요였다고 느끼는가?',
    ],
  },
  괴강살: {
    name: '괴강살',
    category: '흉살',
    hint: '고집·리더십',
    core: [
      '"고집 센 사람" — 그 말을 듣기 좋은가?',
      '내 way가 통했던 때와 망했던 때 — 차이가 뭐였는지?',
    ],
  },
  현침살: {
    name: '현침살',
    category: '흉살',
    hint: '예민·신경',
    core: [
      '작은 소리·말·분위기에도 반응하는가?',
      '예민하다고 들은 적 — 동의하는가, 아니다고 느끼는가?',
    ],
  },
  홍염살: {
    name: '홍염살',
    category: '흉살',
    hint: '열정·감정',
    core: [
      '좋아하는 감정이 올라올 때 — 표현하는가, 삼키는가?',
      '열정 때문에 태웠던 관계·일이 있는가?',
    ],
  },
};

export interface SpiritHit {
  name: string;
  category: '12신살' | '귀인' | '흉살' | '기타';
  slot: string;
  basis?: string;
  auspicious?: boolean;
}

export interface SpiritQuestion {
  id: string;
  text: string;
  tag?: 'core' | 'basis' | 'mirror';
  source: string;
}

export function buildSpiritQuestions(hit: SpiritHit): SpiritQuestion[] {
  const def = SPIRIT_TEMPLATES[hit.name];
  if (!def) {
    return [{
      id: `${hit.name}-generic`,
      text: `${hit.name} — 이게 걸린다고 들었을 때, 떠오르는 사람·시기·장면이 있는가?`,
      source: hit.name,
    }];
  }

  const out: SpiritQuestion[] = [];
  const push = (q: string, tag: SpiritQuestion['tag']) => {
    out.push({ id: `${hit.name}-${tag}-${out.length}`, text: q, tag, source: hit.name });
  };

  for (const q of def.core) push(q, 'core');

  if (hit.basis && def.byBasis?.[hit.basis]) {
    for (const q of def.byBasis[hit.basis]) push(q, 'basis');
  }

  if (def.mirror) {
    for (const q of def.mirror) push(q, 'mirror');
  }

  return out;
}
