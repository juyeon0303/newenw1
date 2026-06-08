'use client';

import type { LuckPillarDetail } from '@/lib/manseryeok';

interface Props {
  daewoon: LuckPillarDetail[];
  currentIndex?: number;
}

export function DaewoonTimeline({ daewoon, currentIndex = 0 }: Props) {
  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-3 min-w-max">
        {daewoon.map((d, i) => {
          const active = i === currentIndex;
          return (
            <div
              key={d.startAge}
              className={`shrink-0 w-28 rounded-xl p-3 border transition ${
                active
                  ? 'border-fuchsia-400/60 bg-fuchsia-500/10 shadow-lg shadow-fuchsia-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <p className="text-[10px] text-white/40 mb-1">
                {d.startAge}~{d.endAge}세
              </p>
              <p className="text-lg font-semibold tracking-tight">{d.pillar}</p>
              <p className="text-[11px] text-white/50 mt-1 truncate">{d.stemTenStarKo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
