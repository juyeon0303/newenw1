import type { ManseryeokResult } from '@/lib/manseryeok';
import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';

const ELEMENTS: (keyof ElementCount)[] = ['木', '火', '土', '金', '水'];

const PALETTE: Record<
  keyof ElementCount,
  { primary: string; secondary: string; neon: string; symbol: string; mantra: string }
> = {
  木: {
    primary: '#1a3d2e',
    secondary: '#34d399',
    neon: '#6ee7b7',
    symbol: '木',
    mantra: '성장의 기운을 채운다',
  },
  火: {
    primary: '#3d1a1a',
    secondary: '#fb7185',
    neon: '#fda4af',
    symbol: '火',
    mantra: '추진의 불꽃을 채운다',
  },
  土: {
    primary: '#3d3520',
    secondary: '#fbbf24',
    neon: '#fde68a',
    symbol: '土',
    mantra: '안정의 땅을 채운다',
  },
  金: {
    primary: '#2a2a35',
    secondary: '#cbd5e1',
    neon: '#e2e8f0',
    symbol: '金',
    mantra: '결단의 쇠를 채운다',
  },
  水: {
    primary: '#1a2a3d',
    secondary: '#38bdf8',
    neon: '#7dd3fc',
    symbol: '水',
    mantra: '통찰의 물을 채운다',
  },
};

export interface TalismanDesign {
  missingElement: keyof ElementCount;
  elementKo: string;
  primaryColor: string;
  secondaryColor: string;
  neonColor: string;
  symbol: string;
  mantra: string;
  dayPillar: string;
  /** SVG data URL for wallpaper */
  svgDataUrl: string;
}

function weakestElement(ec: ElementCount): keyof ElementCount {
  return [...ELEMENTS].sort((a, b) => ec[a] - ec[b])[0];
}

export function buildTalisman(chart: ManseryeokResult): TalismanDesign {
  const missing = weakestElement(chart.elementCount);
  const p = PALETTE[missing];
  const dayPillar = chart.pillars.day.pillar;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${p.primary}"/>
      <stop offset="50%" style="stop-color:#07070f"/>
      <stop offset="100%" style="stop-color:${p.secondary}22"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <circle cx="540" cy="720" r="280" fill="none" stroke="${p.neon}" stroke-width="2" opacity="0.4" filter="url(#glow)"/>
  <text x="540" y="760" text-anchor="middle" font-size="200" fill="${p.neon}" font-family="serif" filter="url(#glow)">${p.symbol}</text>
  <text x="540" y="980" text-anchor="middle" font-size="42" fill="${p.secondary}" font-family="sans-serif">${p.mantra}</text>
  <text x="540" y="1100" text-anchor="middle" font-size="36" fill="#ffffff88" font-family="sans-serif">${dayPillar}</text>
  <text x="540" y="1750" text-anchor="middle" font-size="28" fill="#ffffff44" font-family="sans-serif">8CODE · 사주 탐구</text>
</svg>`;

  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return {
    missingElement: missing,
    elementKo: chart.dayMaster.elementKo,
    primaryColor: p.primary,
    secondaryColor: p.secondary,
    neonColor: p.neon,
    symbol: p.symbol,
    mantra: p.mantra,
    dayPillar,
    svgDataUrl,
  };
}
