import type { ManseryeokInput } from '@/lib/manseryeok';

/** URL용 차트 인코딩: YYYY-M-D-H-m-g */
export function encodeChartParam(input: ManseryeokInput): string {
  const g = input.gender === 'female' ? 'f' : 'm';
  const y = input.yajasi ? '-y1' : '';
  const lon = input.timeCorrection?.longitude
    ? `-l${input.timeCorrection.longitude}`
    : '';
  return `${input.year}-${input.month}-${input.day}-${input.hour}-${input.minute ?? 0}-${g}${y}${lon}`;
}

export function parseChartParam(raw: string | null): ManseryeokInput | null {
  if (!raw) return null;
  const m = raw.match(
    /^(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-([mf])(?:-y1)?(?:-l([\d.]+))?$/,
  );
  if (!m) return null;
  const [, ys, ms, ds, hs, mins, g, lon] = m;
  return {
    year: Number(ys),
    month: Number(ms),
    day: Number(ds),
    hour: Number(hs),
    minute: Number(mins),
    gender: g === 'f' ? 'female' : 'male',
    yajasi: raw.includes('-y1'),
    timeCorrection: lon ? { longitude: Number(lon) } : undefined,
  };
}

export function buildSynergyShareUrl(
  a: ManseryeokInput,
  b: ManseryeokInput,
  origin = '',
): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/synergy?a=${encodeURIComponent(encodeChartParam(a))}&b=${encodeURIComponent(encodeChartParam(b))}`;
}
