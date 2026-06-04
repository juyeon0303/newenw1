import { SOURCES } from './sources';
import type { CommentaryParagraph, CommentaryNote } from './types';

const S = SOURCES.samMyeong;
const Y = SOURCES.yeonHae;
const J = SOURCES.jaPYeong;
const D = SOURCES.jeokCheon;

/** label(子午충 등)에 포함되면 덧붙이는 쌍별 해설 */
export const PAIR_COMMENTARY: Record<string, CommentaryParagraph> = {
  子午: {
    text: '子午충(子午冲)은 낮(午)과 밤(子)의 정면 충돌로, 《삼명통회》·《淵海子平》에서 이동·분주·수면·거주·리듬의 변화, 또는 겉·속이 엇갈리는 테마로 자주 논한다. 일·시에 걸리면 가까운 관계·말년 쪽에서 "휘둘린다"는 느낌이 반복되는지 본다.',
    sources: [S, Y],
  },
  卯酉: {
    text: '卯酉충은 봄(卯)과 가을(酉)의 충으로, 시작·수확·대외·대내의 교체, 또는 관계·일에서 "맞교환"이 일어나는 장면을 떠올리게 한다.',
    sources: [S, Y],
  },
  辰戌: {
    text: '辰戌충은 토(土)의 충으로, 저장·고집·자리·집·조직의 구조가 흔들리는 테마로 논의된다.',
    sources: [S],
  },
  丑未: {
    text: '丑未충은 겨울(丑)과 여름(未)의 충으로, 느리게 쌓인 것과 갑자기 열리는 것의 부딪침, 또는 가족·토지·생활 기반의 변동으로 읽히기도 한다.',
    sources: [S, Y],
  },
  寅申: {
    text: '寅申충은 봄(寅)과 가을(申)의 충으로, 출발·이동·전환·멀리 나가는 기운과 맞물려 논의된다.',
    sources: [S],
  },
  巳亥: {
    text: '巳亥충은 여름(巳)과 겨울(亥)의 충으로, 숨은 불(巳)과 넓게 퍼지는 수(亥)의 마찰 — 감정·직관·말하지 않은 욕구가 드러나는 순간을 떠올리게 한다.',
    sources: [S, Y],
  },
  甲庚: {
    text: '甲庚충은 木과 金의 정면 충돌이다. 《滴天髓》 등에서 "갑(始)과 경(終)" — 내 방식과 규칙·역할·권위가 정면으로 부딪히는 장면, 말·결정·행동의 엇갈림으로 읽는 경우가 많다.',
    sources: [D, J],
  },
  乙辛: {
    text: '乙辛충은 부드러운 木과 날카로운 金의 마찰 — 겉으론 맞추다 속으로 상처·거리가 생기는 패턴을 떠올리게 한다.',
    sources: [D],
  },
  丙壬: {
    text: '丙壬충은 火와 水의 충 — 열과 냉, 드러남과 잠김, 감정의 폭발과 억압이 교차하는 테마로 논의된다.',
    sources: [D, S],
  },
  丁癸: {
    text: '丁癸충은 세밀한 火와 水의 충 — 작은 말·작은 행동이 크게 엇갈리거나, 비밀·감정이 새는 순간을 떠올리게 한다.',
    sources: [D],
  },
};

export const RELATION_COMMENTARY: Record<string, CommentaryNote> = {
  충: {
    paragraphs: [
      {
        text: '충(冲)은 지지·천간이 정면으로 부딪치는 관계다. 《삼명통회》·《滴天髓》에서 이동·변화·깨짐·교체·갈등의 역동으로 읽어 왔다. "나쁘다"보다 "움직인다"에 가깝다.',
        sources: [S, D],
      },
      {
        text: '이사·이직·이별·큰 싸움·몸·리듬의 변화처럼, 고정이 깨지는 순간이 반복되는지 본다. 반드시 사고·파국을 뜻하지는 않는다.',
        sources: [S, Y],
      },
    ],
    sources: [S, D],
    reflection: '방향이 갑자기 바뀌었던 때 — 그 직전에 무엇이 답답했는지, 몸이 먼저 알려 줬는지 본다.',
  },
  합: {
    paragraphs: [
      {
        text: '합(合)은 지지·천간이 붙는 관계다. 결속·타협·고정·인연·化(化)의 가능성으로 논의된다.',
        sources: [S, J],
      },
      {
        text: '무조건 "좋다"는 뜻은 아니다. 오래 붙어 있는 관계·일·습관처럼, 편안함과 답답함이 함께 오는지 본다.',
        sources: [J],
      },
    ],
    sources: [S, J],
    reflection: '끊기 어려운 것 — 이름을 적어 본 뒤, 붙어 있어서 편한지 답답한지 몸으로 확인해 본다.',
  },
  형: {
    paragraphs: [
      {
        text: '형(刑)은 지지 간 각을 세우는 관계다. 《삼명통회》에서는 형벌·수술·구설·마찰·자기와의 긴장 등으로 넓게 논한다.',
        sources: [S],
      },
      {
        text: '삼형(三刑) 등 조합마다 결이 다르다. 말은 안 해도 불편한 사람·상황, 비슷한 갈등의 반복이 떠오르는지 본다.',
        sources: [S, Y],
      },
    ],
    sources: [S, Y],
    reflection: '불편한데 이유를 설명하기 어려운 관계 — 몸 어디가 먼저 반응하는지부터 본다.',
  },
  해: {
    paragraphs: [
      {
        text: '해(害)는 육합을 방해하는 관계로, 눈에 띄는 충보다 미묘하고 서서히 갉아먹는 불편으로 읽히기도 한다.',
        sources: [S],
      },
    ],
    sources: [S],
    reflection: '겉으론 유지되는데 속이 닳는 관계 — 언제부터였는지 떠올려 본다.',
  },
  파: {
    paragraphs: [
      {
        text: '파(破)는 기존 구조·습관·관계의 균열·단절을 떠올리게 한다. 갑자기 끊겼던 것 직전에 신호가 있었는지 본다.',
        sources: [S, Y],
      },
    ],
    sources: [S, Y],
    reflection: '끊김 직전 — 몸·말·분위기에서 이미 갈라진 흔적이 있었는지 본다.',
  },
  원진: {
    paragraphs: [
      {
        text: '원진(怨嗔)은 원망·미워함의 기운으로, 말 없이 불편하거나 엇갈리는 관계의 상징으로 12신살·지지론에서 함께 다룬다.',
        sources: [S],
      },
    ],
    sources: [S],
    reflection: '이유 없이 거슬리거나 피하고 싶은 사람 — 이름이 떠오르면, 그 감각이 언제부터였는지 본다.',
  },
  귀문: {
    paragraphs: [
      {
        text: '귀문(鬼門)은 문턱·전환·불안의 상징으로, 특정 지지 쌍에서 갑작스런 변화·이상·공포의 테마를 논의하기도 한다.',
        sources: [S, Y],
      },
    ],
    sources: [S, Y],
    reflection: '문턱 앞에서 멈칫했던 순간 — 들어가지 못한 이유가 두려움인지, 아직 준비가 안 됐는지 본다.',
  },
  회: {
    paragraphs: [
      {
        text: '회(會)는 삼합·방합 등 한 방향·한 계절·한 오행으로 모이는 관계다. 기운의 편중·집중 — 한 가지에 몰아붙은 시기가 있었는지 본다.',
        sources: [S, J],
      },
    ],
    sources: [S, J],
    reflection: '한 방향으로만 달렸던 시기 — 그때 집중한 테마가 지금도 이어지는지 본다.',
  },
  천라: {
    paragraphs: [
      {
        text: '천라(天羅) 戌亥는 하늘의 그물·막힘·정체의 상징으로, 움직임이 둔해지거나 갇힌 느낌의 테마로 논의된다.',
        sources: [S, Y],
      },
    ],
    sources: [S, Y],
    reflection: '막혀 있다고 느낀 시기 — 밖에서 막힌 건지, 안에서 막힌 건지 구분해 본다.',
  },
  지망: {
    paragraphs: [
      {
        text: '지망(地網) 辰巳는 땅의 그물·허무·끊김의 상징으로, 천라와 짝을 이루어 막힘·공허의 축으로 읽히기도 한다.',
        sources: [S, Y],
      },
    ],
    sources: [S, Y],
    reflection: '의미가 비는 느낌 — 그때 무엇을 붙잡고 있었는지, 놓치고 있었는지 본다.',
  },
};

export const STEM_RELATION_ADDENDUM: Partial<Record<'충' | '합', string>> = {
  충: '천간충은 겉으로 드러나는 성격·역할·의도의 충돌, 말·결정·행동의 엇갈림으로 읽는 경우가 많다.',
  합: '천간합은 의도·역할·관계에서 붙으려는 기운으로, 五合·化氣 논의와 연결되기도 한다.',
};

export function findPairCommentary(label: string): CommentaryParagraph | undefined {
  for (const [key, para] of Object.entries(PAIR_COMMENTARY)) {
    if (label.includes(key)) return para;
  }
  return undefined;
}
