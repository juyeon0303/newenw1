import { activeBranches, type ManseryeokResult } from '@/lib/manseryeok';
import { detectBranchRelations } from '@/lib/manseryeok/compute/relations';
import type { EarthBranch } from '@/lib/manseryeok/constants/ganji';
import { getFlowDayPillar } from '@/lib/lifestyle/flow-pillar';

const CAI = new Set(['정재', '편재']);
const JIECAI = new Set(['겁재']);
const BIJIE = new Set(['비견', '겁재']);

export type WealthSignal = 'buy' | 'hold' | 'avoid';

export interface WealthDayEntry {
  date: string;
  pillar: string;
  stemTenStarKo: string;
  signal: WealthSignal;
  score: number;
  alert?: string;
}

export interface WealthCalendar {
  startDate: string;
  endDate: string;
  days: WealthDayEntry[];
  buyCount: number;
  avoidCount: number;
}

function natalBranches(chart: ManseryeokResult): EarthBranch[] {
  return activeBranches(chart);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function buildWealthCalendar(
  chart: ManseryeokResult,
  start = new Date(),
  dayCount = 42,
): WealthCalendar {
  const dm = chart.dayMaster.stem;
  const natal = natalBranches(chart);
  const days: WealthDayEntry[] = [];

  for (let i = 0; i < dayCount; i++) {
    const d = addDays(start, i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const flow = getFlowDayPillar(dm, y, m, day);
    const star = flow.stemTenStarKo;

    const rels = detectBranchRelations([...natal, flow.branch as EarthBranch]);
    const clash = rels.some((r) => r.type === '충' || r.type === '파');
    const he = rels.some((r) => r.type === '합');

    let score = 50;
    let signal: WealthSignal = 'hold';
    let alert: string | undefined;

    if (CAI.has(star)) {
      score += he ? 28 : 18;
    }
    if (JIECAI.has(star)) {
      score -= 35;
      alert =
        '겁재(劫財) 기운이 강합니다. 뇌동매매·레버리지 확대는 금지. 관망이 답입니다.';
    }
    if (BIJIE.has(star) && !CAI.has(star)) {
      score -= 12;
    }
    if (clash) {
      score -= 20;
      alert =
        alert ??
        '일진 충(沖)이 겹칩니다. 매매·큰 지출·손실 구간으로 잡고 보수적으로.';
    }
    if (he && CAI.has(star)) {
      alert = '재성(財) 합(合) — 매수·수금·계약 체결에 유리한 날입니다.';
    }

    score = Math.max(0, Math.min(100, score));
    if (score >= 68) signal = 'buy';
    else if (score <= 38 || JIECAI.has(star)) signal = 'avoid';

    days.push({
      date: isoDate(d),
      pillar: flow.pillar,
      stemTenStarKo: star,
      signal,
      score,
      alert,
    });
  }

  return {
    startDate: isoDate(start),
    endDate: isoDate(addDays(start, dayCount - 1)),
    days,
    buyCount: days.filter((d) => d.signal === 'buy').length,
    avoidCount: days.filter((d) => d.signal === 'avoid').length,
  };
}
