import type { EarthBranch, HeavenStem } from '../constants/ganji';
import { BRANCH_ELEMENT, STEM_ELEMENT } from '../constants/ganji';

/** 월령 — 절기 월지별 당령(本气) 오행 */
export const MONTH_COMMAND: Record<EarthBranch, { saengling: HeavenStem; dangryeong: string }> = {
  寅: { saengling: '甲', dangryeong: '木' },
  卯: { saengling: '乙', dangryeong: '木' },
  辰: { saengling: '戊', dangryeong: '土' },
  巳: { saengling: '丙', dangryeong: '火' },
  午: { saengling: '丁', dangryeong: '火' },
  未: { saengling: '己', dangryeong: '土' },
  申: { saengling: '庚', dangryeong: '金' },
  酉: { saengling: '辛', dangryeong: '金' },
  戌: { saengling: '戊', dangryeong: '土' },
  亥: { saengling: '壬', dangryeong: '水' },
  子: { saengling: '癸', dangryeong: '水' },
  丑: { saengling: '己', dangryeong: '土' },
};

export interface ElementCount {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

export function countElements(
  stems: HeavenStem[],
  branches: EarthBranch[],
): ElementCount {
  const count: ElementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const s of stems) {
    count[STEM_ELEMENT[s] as keyof ElementCount]++;
  }
  for (const b of branches) {
    count[BRANCH_ELEMENT[b] as keyof ElementCount]++;
  }
  return count;
}
