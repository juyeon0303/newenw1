import type { SourceRef } from './sources';

export interface CommentaryParagraph {
  text: string;
  /** 이 문단에 직접 대응하는 출처 */
  sources?: SourceRef[];
}

export interface CommentaryNote {
  /** 짧은 톤 안내 — 단정 아님 */
  preamble?: string;
  paragraphs: CommentaryParagraph[];
  /** 문단에 안 붙인 공통 출처 */
  sources: SourceRef[];
  /** 기둥·지장간 등 맥락별 한 줄 (있을 때만) */
  bySlot?: Partial<Record<'year' | 'month' | 'day' | 'hour', string>>;
  /** 신살 기준(일지·일간 등) */
  byBasis?: Record<string, string>;
  /** 지장간일 때 */
  hiddenNote?: string;
  /** 고전 설명 → 기억 탐구로 넘기는 한 줄 */
  reflection?: string;
  /** enrich* 함수가 채우는 이 팔자 맥락 */
  contextLine?: string;
}

export const COMMENTARY_DISCLAIMER =
  '전통 문헌에서 자주 거론되는 해석의 한 축입니다. 팔자·대운·환경에 따라 달라질 수 있습니다.';

export function pickSlotNote(
  note: CommentaryNote,
  slot?: 'year' | 'month' | 'day' | 'hour',
): string | undefined {
  if (!slot || !note.bySlot) return undefined;
  return note.bySlot[slot];
}
