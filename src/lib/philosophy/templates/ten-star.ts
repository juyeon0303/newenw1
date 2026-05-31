/** 십성별 질문 — 기억·장면·몸에서 떠오르게 */

export interface QuestionTemplate {
  core: string[];
  byPosition?: Partial<Record<PillarSlot, string[]>>;
  hidden?: string[];
  /** 반대 기억 — 답이 아니라 다른 장면을 떠올리게 */
  mirror?: string[];
}

export type PillarSlot = 'year' | 'month' | 'day' | 'hour';
export type TenStarLayer = 'stem' | 'branch' | 'hidden';

export interface TenStarDefinition {
  ko: string;
  hanja: string;
  /** UI용 짧은 힌트 — 질문 아님 */
  hint: string;
  templates: QuestionTemplate;
}

export const TEN_STAR_TEMPLATES: Record<string, TenStarDefinition> = {
  비견: {
    ko: '비견',
    hanja: '比肩',
    hint: '비슷한 사람, 라이벌, 동등함',
    templates: {
      core: [
        '나와 비슷하다고 느꼈던 사람 — 누구였는지, 지금도 연락하는가?',
        '경쟁이 시작되는 순간, 몸이 먼저 반응하는가, 머리가 먼저 계산하는가?',
      ],
      byPosition: {
        year: ['어릴 때 "너랑 똑같네" / "너희 형이랑 판박이" 같은 말, 기억나는가?'],
        month: ['직장·학교에서 짝·동기·라이벌이 있었던 시기 — 그때 내가 했던 선택 하나를 떠올려 본다.'],
        day: ['가장 가까운 사람과 "너랑 나랑 너무 비슷해" / "너랑 나랑 너무 달라" 중 어느 쪽 말을 더 많이 들었는가?'],
        hour: ['요즘, 나와 닮은 후배·제자·동료를 만나면 편한가, 불편한가?'],
      },
      hidden: ['겉으론 맞추는데 속으로 "나도 할 수 있는데"가 올라온 적 — 그때 상황이 기억나는가?'],
      mirror: ['비슷해서 편했던 사람 대신, 전혀 다른 사람과 잘 맞았던 때가 있었는가?'],
    },
  },
  겁재: {
    ko: '겁재',
    hanja: '劫财',
    hint: '갑자기 재분배, 경쟁, 빼앗김·나눔',
    templates: {
      core: [
        '돈·시간·자리가 갑자기 바뀌었던 때 — 그 직전에 뭐가 일어났는지 기억나는가?',
        '누군가와 "반반" 하거나 "내가 더" 싸웠던 일 — 아직도 남아 있는 감정이 있는가?',
      ],
      byPosition: {
        year: ['집·학교·돈 문제로 갑자기 분위기가 바뀌었던 어린 시절 장면이 있는가?'],
        month: ['일·사업·팀에서 파트너와 엇갈렸던 경험 — 그때 내가 먼저 한 말이나 행동은?'],
        day: ['연인·가족과 "내 거" "네 거"가 터졌던 순간, 어떻게 끝났는가?'],
        hour: ['최근 몇 년, 한 번에 크게 걸거나 크게 잃은 적이 있는가?'],
      },
      hidden: ['평소엔 양보하는데 특정 사람 앞에서만 경쟁 모드가 켜진다면 — 그 사람은 누구인가?'],
      mirror: ['경쟁 대신 그냥 물러났는데 오히려 잘 풀렸던 일이 있는가?'],
    },
  },
  식신: {
    ko: '식신',
    hanja: '食神',
    hint: '만들기, 표현, 먹고·나누기, 여유',
    templates: {
      core: [
        '시간 가는 줄 모르고 하던 일 — 최근에도 그런 게 있었는가?',
        '누군가에게 "해줬더니 기분 좋았다"고 느낀 순간, 뭐였는지?',
      ],
      byPosition: {
        year: ['어릴 때 "쟤는 손재주 있다" / "쟤는 먹을 줄 안다" 같은 말 들었는가?'],
        month: ['일하면서 "만든다"는 느낌이 드는 부분과 그렇지 않은 부분이 나뉘는가?'],
        day: ['집·연애에서 요리·돌봄·수다 중 뭐가 자연스럽고 뭐가 부담인가?'],
        hour: ['퇴근 후·주말에 혼자 해도 즐거운 취미가 있는가, 있었다가 접었는가?'],
      },
      hidden: ['남 앞에선 무뚝뚝한데 혼자 있을 때만 뭔가 만드는 습관이 있는가?'],
      mirror: ['만들기보다 받기·쉬기만 했을 때 오히려 회복됐던 시기가 있었는가?'],
    },
  },
  상관: {
    ko: '상관',
    hanja: '伤官',
    hint: '말이 앞섬, 규칙과의 마찰, 솔직함',
    templates: {
      core: [
        '말하고 나서 "아 그 말 왜 했지" 싶었던 순간 — 그때 뭐가 걸렸는가?',
        '틀렸다고 확신하는데 참은 적 — 몸 어디가 먼저 조였는가?',
      ],
      byPosition: {
        year: ['학교·집에서 "튀는 애" / "말 많은 애" / "반항하는 애" 중 뭐로 불렸는가?'],
        month: ['직장·모임에서 분위기를 깬 적 — 그때 내 입장은 뭐였는가?'],
        day: ['가까운 사람에게 솔직했다가 멀어진 적, 또는 솔직해서 가까워진 적?'],
        hour: ['요즘, 누군가에게 가르치거나 말로 남기고 싶은 욕구가 있는가?'],
      },
      hidden: ['겉으론 순응하는데 특정 주제만 나오면 말이 거칠어진다면 — 그 주제는?'],
      mirror: ['평소 말 많은데 그때만 입 다문 적 — 왜였는지 기억나는가?'],
    },
  },
  편재: {
    ko: '편재',
    hanja: '偏财',
    hint: '기회, 흐름, 들어왔다 나감',
    templates: {
      core: [
        '뜻밖에 돈·일·정보가 들어왔던 때 — 그때 잡았는가, 놓쳤는가?',
        '계산하기 전에 먼저 움직인 적 — 결과는 어땠는가?',
      ],
      byPosition: {
        year: ['집에서 "큰돈" "큰일" 이야기가 오가던 분위기 — 어떤 기억이 남는가?'],
        month: ['수입·일거리가 여러 갈래인 시기와 한 갈래인 시기 — 어느 쪽이 더 맞는가?'],
        day: ['연인·가족과 돈·선물·빚 이야기할 때 불편한지 편한지?'],
        hour: ['최근 투자·부업·한탕 — 해봤거나 해보고 싶은 게 있는가?'],
      },
      mirror: ['기회를 잡지 않고 지나간 뒤에도 오히려 편했던 적이 있는가?'],
    },
  },
  정재: {
    ko: '정재',
    hanja: '正财',
    hint: '월급, 약속, 관리, 꾸준함',
    templates: {
      core: [
        '가계부·달력·체크리스트 — 쓰는 편인가, 안 쓰는 편인가?',
        '돈 모을 때 "안전"과 "더 벌기" 중 어디에 더 신경 쓰는가?',
      ],
      byPosition: {
        year: ['어릴 때 집에서 "아껴 써라" / "쓸 땐 써라" 중 뭐가 더 많았는가?'],
        month: ['지금 일 — 고정 수입·정해진 역할이 있는가, 없는가?'],
        day: ['함께 사는 사람과 돈·집안일 분담 — 지금 만족하는가?'],
        hour: ['10년 뒤 재정 그림 — 머릿속에 숫자가 있는가, 막연한가?'],
      },
      mirror: ['한때 계획 없이 썼는데 그게 오히려 살아있게 느껴졌던 시기가 있었는가?'],
    },
  },
  편관: {
    ko: '편관',
    hanja: '七杀',
    hint: '압박, 위기, 단호함, 권위',
    templates: {
      core: [
        '위기 때 오히려 침착해졌던 적 — 그때 뭐가 달랐는가?',
        '누군가에게 "무섭다" / "강하다" / "피곤하다"고 들은 적 — 동의하는가?',
      ],
      byPosition: {
        year: ['어릴 때 무서웠던 어른·규칙 — 지금도 비슷한 사람·상황을 만나는가?'],
        month: ['일에서 압박·마감·책임이 큰 역할 — 버티는 편인가, 피하는 편인가?'],
        day: ['가까운 관계에서 통제·갈등 — 같은 패턴이 반복되는가?'],
        hour: ['최근 건강·수술·큰 결정 — 혼자 버텼는가, 누군가와 함께였는가?'],
      },
      mirror: ['압박 없이 느슨했을 때 오히려 무기력했던 적이 있는가?'],
    },
  },
  정관: {
    ko: '정관',
    hanja: '正官',
    hint: '규칙, 체면, 책임, 직함',
    templates: {
      core: [
        '규칙을 어겼을 때 — 들키는 게 더 무서운가, 양심이 더 무거운가?',
        '"착한 사람" / "모범" / "책임감 있다" — 듣기 좋은 말인가, 부담인가?',
      ],
      byPosition: {
        year: ['어릴 때 "반장" "모범생" "착한 아이" — 붙었던 꼬리표가 있는가?'],
        month: ['직장·사회에서 직함·역할 — 그게 나를 편하게 하는가, 조이는가?'],
        day: ['연애·결혼에서 "맞는 사람" 기준 — 도덕·안정·체면 중 뭐가 먼저인가?'],
        hour: ['나중에 어떻게 기억되고 싶은지 — 구체적인 장면이 떠오르는가?'],
      },
      mirror: ['한번 규칙을 깨고 나서 오히려 숨통이 트였던 적이 있는가?'],
    },
  },
  편인: {
    ko: '편인',
    hanja: '偏印',
    hint: '혼자 파기, 직감, 독학',
    templates: {
      core: [
        '남들 관심 없는데 혼자 빠졌던 주제 — 지금도 이어지는가?',
        '설명 듣기보다 직접 해보거나 글·영상 찾아보는 편인가?',
      ],
      byPosition: {
        year: ['어릴 때 "이상한 취미" "공부는 안 하는데 뭐만 하면" — 기억나는가?'],
        month: ['일·전문성 — 학교·자격 밖에서 익힌 게 큰가?'],
        day: ['가까운 사람과 "혼자만의 시간" — 필요한가, 미안한가?'],
        hour: ['요즘 밤·주말에 혼자 하는 일 — 누구에게도 말 안 하는 게 있는가?'],
      },
      mirror: ['혼자보다 스승·친구와 배웠을 때 더 깊었던 경험이 있는가?'],
    },
  },
  정인: {
    ko: '정인',
    hanja: '正印',
    hint: '배움, 보호, 도움 받기',
    templates: {
      core: [
        '도움 받았을 때 — 고마운가, 불편한가, 빚진 느낌인가?',
        '공부·자격·시험 — "해냈다"는 기억과 "포기했다"는 기억 중 뭐가 더 선명한가?',
      ],
      byPosition: {
        year: ['어릴 때 "엄마/아빠가 다 해줬다" / "혼자 알아서 했다" — 어느 쪽에 가깝나?'],
        month: ['지금 일 — 문서·자격·후배 가르침이 발판이 되었는가?'],
        day: ['집·연인 — 쉬는 곳이라고 느끼는가?'],
        hour: ['누군가에게 가르쳐주거나 글 남기고 싶은 마음이 있는가?'],
      },
      mirror: ['도움 거절하고 혼자 버텼는데 잘 풀렸던 적이 있는가?'],
    },
  },
};

export interface TenStarHit {
  tenStarKo: string;
  slot: PillarSlot;
  slotKo: string;
  layer: TenStarLayer;
  layerKo: string;
  pillar: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  tag?: 'core' | 'position' | 'hidden' | 'mirror';
  source: string;
}

export function buildTenStarQuestions(hit: TenStarHit): GeneratedQuestion[] {
  const def = TEN_STAR_TEMPLATES[hit.tenStarKo];
  if (!def) return [];

  const out: GeneratedQuestion[] = [];

  const push = (q: string, tag: GeneratedQuestion['tag']) => {
    out.push({ id: `${hit.tenStarKo}-${tag}-${out.length}`, text: q, tag, source: hit.tenStarKo });
  };

  for (const q of def.templates.core) push(q, 'core');

  const posQs = def.templates.byPosition?.[hit.slot];
  if (posQs) for (const q of posQs) push(q, 'position');

  if (hit.layer === 'hidden' && def.templates.hidden) {
    for (const q of def.templates.hidden) push(q, 'hidden');
  }

  if (def.templates.mirror) {
    for (const q of def.templates.mirror) push(q, 'mirror');
  }

  return out;
}
