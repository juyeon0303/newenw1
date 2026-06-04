import type { PillarSlot } from '@/lib/manseryeok';
import type { RelationKind, RelationType, RelationSlotRef } from '../templates/relations';
import { TEN_STAR_COMMENTARY } from './ten-star';
import { RELATION_COMMENTARY, STEM_RELATION_ADDENDUM, findPairCommentary } from './relations';
import { SPIRIT_COMMENTARY, GENERIC_SPIRIT_COMMENTARY } from './spirits';
import type { CommentaryNote } from './types';
import {
  enrichSpiritNote,
  enrichTenStarNote,
  formatRelationSlotsKo,
} from './context';

export type { CommentaryNote };
export { COMMENTARY_DISCLAIMER, pickSlotNote } from './types';
export { buildDaewoonCommentary, buildDaewoonMetaNote } from './daewoon';
export {
  buildMonthCommandCommentary,
  MONTH_COMMAND_QUESTIONS,
} from './month-command';
export { formatSource } from './sources';

export function getTenStarCommentary(
  name: string,
  slot?: PillarSlot,
  layer?: 'stem' | 'branch' | 'hidden',
): CommentaryNote | null {
  const base = TEN_STAR_COMMENTARY[name];
  if (!base) return null;
  return enrichTenStarNote(base, slot, layer);
}

export function getSpiritCommentary(name: string, basis?: string): CommentaryNote {
  const base = SPIRIT_COMMENTARY[name] ?? GENERIC_SPIRIT_COMMENTARY;
  return enrichSpiritNote(base, basis);
}

export function getRelationCommentary(
  type: RelationType,
  kind: RelationKind,
  label?: string,
  slots?: RelationSlotRef[],
): CommentaryNote | null {
  const base = RELATION_COMMENTARY[type];
  if (!base) return null;

  const paragraphs = [...base.paragraphs];

  if (label) {
    const pair = findPairCommentary(label);
    if (pair) paragraphs.push(pair);
  }

  if (kind === 'stem' && (type === '충' || type === '합')) {
    const addendum = STEM_RELATION_ADDENDUM[type];
    if (addendum) {
      paragraphs.push({ text: addendum, sources: base.sources });
    }
  }

  let contextLine: string | undefined;
  if (slots && slots.length > 0) {
    contextLine = `이 팔자 — ${formatRelationSlotsKo(slots)}에 걸려 있음.`;
  }

  return { ...base, paragraphs, contextLine };
}

export function getSlotContextLine(
  note: CommentaryNote,
  slot?: PillarSlot,
  layer?: 'stem' | 'branch' | 'hidden',
): string | undefined {
  return note.contextLine;
}
