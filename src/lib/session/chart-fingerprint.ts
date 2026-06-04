import type { ManseryeokInput } from '@/lib/manseryeok';

/** 동일 생년월일시 = 동일 탐구 저장소 */
export function chartFingerprint(input: ManseryeokInput): string {
  const m = input.minute ?? 0;
  const lon = input.timeCorrection?.longitude ?? 127;
  return [
    input.year,
    input.month,
    input.day,
    input.hour,
    m,
    input.gender,
    input.yajasi ? 1 : 0,
    lon.toFixed(2),
  ].join(':');
}

export function chartLabel(input: ManseryeokInput): string {
  const m = String(input.minute ?? 0).padStart(2, '0');
  return `${input.year}.${input.month}.${input.day} ${input.hour}:${m}`;
}
