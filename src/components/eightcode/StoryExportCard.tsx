'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import type { ManseryeokResult } from '@/lib/manseryeok';
import { buildPersonalitySummary, dominantElement } from '@/lib/personality';

interface Props {
  chart: ManseryeokResult;
}

const EL_COLOR: Record<string, string> = {
  木: '#34d399',
  火: '#fb7185',
  土: '#fbbf24',
  金: '#cbd5e1',
  水: '#38bdf8',
};

export function StoryExportCard({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const summary = buildPersonalitySummary(chart);
  const dom = dominantElement(chart.elementCount);

  async function handleExport() {
    if (!ref.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 1,
        backgroundColor: '#07070f',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `8-bit-${chart.pillars.day.pillar}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="story-preview-wrap border border-white/10 shadow-2xl">
        <div
          ref={ref}
          className="story-canvas flex flex-col justify-between p-16 text-white"
          style={{
            background:
              'linear-gradient(160deg, #0f0a1a 0%, #07070f 40%, #0a1520 100%)',
          }}
        >
          <div>
            <p className="text-4xl font-bold tracking-[0.35em] text-white/90">8-bit</p>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-5xl font-bold">{chart.pillars.day.pillar}</p>
              <p className="text-3xl text-white/60 mt-4">{summary.headline}</p>
            </div>
            <div
              className="inline-block rounded-2xl px-8 py-4 text-3xl font-semibold"
              style={{ backgroundColor: `${EL_COLOR[dom]}22`, color: EL_COLOR[dom] }}
            >
              {dom} 기운 ·{' '}
              {Math.round(
                (chart.elementCount[dom] /
                  Object.values(chart.elementCount).reduce((a, b) => a + b, 0)) *
                  100,
              )}
              %
            </div>
            <p className="text-2xl leading-relaxed text-white/75 max-w-[90%]">
              {summary.body}
            </p>
          </div>

          <p className="text-xl text-white/30">8-bit</p>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={handleExport}
        disabled={exporting}
        className="w-full rounded-xl py-3 text-sm font-medium bg-white/10 border border-white/15 hover:bg-white/15 disabled:opacity-50"
      >
        {exporting ? '이미지 생성 중…' : '스토리 카드 PNG보내기 (1080×1920)'}
      </motion.button>
      <p className="text-center text-xs text-white/35">
        인스타 스토리 비율 · html2canvas
      </p>
    </div>
  );
}
