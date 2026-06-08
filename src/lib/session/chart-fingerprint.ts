import type { ManseryeokInput } from '@/lib/manseryeok';

/** 동일 생년월일시 = 동일 탐구 저장소 */
export function chartFingerprint(input: ManseryeokInput): string {
  const m = input.minute ?? 0;
  return [
    input.year,
    input.month,
    input.day,
    input.unknownTime ? 'u' : input.hour,
    input.unknownTime ? 0 : m,
    input.gender,
    input.yajasi ? 1 : 0,
  ].join(':');
}

export function chartLabel(input: ManseryeokInput): string {
  if (input.unknownTime) {
    return `${input.year}.${input.month}.${input.day} (시간모름)`;
  }
  const m = String(input.minute ?? 0).padStart(2, '0');
  return `${input.year}.${input.month}.${input.day} ${input.hour}:${m}`;
}
