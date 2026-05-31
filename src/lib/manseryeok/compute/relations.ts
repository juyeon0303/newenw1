import type { EarthBranch, HeavenStem } from '../constants/ganji';
import { EARTH_BRANCHES, HEAVEN_STEMS } from '../constants/ganji';

export interface BranchRelation {
  type: '충' | '합' | '형' | '해' | '파' | '회' | '원진' | '귀문' | '천라' | '지망';
  branches: [EarthBranch, EarthBranch];
  label: string;
}

export interface StemRelation {
  type: '합' | '충' | '극';
  stems: [HeavenStem, HeavenStem];
  label: string;
}

const LIU_CHONG: Record<EarthBranch, EarthBranch> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

const LIU_HE: Record<EarthBranch, EarthBranch> = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
};

const LIU_HAI: Record<EarthBranch, EarthBranch> = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
};

const PO: [EarthBranch, EarthBranch][] = [
  ['子', '酉'], ['酉', '子'], ['午', '卯'], ['卯', '午'],
  ['辰', '丑'], ['丑', '辰'], ['戌', '未'], ['未', '戌'],
  ['寅', '亥'], ['亥', '寅'], ['巳', '申'], ['申', '巳'],
];

const SAN_XING: EarthBranch[][] = [
  ['寅', '巳', '申'],
  ['丑', '戌', '未'],
  ['子', '卯'],
];

const SAN_HUI: EarthBranch[][] = [
  ['寅', '卯', '辰'],
  ['巳', '午', '未'],
  ['申', '酉', '戌'],
  ['亥', '子', '丑'],
];

/** 원진(怨嗔) */
const WONJIN: [EarthBranch, EarthBranch][] = [
  ['子', '未'], ['未', '子'], ['丑', '午'], ['午', '丑'],
  ['寅', '酉'], ['酉', '寅'], ['卯', '申'], ['申', '卯'],
  ['辰', '亥'], ['亥', '辰'], ['巳', '戌'], ['戌', '巳'],
];

/** 귀문관(鬼門關) — 지지 쌍 */
const GUIMUN: [EarthBranch, EarthBranch][] = [
  ['子', '酉'], ['酉', '子'], ['丑', '午'], ['午', '丑'],
  ['寅', '未'], ['未', '寅'], ['卯', '申'], ['申', '卯'],
  ['辰', '亥'], ['亥', '辰'], ['巳', '戌'], ['戌', '巳'],
];

const STEM_HE: [HeavenStem, HeavenStem][] = [
  ['甲', '己'], ['己', '甲'], ['乙', '庚'], ['庚', '乙'],
  ['丙', '辛'], ['辛', '丙'], ['丁', '壬'], ['壬', '丁'],
  ['戊', '癸'], ['癸', '戊'],
];

/** 천간충(甲庚, 乙辛, 丙壬, 丁癸, 戊己互冲) */
const STEM_CHONG: [HeavenStem, HeavenStem][] = [
  ['甲', '庚'], ['庚', '甲'], ['乙', '辛'], ['辛', '乙'],
  ['丙', '壬'], ['壬', '丙'], ['丁', '癸'], ['癸', '丁'],
];

function uniquePairs<T>(items: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }
  return pairs;
}

function hasAll(group: EarthBranch[], branches: EarthBranch[]): boolean {
  return group.every((b) => branches.includes(b));
}

function hasPair(a: EarthBranch, b: EarthBranch, list: [EarthBranch, EarthBranch][]): boolean {
  return list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export function detectStemRelations(stems: HeavenStem[]): StemRelation[] {
  const result: StemRelation[] = [];
  const pairs = uniquePairs(stems);
  for (const [a, b] of pairs) {
    if (STEM_HE.some(([x, y]) => x === a && y === b)) {
      result.push({ type: '합', stems: [a, b], label: `${a}${b}합` });
    }
    if (STEM_CHONG.some(([x, y]) => x === a && y === b)) {
      result.push({ type: '충', stems: [a, b], label: `${a}${b}충` });
    }
  }
  return result;
}

export function detectBranchRelations(branches: EarthBranch[]): BranchRelation[] {
  const result: BranchRelation[] = [];
  const pairs = uniquePairs(branches);

  for (const [a, b] of pairs) {
    if (LIU_CHONG[a] === b) result.push({ type: '충', branches: [a, b], label: `${a}${b}충` });
    if (LIU_HE[a] === b) result.push({ type: '합', branches: [a, b], label: `${a}${b}합` });
    if (LIU_HAI[a] === b) result.push({ type: '해', branches: [a, b], label: `${a}${b}해` });
    if (hasPair(a, b, PO)) result.push({ type: '파', branches: [a, b], label: `${a}${b}파` });
    if (hasPair(a, b, WONJIN)) result.push({ type: '원진', branches: [a, b], label: `${a}${b}원진` });
    if (hasPair(a, b, GUIMUN)) result.push({ type: '귀문', branches: [a, b], label: `${a}${b}귀문` });
  }

  for (const group of SAN_XING) {
    const present = group.filter((b) => branches.includes(b));
    if (present.length >= 2) {
      for (let i = 0; i < present.length; i++) {
        for (let j = i + 1; j < present.length; j++) {
          result.push({ type: '형', branches: [present[i], present[j]], label: `${present[i]}${present[j]}형` });
        }
      }
    }
  }

  for (const group of SAN_HUI) {
    if (hasAll(group, branches)) {
      result.push({ type: '회', branches: [group[0], group[2]], label: `${group.join('')}회` });
    }
  }

  // 천라(戌亥) / 지망(辰巳)
  if (branches.includes('戌') && branches.includes('亥')) {
    result.push({ type: '천라', branches: ['戌', '亥'], label: '천라' });
  }
  if (branches.includes('辰') && branches.includes('巳')) {
    result.push({ type: '지망', branches: ['辰', '巳'], label: '지망' });
  }

  return result;
}

export function getVoidBranches(dayPillar: string): EarthBranch[] {
  const stemIdx = HEAVEN_STEMS.indexOf(dayPillar[0] as HeavenStem);
  const branchIdx = EARTH_BRANCHES.indexOf(dayPillar[1] as EarthBranch);
  const xunStart = branchIdx - stemIdx;
  const void1 = EARTH_BRANCHES[(xunStart + 10) % 12];
  const void2 = EARTH_BRANCHES[(xunStart + 11) % 12];
  return [void1, void2];
}

export function isBranchVoid(branch: EarthBranch, voidBranches: EarthBranch[]): boolean {
  return voidBranches.includes(branch);
}
