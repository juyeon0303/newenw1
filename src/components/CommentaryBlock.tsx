import type { CommentaryNote } from '@/lib/philosophy/commentary';
import {
  COMMENTARY_DISCLAIMER,
  formatSource,
} from '@/lib/philosophy/commentary';

interface Props {
  note: CommentaryNote;
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
  const sourceLabels = [...allSources.values()];

  return (
    <details className="commentary">
      <summary className="commentary__summary">해설</summary>
      <div className="commentary__body">
        <p className="commentary__disclaimer">{COMMENTARY_DISCLAIMER}</p>
        {note.contextLine && <p className="commentary__context">{note.contextLine}</p>}
        {note.preamble && <p className="commentary__para">{note.preamble}</p>}
        {note.paragraphs.map((p) => (
          <p key={p.text.slice(0, 32)} className="commentary__para">
            {p.text}
          </p>
        ))}
        {note.reflection && (
          <p className="commentary__reflection">{note.reflection}</p>
        )}
        {sourceLabels.length > 0 && (
          <details className="commentary__sources">
            <summary>출처</summary>
            <ul>
              {sourceLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </details>
  );
}
