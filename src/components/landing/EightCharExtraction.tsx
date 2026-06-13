'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ManseryeokResult } from '@/lib/manseryeok';

interface Props {
  chart: ManseryeokResult;
  onComplete: () => void;
}

function eightChars(chart: ManseryeokResult): string[] {
  const { year, month, day, hour } = chart.pillars;
  const base = [
    year.pillar[0],
    year.pillar[1],
    month.pillar[0],
    month.pillar[1],
    day.pillar[0],
    day.pillar[1],
  ];
  if (chart.meta.timeUnknown || hour.unknown) {
    return [...base, '?', '?'];
  }
  return [...base, hour.pillar[0], hour.pillar[1]];
}

const ORBIT = [
  { x: -120, y: -80, rotate: 0 },
  { x: 80, y: -100, rotate: 45 },
  { x: 130, y: 0, rotate: 90 },
  { x: 90, y: 90, rotate: 135 },
  { x: -40, y: 120, rotate: 180 },
  { x: -110, y: 40, rotate: 225 },
  { x: 0, y: -30, rotate: 270 },
  { x: -60, y: -120, rotate: 315 },
];

const GRID = [
  { x: -150, y: -60 },
  { x: -50, y: -60 },
  { x: 50, y: -60 },
  { x: 150, y: -60 },
  { x: -150, y: 60 },
  { x: -50, y: 60 },
  { x: 50, y: 60 },
  { x: 150, y: 60 },
];

export function EightCharExtraction({ chart, onComplete }: Props) {
  const chars = eightChars(chart);

  useEffect(() => {
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="eight-extract" aria-live="polite">
      <p className="eight-extract__label">
        {chart.meta.timeUnknown ? '8-BIT · 삼주 연산 중…' : '8-BIT 연산 중…'}
      </p>
      <div className="eight-extract__stage">
        {chars.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="eight-extract__glyph"
            initial={{
              x: ORBIT[i].x,
              y: ORBIT[i].y,
              rotate: ORBIT[i].rotate,
              opacity: 0,
              scale: 0.3,
            }}
            animate={{
              x: [ORBIT[i].x, 0, GRID[i].x],
              y: [ORBIT[i].y, 0, GRID[i].y],
              rotate: [ORBIT[i].rotate, 360, 0],
              opacity: [0, 1, 1],
              scale: [0.3, 1.2, 1],
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="eight-extract__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        만세력 좌표를 벤토 그리드에 배치합니다
      </motion.p>
    </div>
  );
}
