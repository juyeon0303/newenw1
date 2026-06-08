import {
  ChildLimit,
  DefaultEightCharProvider,
  EarthBranch,
  Gender,
  HeavenStem,
  HideHeavenStemType,
  LunarHour,
  LunarSect2EightCharProvider,
  SixtyCycle,
  SolarTime,
  type DecadeFortune,
} from 'tyme4ts';

import {
  BRANCH_KO,
  ELEMENT_KO,
  STEM_KO,
  TEN_STAR_KO,
  TERRAIN_KO,
  parsePillar,
  type EarthBranch as EB,
  type HeavenStem as HS,
} from './constants/ganji';
import { MONTH_COMMAND, countElements } from './compute/monthly-command';
import {
  detectBranchRelations,
  detectStemRelations,
  getVoidBranches,
  isBranchVoid,
} from './compute/relations';
import {
  computeExtraSpirits,
  computeSpirit12ForPillar,
  type SpiritContext,
} from './compute/spirits';
import { correctBirthTime, type BirthDateTime, type TimeCorrectionOptions } from './time/correction';

export type PillarSlot = 'year' | 'month' | 'day' | 'hour';

export interface ManseryeokInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  second?: number;
  gender: 'male' | 'female';
  /** 야자시 적용 — true면 23:00~23:59도 당일 일주 (Lunar sect2) */
  yajasi?: boolean;
  /** 출생 시각 미상 — 년·월·일주(삼주)만 산출, 시주·시간 의존 분석 제외 */
  unknownTime?: boolean;
  timeCorrection?: TimeCorrectionOptions;
}

export interface HiddenStemDetail {
  stem: HS;
  stemKo: string;
  tenStar: string;
  tenStarKo: string;
  weight: number;
}

export interface PillarDetail {
  slot: PillarSlot;
  slotKo: string;
  /** 시주 미산출 시 true */
  unknown?: boolean;
  pillar: string;
  stem: HS;
  branch: EB;
  stemKo: string;
  branchKo: string;
  stemTenStar: string;
  stemTenStarKo: string;
  branchTenStar: string;
  branchTenStarKo: string;
  hiddenStems: HiddenStemDetail[];
  stageBong: string;
  stageBongKo: string;
  stageGeo: string;
  stageGeoKo: string;
  naphae: string;
  voidByDay: boolean;
  voidByYear: boolean;
  spirit12: ReturnType<typeof computeSpirit12ForPillar>;
  branchRelations: ReturnType<typeof detectBranchRelations>;
}

export interface LuckPillarDetail {
  pillar: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  stemTenStarKo: string;
  stageBongKo: string;
  spirit12ByYear: ReturnType<typeof computeSpirit12ForPillar>;
  spirit12ByDay: ReturnType<typeof computeSpirit12ForPillar>;
  spirit12ByStem: ReturnType<typeof computeSpirit12ForPillar>;
}

export interface YearLuckDetail {
  year: number;
  pillar: string;
  stemTenStarKo: string;
  stageBongKo: string;
}

export interface MonthLuckDetail {
  month: number;
  pillar: string;
  stemTenStarKo: string;
  stageBongKo: string;
}

export interface ManseryeokResult {
  meta: {
    input: ManseryeokInput;
    correctedTime: BirthDateTime & {
      longitudeCorrectionMinutes: number;
      equationOfTimeMinutes: number;
      dstCorrectionMinutes: number;
      totalCorrectionMinutes: number;
    };
    lunarDate: string;
    gender: string;
    yajasi: boolean;
    /** 출생 시각을 모름 — 삼주 기준 */
    timeUnknown: boolean;
  };
  pillars: {
    year: PillarDetail;
    month: PillarDetail;
    day: PillarDetail;
    hour: PillarDetail;
  };
  dayMaster: { stem: HS; stemKo: string; element: string; elementKo: string };
  stemRelations: ReturnType<typeof detectStemRelations>;
  branchRelations: ReturnType<typeof detectBranchRelations>;
  elementCount: ReturnType<typeof countElements>;
  void: { byDay: EB[]; byYear: EB[] };
  monthCommand: { saengling: string; saenglingKo: string; dangryeong: string; dangryeongKo: string };
  extraSpirits: ReturnType<typeof computeExtraSpirits>;
  daewoon: LuckPillarDetail[];
  sewoon: YearLuckDetail[];
  wolwoon: MonthLuckDetail[];
  luckMeta: {
    /** 대운수 — 童限年数 (천을귀인 표기) */
    daewoonSu: number;
    /** 역행 여부 */
    isReverse: boolean;
    startLuckAge: number;
    startLuckDate: string;
    currentDaewoonIndex: number;
    /** 시간모름일 때 대운·세운은 정오(12:00) 기준 잠정값 */
    provisional?: boolean;
  };
}

/** 삼주만 확정된 차트인지 */
export function isTimeUnknown(input: ManseryeokInput | ManseryeokResult): boolean {
  if ('meta' in input) return input.meta.timeUnknown;
  return input.unknownTime === true;
}

/** 분석에 쓸 지지 — 시간모름이면 삼주만 */
export function activeBranches(chart: ManseryeokResult): EB[] {
  const { year, month, day, hour } = chart.pillars;
  if (chart.meta.timeUnknown || hour.unknown) {
    return [year.branch, month.branch, day.branch];
  }
  return [year.branch, month.branch, day.branch, hour.branch];
}

/** 분석에 쓸 천간 — 시간모름이면 삼주만 */
export function activeStems(chart: ManseryeokResult): HS[] {
  const { year, month, day, hour } = chart.pillars;
  if (chart.meta.timeUnknown || hour.unknown) {
    return [year.stem, month.stem, day.stem];
  }
  return [year.stem, month.stem, day.stem, hour.stem];
}

function buildUnknownHourPillar(): PillarDetail {
  return {
    slot: 'hour',
    slotKo: '시주',
    unknown: true,
    pillar: '??',
    stem: '甲',
    branch: '子',
    stemKo: '?',
    branchKo: '?',
    stemTenStar: '',
    stemTenStarKo: '',
    branchTenStar: '',
    branchTenStarKo: '',
    hiddenStems: [],
    stageBong: '',
    stageBongKo: '—',
    stageGeo: '',
    stageGeoKo: '—',
    naphae: '—',
    voidByDay: false,
    voidByYear: false,
    spirit12: [],
    branchRelations: [],
  };
}

const SLOT_KO: Record<PillarSlot, string> = {
  year: '년주', month: '월주', day: '일주', hour: '시주',
};

function koTenStar(name: string): string {
  return TEN_STAR_KO[name] ?? name;
}

function koTerrain(name: string): string {
  return TERRAIN_KO[name] ?? name;
}

function buildSpiritContext(
  pillars: Record<PillarSlot, PillarDetail>,
  timeUnknown: boolean,
): SpiritContext {
  const { year, month, day, hour } = pillars;
  const threePillars = [
    { stem: year.stem, branch: year.branch },
    { stem: month.stem, branch: month.branch },
    { stem: day.stem, branch: day.branch },
  ];
  const threeBranches: EB[] = [year.branch, month.branch, day.branch];
  const threeStems: HS[] = [year.stem, month.stem, day.stem];

  return {
    dayStem: day.stem,
    dayBranch: day.branch,
    yearBranch: year.branch,
    monthBranch: month.branch,
    hourBranch: timeUnknown ? day.branch : hour.branch,
    pillars: timeUnknown
      ? threePillars
      : [...threePillars, { stem: hour.stem, branch: hour.branch }],
    dayPillar: day.pillar,
    yearPillar: year.pillar,
    monthPillar: month.pillar,
    hourPillar: timeUnknown ? '??' : hour.pillar,
    allBranches: timeUnknown ? threeBranches : [...threeBranches, hour.branch],
    allStems: timeUnknown ? threeStems : [...threeStems, hour.stem],
  };
}

function analyzePillar(pillar: string, dayMaster: HS): Omit<PillarDetail, 'slot' | 'slotKo' | 'voidByDay' | 'voidByYear' | 'spirit12' | 'branchRelations'> {
  const { stem, branch } = parsePillar(pillar);
  const me = HeavenStem.fromName(dayMaster);
  const hs = HeavenStem.fromName(stem);
  const eb = EarthBranch.fromName(branch);

  const hiddenStems: HiddenStemDetail[] = eb.getHideHeavenStems().map((h) => {
    const hStem = h.getHeavenStem().getName() as HS;
    const ts = me.getTenStar(h.getHeavenStem()).getName();
    const weightByType: Record<HideHeavenStemType, number> = {
      [HideHeavenStemType.MAIN]: 0.6,
      [HideHeavenStemType.MIDDLE]: 0.3,
      [HideHeavenStemType.RESIDUAL]: 0.1,
    };
    return {
      stem: hStem,
      stemKo: STEM_KO[hStem],
      tenStar: ts,
      tenStarKo: koTenStar(ts),
      weight: weightByType[h.getType()],
    };
  });

  const mainHidden = eb.getHideHeavenStemMain();
  const branchTenStar = mainHidden ? me.getTenStar(mainHidden).getName() : '';

  const sound = SixtyCycle.fromName(pillar).getSound().getName();

  return {
    pillar,
    stem,
    branch,
    stemKo: STEM_KO[stem],
    branchKo: BRANCH_KO[branch],
    stemTenStar: me.getTenStar(hs).getName(),
    stemTenStarKo: koTenStar(me.getTenStar(hs).getName()),
    branchTenStar,
    branchTenStarKo: koTenStar(branchTenStar),
    hiddenStems,
    stageBong: me.getTerrain(eb).getName(),
    stageBongKo: koTerrain(me.getTerrain(eb).getName()),
    stageGeo: hs.getTerrain(eb).getName(),
    stageGeoKo: koTerrain(hs.getTerrain(eb).getName()),
    naphae: sound,
  };
}

function buildPillar(
  slot: PillarSlot,
  pillar: string,
  dayMaster: HS,
  voidByDay: EB[],
  voidByYear: EB[],
  yearBranch: EB,
  dayBranch: EB,
  allBranches: EB[],
): PillarDetail {
  const base = analyzePillar(pillar, dayMaster);
  return {
    slot,
    slotKo: SLOT_KO[slot],
    ...base,
    voidByDay: isBranchVoid(base.branch, voidByDay),
    voidByYear: isBranchVoid(base.branch, voidByYear),
    spirit12: computeSpirit12ForPillar(base.branch, yearBranch, dayBranch, dayMaster),
    branchRelations: detectBranchRelations(allBranches),
  };
}

function iterateDaewoon(
  childLimit: ChildLimit,
  dayMaster: HS,
  yearBranch: EB,
  dayBranch: EB,
  count = 10,
): LuckPillarDetail[] {
  let df: DecadeFortune = childLimit.getStartDecadeFortune();
  const result: LuckPillarDetail[] = [];
  const me = HeavenStem.fromName(dayMaster);
  const daewoonSu = childLimit.getYearCount();

  for (let i = 0; i < count; i++) {
    const sc = df.getSixtyCycle();
    const pillar = sc.getName();
    const { stem, branch } = parsePillar(pillar);
    const hs = HeavenStem.fromName(stem);
    const eb = EarthBranch.fromName(branch);
    const traditionalStart = daewoonSu + i * 10;
    result.push({
      pillar,
      startAge: traditionalStart,
      endAge: traditionalStart + 9,
      startYear: df.getStartSixtyCycleYear().getYear(),
      endYear: df.getEndSixtyCycleYear().getYear(),
      stemTenStarKo: koTenStar(me.getTenStar(hs).getName()),
      stageBongKo: koTerrain(me.getTerrain(eb).getName()),
      spirit12ByYear: computeSpirit12ForPillar(branch, yearBranch, dayBranch, dayMaster),
      spirit12ByDay: computeSpirit12ForPillar(branch, dayBranch, dayBranch, dayMaster),
      spirit12ByStem: computeSpirit12ForPillar(branch, dayBranch, dayBranch, dayMaster),
    });
    df = df.next(1);
  }
  return result;
}

export function calculateManseryeok(input: ManseryeokInput): ManseryeokResult {
  const {
    year, month, day, hour, minute = 0, second = 0,
    gender, yajasi = false, unknownTime = false, timeCorrection = {},
  } = input;

  const effectiveYajasi = unknownTime ? false : yajasi;
  const birthHour = unknownTime ? 12 : hour;
  const birthMinute = unknownTime ? 0 : minute;

  LunarHour.provider = effectiveYajasi
    ? new LunarSect2EightCharProvider()
    : new DefaultEightCharProvider();

  const corrected = correctBirthTime(
    { year, month, day, hour: birthHour, minute: birthMinute, second },
    timeCorrection,
  );

  const solarTime = SolarTime.fromYmdHms(
    corrected.year,
    corrected.month,
    corrected.day,
    corrected.hour,
    corrected.minute,
    corrected.second ?? 0,
  );

  const lunarHour = solarTime.getLunarHour();
  const eightChar = lunarHour.getEightChar();

  const yearP = eightChar.getYear().getName();
  const monthP = eightChar.getMonth().getName();
  const dayP = eightChar.getDay().getName();

  const dayMaster = eightChar.getDay().getHeavenStem().getName() as HS;
  const yearBranch = eightChar.getYear().getEarthBranch().getName() as EB;
  const dayBranch = eightChar.getDay().getEarthBranch().getName() as EB;
  const monthBranch = eightChar.getMonth().getEarthBranch().getName() as EB;

  const voidByDay = getVoidBranches(dayP);
  const voidByYear = getVoidBranches(yearP);
  const allBranches: EB[] = unknownTime
    ? [yearBranch, monthBranch, dayBranch]
    : [
        yearBranch,
        monthBranch,
        dayBranch,
        eightChar.getHour().getEarthBranch().getName() as EB,
      ];
  const allStems: HS[] = unknownTime
    ? [
        eightChar.getYear().getHeavenStem().getName() as HS,
        eightChar.getMonth().getHeavenStem().getName() as HS,
        dayMaster,
      ]
    : [
        eightChar.getYear().getHeavenStem().getName() as HS,
        eightChar.getMonth().getHeavenStem().getName() as HS,
        dayMaster,
        eightChar.getHour().getHeavenStem().getName() as HS,
      ];

  const pillars = {
    year: buildPillar('year', yearP, dayMaster, voidByDay, voidByYear, yearBranch, dayBranch, allBranches),
    month: buildPillar('month', monthP, dayMaster, voidByDay, voidByYear, yearBranch, dayBranch, allBranches),
    day: buildPillar('day', dayP, dayMaster, voidByDay, voidByYear, yearBranch, dayBranch, allBranches),
    hour: unknownTime
      ? buildUnknownHourPillar()
      : buildPillar(
          'hour',
          eightChar.getHour().getName(),
          dayMaster,
          voidByDay,
          voidByYear,
          yearBranch,
          dayBranch,
          allBranches,
        ),
  };

  const hiddenAll = Object.values(pillars).flatMap((p) => p.hiddenStems.map((h) => h.stem));
  void hiddenAll;

  const g = gender === 'male' ? Gender.MAN : Gender.WOMAN;
  const childLimit = ChildLimit.fromSolarTime(solarTime, g);
  const daewoon = iterateDaewoon(childLimit, dayMaster, yearBranch, dayBranch, 10);

  const nowYear = new Date().getFullYear();
  const currentDaewoonIndex = daewoon.findIndex(
    (d) => nowYear >= d.startYear && nowYear <= d.endYear,
  );
  const activeIdx = currentDaewoonIndex >= 0 ? currentDaewoonIndex : 0;
  const activeDaewoon = daewoon[activeIdx];

  const me = HeavenStem.fromName(dayMaster);
  const sewoon: YearLuckDetail[] = [];
  for (let y = activeDaewoon.startYear; y <= activeDaewoon.endYear; y++) {
    const st = SolarTime.fromYmdHms(y, 6, 1, 12, 0, 0);
    const yp = st.getLunarHour().getEightChar().getYear().getName();
    const { stem, branch } = parsePillar(yp);
    sewoon.push({
      year: y,
      pillar: yp,
      stemTenStarKo: koTenStar(me.getTenStar(HeavenStem.fromName(stem)).getName()),
      stageBongKo: koTerrain(me.getTerrain(EarthBranch.fromName(branch)).getName()),
    });
  }

  const wolwoon: MonthLuckDetail[] = [];
  const targetYear = activeDaewoon.startYear;
  for (let m = 1; m <= 12; m++) {
    const st = SolarTime.fromYmdHms(targetYear, m, 15, 12, 0, 0);
    const mp = st.getLunarHour().getEightChar().getMonth().getName();
    const { stem, branch } = parsePillar(mp);
    wolwoon.push({
      month: m,
      pillar: mp,
      stemTenStarKo: koTenStar(me.getTenStar(HeavenStem.fromName(stem)).getName()),
      stageBongKo: koTerrain(me.getTerrain(EarthBranch.fromName(branch)).getName()),
    });
  }

  const mc = MONTH_COMMAND[monthBranch];
  const dmElement = me.getElement().getName();

  return {
    meta: {
      input,
      correctedTime: corrected,
      lunarDate: lunarHour.toString(),
      gender: gender === 'male' ? '남' : '여',
      yajasi: effectiveYajasi,
      timeUnknown: unknownTime,
    },
    pillars,
    dayMaster: {
      stem: dayMaster,
      stemKo: STEM_KO[dayMaster],
      element: dmElement,
      elementKo: ELEMENT_KO[dmElement],
    },
    stemRelations: detectStemRelations(allStems),
    branchRelations: detectBranchRelations(allBranches),
    elementCount: countElements(allStems, allBranches),
    void: { byDay: voidByDay, byYear: voidByYear },
    monthCommand: {
      saengling: mc.saengling,
      saenglingKo: STEM_KO[mc.saengling],
      dangryeong: mc.dangryeong,
      dangryeongKo: ELEMENT_KO[mc.dangryeong],
    },
    extraSpirits: computeExtraSpirits(buildSpiritContext(pillars, unknownTime)),
    daewoon,
    sewoon,
    wolwoon,
    luckMeta: {
      daewoonSu: childLimit.getYearCount(),
      isReverse: !childLimit.isForward(),
      startLuckAge: childLimit.getYearCount(),
      startLuckDate: childLimit.getEndTime().toString(),
      currentDaewoonIndex: activeIdx,
      provisional: unknownTime,
    },
  };
}

export * from './constants/ganji';
export * from './time/correction';
export * from './compute/relations';
export * from './compute/spirits';
export * from './compute/monthly-command';
