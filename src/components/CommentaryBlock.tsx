import type { CommentaryNote } from '@/lib/philosophy/commentary';
import {
  COMMENTARY_DISCLAIMER,
  formatSource,
} from '@/lib/philosophy/commentary';
import type { PillarSlot } from '@/lib/manseryeok';

interface Props {
  note: CommentaryNote;
  slot?: PillarSlot;
  layer?: 'stem' | 'branch' | 'hidden';
}

export function CommentaryBlock({ note }: Props) {
  const allSources = new Map<string, ReturnType<typeof formatSource>>();
  for (const s of note.sources) {
    allSources.set(s.id, formatSource(s));
  }
  for (const p of note.paragraphs) {
    for (const s of p.sources ?? []) {
      allSources.set(s.id, formatSource(s));
    }
  }

  return (
    <details className="commentary" open>
      <summary className="commentary__summary">기본 해설</summary>
      <p className="commentary__disclaimer">{COMMENTARY_DISCLAIMER}</p>
      {note.preamble && <p className="commentary__preamble">{note.preamble}</p>}
      {note.contextLine && <p className="commentary__context">{note.contextLine}</p>}
      {note.paragraphs.map((p) => (
        <p key={p.text.slice(0, 32)} className="commentary__para">
          {p.text}
        </p>
      ))}
      {note.reflection && (
        <p className="commentary__reflection">
          <span className="commentary__reflection-label">기억으로 연결</span>
          {note.reflection}
        </p>
      )}
      <footer className="commentary__sources">
        <span className="commentary__sources-label">출처</span>
        <ul>
          {[...allSources.values()].map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </footer>
    </details>
  );
}
