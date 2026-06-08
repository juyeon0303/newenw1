import { birthValuesToInput, type BirthFormValues } from '@/components/BirthForm';
import type { ManseryeokInput } from '@/lib/manseryeok';

function inputToBirthValues(input: ManseryeokInput): BirthFormValues {
  return {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute ?? 0,
    gender: input.gender,
    yajasi: input.yajasi ?? false,
    unknownTime: input.unknownTime ?? false,
  };
}

/** URL용 차트 인코딩 (시간보정은 서울 고정) */
export function encodeChartParam(input: ManseryeokInput): string {
  const g = input.gender === 'female' ? 'f' : 'm';
  const y = input.yajasi ? '-y1' : '';
  const u = input.unknownTime ? '-u1' : '';
  if (input.unknownTime) {
    return `${input.year}-${input.month}-${input.day}-0-0-${g}${u}`;
  }
  return `${input.year}-${input.month}-${input.day}-${input.hour}-${input.minute ?? 0}-${g}${y}${u}`;
}

export function parseChartParam(raw: string | null): ManseryeokInput | null {
  if (!raw) return null;
  const unknownTime = raw.includes('-u1');
  const m = raw.match(
    /^(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-([mf])(?:-y1)?(?:-u1)?(?:-l[\d.]+)?$/,
  );
  if (!m) return null;
  const [, ys, ms, ds, hs, mins, g] = m;
  return birthValuesToInput({
    year: Number(ys),
    month: Number(ms),
    day: Number(ds),
    hour: Number(hs),
    minute: Number(mins),
    gender: g === 'f' ? 'female' : 'male',
    yajasi: raw.includes('-y1'),
    unknownTime,
  });
}

export function buildSynergyShareUrl(
  a: ManseryeokInput,
  b: ManseryeokInput,
  origin = '',
): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/explore?tab=synergy&a=${encodeURIComponent(encodeChartParam(a))}&b=${encodeURIComponent(encodeChartParam(b))}`;
}

export { inputToBirthValues };
