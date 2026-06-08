'use client';

import { useState } from 'react';
import type { LuckPillarDetail, ManseryeokResult } from '@/lib/manseryeok';
import { buildDaewoonCommentary } from '@/lib/philosophy/commentary';
import { CommentaryBlock } from '@/components/CommentaryBlock';

interface Props {
  daewoon: LuckPillarDetail[];
  chart?: ManseryeokResult;
  currentIndex?: number;
}

export function DaewoonTimeline({ daewoon, chart, currentIndex = 0 }: Props) {
  const [selected, setSelected] = useState(currentIndex);

  const note =
    chart && daewoon[selected]
      ? buildDaewoonCommentary(daewoon[selected], chart, {
          isCurrent: selected === currentIndex,
          index: selected,
        })
      : null;

  return (
    <div>
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-3 min-w-max">
          {daewoon.map((d, i) => {
            const active = i === selected;
            const isCurrent = i === currentIndex;
            return (
              <button
                key={d.startAge}
                type="button"
                className={`shrink-0 w-28 rounded-xl p-3 border transition text-left ${
                  active
                    ? 'border-fuchsia-400/60 bg-fuchsia-500/10 shadow-lg shadow-fuchsia-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setSelected(i)}
              >
                <p className="text-[10px] text-white/40 mb-1">
                  {d.startAge}~{d.endAge}세
                  {isCurrent && <span className="text-fuchsia-300/80 ml-1">· 현재</span>}
                </p>
                <p className="text-lg font-semibold tracking-tight">{d.pillar}</p>
                <p className="text-[11px] text-white/50 mt-1 truncate">{d.stemTenStarKo}</p>
              </button>
            );
          })}
        </div>
      </div>
      {note && chart && (
        <div className="mt-4">
          <CommentaryBlock note={note} />
        </div>
      )}
    </div>
  );
}
