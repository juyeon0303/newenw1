'use client';

interface Props {
  visited: number;
  total: number;
  notes: number;
  memories: number;
  onContinue?: () => void;
  canContinue: boolean;
}

export function ExploreProgressBar({
  visited,
  total,
  notes,
  memories,
  onContinue,
  canContinue,
}: Props) {
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;

  return (
    <div className="explore-progress">
      <div className="explore-progress__head">
        <span>탐구 진행</span>
        <span className="explore-progress__stat">
          {visited}/{total} · 노트 {notes} · 기억 {memories}
        </span>
      </div>
      <div className="explore-progress__track" aria-hidden>
        <div className="explore-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      {canContinue && onContinue && (
        <button type="button" className="explore-progress__continue" onClick={onContinue}>
          이어서 탐구하기 →
        </button>
      )}
    </div>
  );
}
