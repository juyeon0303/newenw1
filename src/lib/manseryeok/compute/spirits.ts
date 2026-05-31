import type { EarthBranch, HeavenStem } from '../constants/ganji';
import { EARTH_BRANCHES, SANHE_GROUP } from '../constants/ganji';

export type Spirit12Name =
  | '겁살' | '재살' | '천살' | '지살' | '년살' | '월살'
  | '망신살' | '장성살' | '반안살' | '역마살' | '육해살' | '화개살';

export type Spirit12Base = '년지' | '일지' | '일간';

/** 12신살 — 삼합局 기준 (년지/일지) */
const SPIRIT12_BY_BRANCH: Record<string, Record<Spirit12Name, EarthBranch>> = {
  '申子辰': {
    겁살: '巳', 재살: '午', 천살: '未', 지살: '申', 년살: '酉', 월살: '戌',
    망신살: '亥', 장성살: '子', 반안살: '丑', 역마살: '寅', 육해살: '卯', 화개살: '辰',
  },
  '寅午戌': {
    겁살: '亥', 재살: '子', 천살: '丑', 지살: '寅', 년살: '卯', 월살: '辰',
    망신살: '巳', 장성살: '午', 반안살: '未', 역마살: '申', 육해살: '酉', 화개살: '戌',
  },
  '巳酉丑': {
    겁살: '寅', 재살: '卯', 천살: '辰', 지살: '巳', 년살: '午', 월살: '未',
    망신살: '申', 장성살: '酉', 반안살: '戌', 역마살: '亥', 육해살: '子', 화개살: '丑',
  },
  '亥卯未': {
    겁살: '申', 재살: '酉', 천살: '戌', 지살: '亥', 년살: '子', 월살: '丑',
    망신살: '寅', 장성살: '卯', 반안살: '辰', 역마살: '巳', 육해살: '午', 화개살: '未',
  },
};

/** 12신살 — 일간 기준 (건록/양인 등 대체표) */
const SPIRIT12_BY_STEM: Record<string, Record<Spirit12Name, EarthBranch>> = {
  '甲': {
    겁살: '申', 재살: '酉', 천살: '戌', 지살: '亥', 년살: '子', 월살: '丑',
    망신살: '寅', 장성살: '卯', 반안살: '辰', 역마살: '巳', 육해살: '午', 화개살: '未',
  },
  '乙': {
    겁살: '申', 재살: '酉', 천살: '戌', 지살: '亥', 년살: '子', 월살: '丑',
    망신살: '寅', 장성살: '卯', 반안살: '辰', 역마살: '巳', 육해살: '午', 화개살: '未',
  },
  '丙': {
    겁살: '亥', 재살: '子', 천살: '丑', 지살: '寅', 년살: '卯', 월살: '辰',
    망신살: '巳', 장성살: '午', 반안살: '未', 역마살: '申', 육해살: '酉', 화개살: '戌',
  },
  '丁': {
    겁살: '亥', 재살: '子', 천살: '丑', 지살: '寅', 년살: '卯', 월살: '辰',
    망신살: '巳', 장성살: '午', 반안살: '未', 역마살: '申', 육해살: '酉', 화개살: '戌',
  },
  '戊': {
    겁살: '亥', 재살: '子', 천살: '丑', 지살: '寅', 년살: '卯', 월살: '辰',
    망신살: '巳', 장성살: '午', 반안살: '未', 역마살: '申', 육해살: '酉', 화개살: '戌',
  },
  '己': {
    겁살: '巳', 재살: '午', 천살: '未', 지살: '申', 년살: '酉', 월살: '戌',
    망신살: '亥', 장성살: '子', 반안살: '丑', 역마살: '寅', 육해살: '卯', 화개살: '辰',
  },
  '庚': {
    겁살: '巳', 재살: '午', 천살: '未', 지살: '申', 년살: '酉', 월살: '戌',
    망신살: '亥', 장성살: '子', 반안살: '丑', 역마살: '寅', 육해살: '卯', 화개살: '辰',
  },
  '辛': {
    겁살: '巳', 재살: '午', 천살: '未', 지살: '申', 년살: '酉', 월살: '戌',
    망신살: '亥', 장성살: '子', 반안살: '丑', 역마살: '寅', 육해살: '卯', 화개살: '辰',
  },
  '壬': {
    겁살: '申', 재살: '酉', 천살: '戌', 지살: '亥', 년살: '子', 월살: '丑',
    망신살: '寅', 장성살: '卯', 반안살: '辰', 역마살: '巳', 육해살: '午', 화개살: '未',
  },
  '癸': {
    겁살: '申', 재살: '酉', 천살: '戌', 지살: '亥', 년살: '子', 월살: '丑',
    망신살: '寅', 장성살: '卯', 반안살: '辰', 역마살: '巳', 육해살: '午', 화개살: '未',
  },
};

function sanheKey(branch: EarthBranch): string {
  const group = SANHE_GROUP[branch];
  return group.join('');
}

export function getSpirit12Table(base: EarthBranch | HeavenStem, basis: Spirit12Base): Record<Spirit12Name, EarthBranch> {
  if (basis === '일간') {
    return SPIRIT12_BY_STEM[base as HeavenStem];
  }
  return SPIRIT12_BY_BRANCH[sanheKey(base as EarthBranch)];
}

export function findSpirit12AtBranch(
  branch: EarthBranch,
  base: EarthBranch | HeavenStem,
  basis: Spirit12Base,
): Spirit12Name[] {
  const table = getSpirit12Table(base, basis);
  return (Object.entries(table) as [Spirit12Name, EarthBranch][])
    .filter(([, b]) => b === branch)
    .map(([name]) => name);
}

export interface ExtraSpiritRule {
  name: string;
  /** 길신(true) / 흉살(false) */
  auspicious: boolean;
  check: (ctx: SpiritContext) => boolean;
}

export interface SpiritContext {
  dayStem: HeavenStem;
  dayBranch: EarthBranch;
  yearBranch: EarthBranch;
  monthBranch: EarthBranch;
  hourBranch: EarthBranch;
  pillars: { stem: HeavenStem; branch: EarthBranch }[];
  dayPillar: string;
  yearPillar: string;
  monthPillar: string;
  hourPillar: string;
  allBranches: EarthBranch[];
  allStems: HeavenStem[];
}

/** 천을귀인 — 일간 기준 */
const CHEONEUL: Record<HeavenStem, EarthBranch[]> = {
  甲: ['丑', '未'], 乙: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'],
  戊: ['丑', '未'], 己: ['子', '申'], 庚: ['丑', '未'], 辛: ['寅', '午'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
};

/** 문창귀인 — 일간 기준 */
const MOONCHANG: Record<HeavenStem, EarthBranch> = {
  甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
};

/** 태극귀인 — 일간 기준 */
const TAEGEUK: Record<HeavenStem, EarthBranch[]> = {
  甲: ['子', '午'], 乙: ['子', '午'], 丙: ['卯', '酉'], 丁: ['卯', '酉'],
  戊: ['辰', '戌', '丑', '未'], 己: ['辰', '戌', '丑', '未'],
  庚: ['寅', '亥'], 辛: ['寅', '亥'], 壬: ['巳', '申'], 癸: ['巳', '申'],
};

/** 천덕귀인 — 월지 기준 (천간·지지 혼합) */
const CHEONDEOK: Record<EarthBranch, string> = {
  寅: '丁', 卯: '申', 辰: '壬', 巳: '辛', 午: '亥', 未: '甲',
  申: '癸', 酉: '寅', 戌: '丙', 亥: '乙', 子: '巳', 丑: '庚',
};

/** 월덕귀인 — 월지 기준 */
const WOLDEOK: Record<EarthBranch, HeavenStem> = {
  寅: '丙', 卯: '甲', 辰: '壬', 巳: '庚', 午: '丙', 未: '甲',
  申: '壬', 酉: '庚', 戌: '丙', 亥: '甲', 子: '壬', 丑: '庚',
};

/** 학당귀인 — 일간 기준 */
const HAKDANG: Record<HeavenStem, EarthBranch> = {
  甲: '亥', 乙: '午', 丙: '寅', 丁: '酉', 戊: '寅', 己: '酉', 庚: '巳', 辛: '子', 壬: '申', 癸: '卯',
};

/** 천주귀인 — 일간 기준 */
const CHEONJU: Record<HeavenStem, EarthBranch> = {
  甲: '巳', 乙: '午', 丙: '巳', 丁: '午', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
};

/** 금여 — 일간 기준 */
const GEUMYEO: Record<HeavenStem, EarthBranch> = {
  甲: '辰', 乙: '巳', 丙: '未', 丁: '申', 戊: '未', 己: '申', 庚: '戌', 辛: '亥', 壬: '丑', 癸: '寅',
};

/** 도화살 — 년지/일지 삼합 */
const DOHWA: Record<string, EarthBranch> = {
  '申子辰': '酉', '寅午戌': '卯', '巳酉丑': '午', '亥卯未': '子',
};

/** 양인살 — 일간 기준 */
const YANGIN: Record<HeavenStem, EarthBranch> = {
  甲: '卯', 乙: '寅', 丙: '午', 丁: '巳', 戊: '午', 己: '巳', 庚: '酉', 辛: '申', 壬: '子', 癸: '亥',
};

/** 현침살 — 일지 기준 */
const HYEONCHIM: Record<EarthBranch, EarthBranch[]> = {
  子: ['卯'], 丑: ['午'], 寅: ['酉'], 卯: ['子'], 辰: ['卯'], 巳: ['午'],
  午: ['酉'], 未: ['子'], 申: ['卯'], 酉: ['午'], 戌: ['酉'], 亥: ['子'],
};

/** 백호살 — 특정 일주 */
const BAEKHO_DAY_PILLARS = new Set(['戊辰', '丁丑', '丙戌', '乙未', '甲辰', '癸丑', '壬戌']);

/** 괴강살 — 특정 일주 */
const GOEGANG_DAY_PILLARS = new Set(['庚戌', '庚辰', '戊戌', '壬辰']);

function hasBranch(ctx: SpiritContext, branches: EarthBranch[]): boolean {
  return ctx.allBranches.some((b) => branches.includes(b));
}

function hasStem(ctx: SpiritContext, stems: HeavenStem[]): boolean {
  return ctx.allStems.some((s) => stems.includes(s));
}

export const EXTRA_SPIRITS: ExtraSpiritRule[] = [
  {
    name: '천을귀인',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, CHEONEUL[ctx.dayStem]),
  },
  {
    name: '문창귀인',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, [MOONCHANG[ctx.dayStem]]),
  },
  {
    name: '태극귀인',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, TAEGEUK[ctx.dayStem]),
  },
  {
    name: '천덕귀인',
    auspicious: true,
    check: (ctx) => {
      const t = CHEONDEOK[ctx.monthBranch];
      return hasStem(ctx, [t as HeavenStem]) || hasBranch(ctx, [t as EarthBranch]);
    },
  },
  {
    name: '월덕귀인',
    auspicious: true,
    check: (ctx) => hasStem(ctx, [WOLDEOK[ctx.monthBranch]]),
  },
  {
    name: '학당귀인',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, [HAKDANG[ctx.dayStem]]),
  },
  {
    name: '천주귀인',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, [CHEONJU[ctx.dayStem]]),
  },
  {
    name: '금여',
    auspicious: true,
    check: (ctx) => hasBranch(ctx, [GEUMYEO[ctx.dayStem]]),
  },
  {
    name: '도화살',
    auspicious: false,
    check: (ctx) => {
      const y = DOHWA[sanheKey(ctx.yearBranch)];
      const d = DOHWA[sanheKey(ctx.dayBranch)];
      return hasBranch(ctx, [y, d].filter(Boolean) as EarthBranch[]);
    },
  },
  {
    name: '양인살',
    auspicious: false,
    check: (ctx) => hasBranch(ctx, [YANGIN[ctx.dayStem]]),
  },
  {
    name: '현침살',
    auspicious: false,
    check: (ctx) => hasBranch(ctx, HYEONCHIM[ctx.dayBranch]),
  },
  {
    name: '백호살',
    auspicious: false,
    check: (ctx) => BAEKHO_DAY_PILLARS.has(ctx.dayPillar),
  },
  {
    name: '괴강살',
    auspicious: false,
    check: (ctx) => GOEGANG_DAY_PILLARS.has(ctx.dayPillar),
  },
  {
    name: '홍염살',
    auspicious: false,
    check: (ctx) => {
      const map: Record<HeavenStem, EarthBranch> = {
        甲: '午', 乙: '午', 丙: '寅', 丁: '未', 戊: '辰', 己: '辰', 庚: '戌', 辛: '酉', 壬: '子', 癸: '申',
      };
      return hasBranch(ctx, [map[ctx.dayStem]]);
    },
  },
  {
    name: '천의성',
    auspicious: true,
    check: (ctx) => {
      const map: Record<EarthBranch, EarthBranch> = {
        寅: '丑', 卯: '寅', 辰: '卯', 巳: '辰', 午: '巳', 未: '午',
        申: '未', 酉: '申', 戌: '酉', 亥: '戌', 子: '亥', 丑: '子',
      };
      return hasBranch(ctx, [map[ctx.monthBranch]]);
    },
  },
  {
    name: '복성귀인',
    auspicious: true,
    check: (ctx) => {
      const map: Record<HeavenStem, EarthBranch> = {
        甲: '寅', 乙: '丑', 丙: '子', 丁: '酉', 戊: '申', 己: '未', 庚: '午', 辛: '巳', 壬: '辰', 癸: '卯',
      };
      return hasBranch(ctx, [map[ctx.dayStem]]);
    },
  },
  {
    name: '국인귀인',
    auspicious: true,
    check: (ctx) => {
      const map: Record<HeavenStem, EarthBranch> = {
        甲: '戌', 乙: '亥', 丙: '丑', 丁: '寅', 戊: '丑', 己: '寅', 庚: '辰', 辛: '巳', 壬: '未', 癸: '申',
      };
      return hasBranch(ctx, [map[ctx.dayStem]]);
    },
  },
  {
    name: '장성살',
    auspicious: true,
    check: (ctx) => {
      const map: Record<string, EarthBranch> = {
        '申子辰': '子', '寅午戌': '午', '巳酉丑': '酉', '亥卯未': '卯',
      };
      return hasBranch(ctx, [map[sanheKey(ctx.yearBranch)], map[sanheKey(ctx.dayBranch)]]);
    },
  },
];

export function computeExtraSpirits(ctx: SpiritContext): { name: string; auspicious: boolean }[] {
  return EXTRA_SPIRITS.filter((r) => r.check(ctx)).map(({ name, auspicious }) => ({ name, auspicious }));
}

export function computeSpirit12ForPillar(
  branch: EarthBranch,
  yearBranch: EarthBranch,
  dayBranch: EarthBranch,
  dayStem: HeavenStem,
): { basis: Spirit12Base; spirits: Spirit12Name[] }[] {
  return [
    { basis: '년지' as const, spirits: findSpirit12AtBranch(branch, yearBranch, '년지') },
    { basis: '일지' as const, spirits: findSpirit12AtBranch(branch, dayBranch, '일지') },
    { basis: '일간' as const, spirits: findSpirit12AtBranch(branch, dayStem, '일간') },
  ].filter((x) => x.spirits.length > 0);
}
