/**
 * 수익화 로드맵 — 구현 보류, 철학·명분만 코드로 보관.
 * 원리·기초 데이터는 무료. 개인화 액션·시간 자원·소장형 리포트는 유료(추후).
 */

export type MonetizationTierId =
  | 'action_report'
  | 'wiki_ads'
  | 'calendar_sub'
  | 'pdf_manual';

export interface MonetizationTier {
  id: MonetizationTierId;
  title: string;
  priceHint: string;
  rationale: string;
  status: 'planned';
}

export const MONETIZATION_TIERS: MonetizationTier[] = [
  {
    id: 'action_report',
    title: '개인화 의사결정 리포트',
    priceHint: '3,900원/회',
    rationale:
      '오행·십신·격국 원리는 무료. 일상 대입 초개인화 연산(이직·계약·관계 타이밍)만 복채.',
    status: 'planned',
  },
  {
    id: 'wiki_ads',
    title: '명리 위키 SEO + 광고',
    priceHint: 'AdSense 등',
    rationale: '오픈 아카이브로 덕후 유입 → 내 팔자 대조 CTA.',
    status: 'planned',
  },
  {
    id: 'calendar_sub',
    title: '운명 캘린더 연동',
    priceHint: '2,900원/월',
    rationale: '일진·대운을 캘린더에 주입. 시간 자원 판매.',
    status: 'planned',
  },
  {
    id: 'pdf_manual',
    title: '8-bit 평생 사용설명서 PDF',
    priceHint: '9,900~14,900원',
    rationale: '템플릿 자동 생성 고마진 디지털 상품.',
    status: 'planned',
  },
];

export const FREE_TIER_MANIFESTO =
  '명리학적 원리와 기초 좌표는 조건 없이 공개합니다. 공포 마케팅·정보 독점이 아니라, 투명한 툴입니다.';
