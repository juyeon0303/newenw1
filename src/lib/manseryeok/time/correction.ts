/**
 * 만세력 천을귀인 시간 보정
 * - 동경 127.5° 기준 경도 보정 (앱 명시)
 * - 한국 썸머타임(DST) 역보정
 * - 균시차(Equation of Time) — 천문 정밀도
 */

/** 천을귀인 앱 기준 자오선 (동경 127.5°) */
export const CHEONEUL_STANDARD_MERIDIAN = 127.5;

/** 기본 출생지 — 서울 (동경) */
export const SEOUL_LONGITUDE = 126.978;

/** KST 표준 자오선 (동경 135°) — 시계가 기준으로 하는 경도 */
export const KST_STANDARD_MERIDIAN = 135;

export interface BirthDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
}

export interface TimeCorrectionOptions {
  /** 출생지 경도 (동경). 미지정 시 서울 */
  longitude?: number;
  /** 균시차 적용 여부. 기본 true */
  applyEquationOfTime?: boolean;
  /** 썸머타임 역보정. 기본 true */
  applyDst?: boolean;
}

export interface CorrectedTimeResult extends BirthDateTime {
  /** 보정 전(입력) 시각 */
  input: BirthDateTime;
  /** 경도 보정 분 */
  longitudeCorrectionMinutes: number;
  /** 균시차 보정 분 */
  equationOfTimeMinutes: number;
  /** DST 역보정 분 */
  dstCorrectionMinutes: number;
  /** 총 보정 분 */
  totalCorrectionMinutes: number;
}

/** 한국 역사적 썸머타임 구간 (KST → 실제 표준시로 역보정 시 -60분) */
const KOREA_DST_PERIODS: Array<{ start: string; end: string }> = [
  { start: '1948-06-01', end: '1948-09-13' },
  { start: '1949-04-03', end: '1949-09-11' },
  { start: '1950-04-01', end: '1950-09-10' },
  { start: '1951-05-06', end: '1951-09-09' },
  { start: '1955-05-05', end: '1955-09-09' },
  { start: '1956-05-20', end: '1956-09-30' },
  { start: '1957-05-05', end: '1957-09-22' },
  { start: '1958-05-04', end: '1958-09-21' },
  { start: '1959-05-03', end: '1959-09-19' },
  { start: '1960-05-01', end: '1960-09-18' },
  { start: '1987-05-10', end: '1987-10-11' },
  { start: '1988-05-08', end: '1988-10-09' },
];

function toDateKey(d: BirthDateTime): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.year}-${pad(d.month)}-${pad(d.day)}`;
}

function isInKoreaDst(d: BirthDateTime): boolean {
  const key = toDateKey(d);
  return KOREA_DST_PERIODS.some(({ start, end }) => key >= start && key <= end);
}

/**
 * 균시차 (분) — Meeus 간략식
 * @see Astronomical Algorithms, Jean Meeus
 */
export function equationOfTimeMinutes(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const n = jdn - 2451545.0;
  const g = (357.529 + 0.98560028 * n) % 360;
  const gr = (g * Math.PI) / 180;
  const l = (280.459 + 0.98564736 * n) % 360;
  const lr = (l * Math.PI) / 180;
  const e = 1.915 * Math.sin(gr) + 0.02 * Math.sin(2 * gr);
  const lambda = lr + ((e * Math.PI) / 180);
  const alpha =
    Math.atan2(Math.cos(0.4091) * Math.sin(lambda), Math.cos(lambda)) *
    (180 / Math.PI);
  const alphaNorm = ((alpha % 360) + 360) % 360;
  const lNorm = ((l % 360) + 360) % 360;
  let eot = alphaNorm - lNorm;
  if (eot > 180) eot -= 360;
  if (eot < -180) eot += 360;
  return eot * 4; // degrees → minutes (1° = 4min)
}

function addMinutesToDateTime(dt: BirthDateTime, minutes: number): BirthDateTime {
  const date = new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second ?? 0));
  date.setUTCMinutes(date.getUTCMinutes() + Math.round(minutes));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  };
}

/**
 * 천을귀인 방식 진태양시 보정
 *
 * corrected = KST + (경도 - 127.5) × 4분 + 균시차 - DST(1시간)
 */
export function correctBirthTime(
  input: BirthDateTime,
  options: TimeCorrectionOptions = {},
): CorrectedTimeResult {
  const {
    longitude = SEOUL_LONGITUDE,
    applyEquationOfTime = true,
    applyDst = true,
  } = options;

  const longitudeCorrection = (longitude - CHEONEUL_STANDARD_MERIDIAN) * 4;
  const eot = applyEquationOfTime
    ? equationOfTimeMinutes(input.year, input.month, input.day)
    : 0;
  const dst = applyDst && isInKoreaDst(input) ? -60 : 0;
  const total = longitudeCorrection + eot + dst;

  const corrected = addMinutesToDateTime(input, total);

  return {
    ...corrected,
    input,
    longitudeCorrectionMinutes: longitudeCorrection,
    equationOfTimeMinutes: eot,
    dstCorrectionMinutes: dst,
    totalCorrectionMinutes: total,
  };
}
