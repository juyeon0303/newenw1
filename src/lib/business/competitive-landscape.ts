/**
 * 경쟁 사주·운세 서비스 분석 + 8-BIT 상위호환 전략.
 * UI/해석 엔진이 이 정책을 따르도록 `interpretation/policy.ts`와 연동한다.
 */

export type CompetitorTier = 'mass' | 'api' | 'enterprise';

export interface CompetitorProfile {
  id: string;
  name: string;
  tier: CompetitorTier;
  /** 해석 산출 방식 요약 */
  algorithm: string[];
  /** 대표 기능 */
  features: string[];
  /** 구조적 약점 (8-BIT가 이겨야 할 지점) */
  weaknesses: string[];
}

/** 국내·글로벌 대표 서비스군 — 2025~2026 기준 공개 자료·API 문서·리뷰 종합 */
export const COMPETITOR_PROFILES: CompetitorProfile[] = [
  {
    id: 'jeomsin',
    name: '점신',
    tier: 'mass',
    algorithm: [
      '만세력 좌표 산출 후 정형화된 텍스트 DB 매칭',
      '십성·신살·대운 키워드 → 미리 작성된 운세 문장 조합',
      '광고 시청 후 무료 리포트 — 학파·공식 비공개',
    ],
    features: [
      '정통 사주·토정비결·총운',
      '궁합·인맥보고서·행운보고서',
      '관상·손금 AI',
      '타로·이사택일·행운 아이템',
      '부적·상담사 연결(유료)',
    ],
    weaknesses: [
      '해석 근거·산식 비공개 — 같은 팔자도 앱마다 결과 상이',
      '정형화 문구 반복 — 개인 맥락·탐구 질문 없음',
      '공포·길흉 마케팅 톤',
      '만세력 계산과 해석이 분리되어 검증 불가',
    ],
  },
  {
    id: 'forceteller',
    name: '포스텔러',
    tier: 'mass',
    algorithm: [
      '만세력 + LLM/챗봇 상담 — 프롬프트·RAG 비공개',
      '일간운세·MBTI형 가벼운 UX',
      '딥 리포트는 유료 결제 구간',
    ],
    features: [
      'AI 사주 상담(앱)',
      '일간·신년·궁합',
      '캐릭터·일러스트 UX',
      '프리미엄 유료 리포트',
    ],
    weaknesses: [
      'LLM 환각·일관성 문제 — 좋은 말 위주 편향',
      '명리 원리·출처 인용 없음',
      '무료 구간은 얕은 요약',
    ],
  },
  {
    id: 'luckyloveme',
    name: '운세위키 API',
    tier: 'api',
    algorithm: [
      'REST JSON — 신강약 7단계·격국·억부용신·격국용신(자평진전)',
      '지장간 투출·통근·합화 조건',
      '대운·세운·월운 십성·합충·12운성',
      '20종+ 신살 — 명리학자 자문 설계',
    ],
    features: [
      '만세력·궁합·시기별 운세 API',
      '격국/용신 다학파 필드',
      'B2B 임베딩',
    ],
    weaknesses: [
      '데이터만 제공 — 철학·탐구 UX 없음',
      '최종 해석은 고객사 몫(블랙박스 가능)',
      '사용자에게 산식·우선순위 비노출',
    ],
  },
  {
    id: 'ablecity',
    name: 'Ablecity Manse-force',
    tier: 'enterprise',
    algorithm: [
      '동적 합화(진화/가화) — 월령·뿌리·충 조건',
      '탐합망충 — 합이 충을 덮는 세력 비교',
      '벡터 가중치 — 궁위·거리 반영',
      'NASA JPL 진태양시',
    ],
    features: [
      'B2B 사주 API v2',
      '타로·관상·손금 모듈',
      'RAG 스토리텔링',
    ],
    weaknesses: [
      '엔터프라이즈 가격·블랙박스',
      '스토리텔링이 원리 투명성을 대체',
      '일반 사용자 직접 검증 불가',
    ],
  },
  {
    id: 'ai-saju',
    name: 'AI 사주(명국해독 등)',
    tier: 'mass',
    algorithm: [
      '만세력 JSON → LLM 종합 서술',
      '직업·재물·애정·건강 카테고리 템플릿',
      '24h 챗봇 상담',
    ],
    features: [
      'AI 종합 리포트',
      '관상 분석',
      '실시간 상담',
    ],
    weaknesses: [
      '고전 출처·학파 명시 없음',
      '단정적 운세 톤',
      '재현성·감사(audit) 불가',
    ],
  },
];

/** 8-BIT가 경쟁사 대비 우위를 점하는 축 */
export const EIGHT_BIT_SUPERIORITY = {
  headline: '블랙박스 운세가 아니라, 검증 가능한 명리 탐구',
  pillars: [
    {
      id: 'transparent-core',
      title: '원리 공개 (무료)',
      vs: '점신·포스텔러·AI 사주의 비공개 매칭/LLM',
      ours:
        '격국·신강약 비율·용신 후보·월령 당령을 수식과 함께 노출. 만세력 좌표는 tyme4ts + 시간보정으로 재현 가능.',
    },
    {
      id: 'sourced-commentary',
      title: '고전 맥락 + 출처',
      vs: 'API/AI의 무출처 서술',
      ours:
        '자평진전·적천수·삼명통회 인용 해설. 단정이 아닌 탐구용 맥락 + 반성 질문.',
    },
    {
      id: 'priority-engine',
      title: '우선순위 엔진',
      vs: '모든 십성·신살을 동일 가중 나열',
      ours:
        '일주·월주·충합 가중치로 core/important/reference 티어 산정 — PRIORITY_CRITERIA 공개.',
    },
    {
      id: 'reflective-not-predictive',
      title: '예언이 아닌 탐구',
      vs: '오늘의 운세·길흉 단정',
      ours:
        '해설은 질문과 축(EXPLORE_AXES)으로 연결. 공포 마케팅·나쁜 사주 프레이밍 금지.',
    },
    {
      id: 'timing-transparency',
      title: '타이밍 점수 투명화',
      vs: '커리어/재물/궁합 점수 블랙박스',
      ours:
        '시너지·커리어·재물 점수의 기본값·가산·감산 항목을 UI에 공개.',
    },
    {
      id: 'no-fear-monetization',
      title: '유료는 타이밍 가이드만',
      vs: '핵심 해석·딥 리포트 유료화',
      ours:
        '원리·좌표·탐구는 영구 무료. 유료(예정)는 행동 타이밍·PDF — 결제 전에도 산식은 공개.',
    },
  ],
  featureMatrix: [
    { feature: '만세력·십성·신살', competitors: '공통', eightBit: '동등 + 시간보정·지장간 공개' },
    { feature: '격국·용신', competitors: 'API/B2B만 정밀', eightBit: '무료 원리 리포트 + 학파 한계 명시' },
    { feature: '궁합·시너지', competitors: '점수만', eightBit: '오행 갭 + 합충 + 점수 산식 공개' },
    { feature: '커리어·재물 타이밍', competitors: '단정 조언', eightBit: '유년·유일 십성 + 점수 근거 + 탐구 톤' },
    { feature: 'AI 상담', competitors: '포스텔러·AI 사주', eightBit: '커뮤니티 + 외부 AI 권장(만세력 캡처)' },
    { feature: '위키·교육', competitors: '없거나 유료', eightBit: '명리 위키 오픈 아카이브' },
    { feature: '커뮤니티', competitors: '제한적', eightBit: '커뮤니티 — 익명 탐구 공유' },
    { feature: '관상·타로', competitors: '점신·포스텔러', eightBit: '비목표 — 명리 집중' },
  ],
} as const;
