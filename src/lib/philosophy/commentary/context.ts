import type { PillarSlot } from '@/lib/manseryeok';
import type { RelationSlotRef } from '../templates/relations';
import type { CommentaryNote } from './types';

export const SLOT_HEAD: Record<PillarSlot, string> = {
  year: '년주 — 유년·가문·환경',
  month: '월주 — 사회·직업·월령',
  day: '일주 — 자아·가까운 관계',
  hour: '시주 — 말년·결과·자녀',
};

export function formatRelationSlotsKo(slots: RelationSlotRef[]): string {
  const parts = slots.map((s) => `${s.slotKo}주 ${s.part}`);
  return [...new Set(parts)].join(', ');
}

export function enrichTenStarNote(
  base: CommentaryNote,
  slot?: PillarSlot,
  layer?: 'stem' | 'branch' | 'hidden',
): CommentaryNote {
  let contextLine: string | undefined;

  if (layer === 'hidden' && base.hiddenNote) {
    contextLine = base.hiddenNote;
  } else if (slot && base.bySlot?.[slot]) {
    contextLine = `이 팔자(${SLOT_HEAD[slot]}) — ${base.bySlot[slot]}`;
  }

  return { ...base, contextLine };
}

export function enrichSpiritNote(
  base: CommentaryNote,
  basis?: string,
): CommentaryNote {
  if (!basis || !base.byBasis?.[basis]) return base;
  return {
    ...base,
    contextLine: `기준 ${basis} — ${base.byBasis[basis]}`,
  };
}
