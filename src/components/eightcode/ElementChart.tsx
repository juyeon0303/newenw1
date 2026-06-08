'use client';

import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';

const META: Record<keyof ElementCount, { ko: string; color: string }> = {
  木: { ko: '목', color: 'from-emerald-500 to-green-400' },
  火: { ko: '화', color: 'from-orange-500 to-red-400' },
  土: { ko: '토', color: 'from-amber-500 to-yellow-400' },
  金: { ko: '금', color: 'from-slate-300 to-zinc-400' },
  水: { ko: '수', color: 'from-cyan-500 to-blue-400' },
};

interface Props {
  counts: ElementCount;
}

export function ElementChart({ counts }: Props) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const entries = (Object.entries(counts) as [keyof ElementCount, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-4">
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {entries.map(([el, n]) => (
          <div
            key={el}
            className={`h-full bg-gradient-to-r ${META[el].color}`}
            style={{ width: `${(n / total) * 100}%` }}
            title={`${META[el].ko} ${Math.round((n / total) * 100)}%`}
          />
        ))}
      </div>
      <ul className="space-y-3">
        {entries.map(([el, n]) => {
          const pct = Math.round((n / total) * 100);
          return (
            <li key={el} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-white/70">{META[el].ko}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${META[el].color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-white/50 tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
