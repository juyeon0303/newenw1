import { EXPLORE_PHILOSOPHY, SAJU_DETERMINISM } from '@/lib/philosophy/content';
import { FREE_TIER_MANIFESTO } from '@/lib/business/monetization-plan';
import { EIGHT_BIT_SUPERIORITY } from '@/lib/business/competitive-landscape';
import { COMMENTARY_DISCLAIMER } from '@/lib/philosophy/commentary';

/** 사이트 철학에 맞춘 해석 출력 정책 — 모든 리포트·패널이 참조 */
export const INTERPRETATION_POLICY = {
  brand: '8-BIT',
  manifesto: FREE_TIER_MANIFESTO,
  explorePhilosophy: EXPLORE_PHILOSOPHY,
  determinism: SAJU_DETERMINISM.title,
  commentaryDisclaimer: COMMENTARY_DISCLAIMER,
  superiorityHeadline: EIGHT_BIT_SUPERIORITY.headline,

  /** 해석 문장 생성 규칙 */
  rules: {
    /** LLM·블랙박스 서술 금지 — 규칙·템플릿·고전 인용만 */
    noGenerativeBlackBox: true,
    /** 길흉·공포·나쁜 사주 단정 금지 */
    noFearMarketing: true,
    /** 모든 점수·티어는 산식 또는 가중치 근거 노출 */
    exposeScoring: true,
    /** 고전 해설은 출처 필수 */
    requireSources: true,
    /** 운세 예언 대신 탐구 질문 병행 */
    pairWithQuestions: true,
    /** 학파 한계·다의성 명시 (용신 후보 복수 등) */
    acknowledgeAmbiguity: true,
  },

  /** 경쟁사 대비 우선 노출할 해석 레이어 순서 */
  layerOrder: [
    'principle', // 격국·용신·신강약 (free-report)
    'priority', // 우선순위 탐구 (build-explore)
    'commentary', // 고전 맥락
    'timing', // 대운·유년 (산식 공개)
    'lifestyle', // 커리어·재물 (산식 공개, 조언은 탐구 톤)
  ] as const,

  /** UI에 보여줄 상위 인사이트 개수 */
  topInsightCount: 8,
} as const;

export type InterpretationLayer = (typeof INTERPRETATION_POLICY.layerOrder)[number];
