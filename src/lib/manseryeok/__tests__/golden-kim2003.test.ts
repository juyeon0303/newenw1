import { describe, it, expect } from 'vitest';
import { calculateManseryeok } from '../index';

/** 만세력 천을귀인 — 김성모 2003-12-23 12:16 서울, 야자시 미적용 */
const INPUT = {
  year: 2003,
  month: 12,
  day: 23,
  hour: 12,
  minute: 16,
  gender: 'male' as const,
  yajasi: false,
  timeCorrection: { applyEquationOfTime: false, applyDst: false, longitude: 126.978 },
};

describe('golden: 김성모 2003-12-23 12:16', () => {
  const chart = calculateManseryeok(INPUT);
  const { year, month, day, hour } = chart.pillars;

  it('사주팔자 4기둥', () => {
    expect(year.pillar).toBe('癸未');
    expect(month.pillar).toBe('甲子');
    expect(day.pillar).toBe('庚午');
    expect(hour.pillar).toBe('壬午');
  });

  it('천간 십성', () => {
    expect(year.stemTenStarKo).toBe('상관');
    expect(month.stemTenStarKo).toBe('편재');
    expect(day.stemTenStarKo).toBe('비견'); // 일간 — tyme returns 比肩
    expect(hour.stemTenStarKo).toBe('식신');
  });

  it('지지 십성 (본기)', () => {
    expect(year.branchTenStarKo).toBe('정인');
    expect(month.branchTenStarKo).toBe('상관');
    expect(day.branchTenStarKo).toBe('정관');
    expect(hour.branchTenStarKo).toBe('정관');
  });

  it('12운성 봉법', () => {
    expect(year.stageBongKo).toBe('관대');
    expect(month.stageBongKo).toBe('사');
    expect(day.stageBongKo).toBe('목욕');
    expect(hour.stageBongKo).toBe('목욕');
  });

  it('12운성 거법', () => {
    expect(year.stageGeoKo).toBe('묘');
    expect(month.stageGeoKo).toBe('목욕');
    expect(day.stageGeoKo).toBe('목욕');
    expect(hour.stageGeoKo).toBe('태');
  });

  it('납음오행', () => {
    expect(year.naphae).toBe('杨柳木'); // 앱: 양류목
    expect(month.naphae).toBe('海中金'); // 앱: 해중금
    expect(day.naphae).toBe('路旁土'); // 앱: 노방토
    expect(hour.naphae).toBe('杨柳木');
  });

  it('공망', () => {
    expect(chart.void.byYear.join('')).toBe('申酉');
    expect(chart.void.byDay.join('')).toBe('戌亥');
  });

  it('오행 개수', () => {
    expect(chart.elementCount).toEqual({ 木: 1, 火: 2, 土: 1, 金: 1, 水: 3 });
  });

  it('월령', () => {
    expect(chart.monthCommand.saengling).toBe('癸');
  });

  it('대운수 5 역행', () => {
    expect(chart.luckMeta.daewoonSu).toBe(5);
    expect(chart.luckMeta.isReverse).toBe(true);
    expect(chart.daewoon[0].pillar).toBe('癸亥');
    expect(chart.daewoon[0].startAge).toBe(5);
  });

  it('대운 15세 壬戌', () => {
    const d15 = chart.daewoon.find((d) => d.startAge === 15);
    expect(d15?.pillar).toBe('壬戌');
    expect(d15?.stemTenStarKo).toBe('식신');
    expect(d15?.stageBongKo).toBe('쇠');
  });

  it('2026 세운 丙午', () => {
    const y2026 = chart.sewoon.find((s) => s.year === 2026);
    expect(y2026?.pillar).toBe('丙午');
    expect(y2026?.stemTenStarKo).toBe('편관');
    expect(y2026?.stageBongKo).toBe('목욕');
  });

  it('천을귀인 丑未', () => {
    const names = chart.extraSpirits.map((s) => s.name);
    expect(names).toContain('천을귀인');
  });

  it('debug full output', () => {
    console.log('hidden year', year.hiddenStems.map((h) => `${h.stemKo}(${h.tenStarKo})`));
    console.log('hidden month', month.hiddenStems.map((h) => `${h.stemKo}(${h.tenStarKo})`));
    console.log('extraSpirits', chart.extraSpirits.map((s) => s.name));
    console.log('spirit12 year', year.spirit12);
    console.log('spirit12 month', month.spirit12);
    console.log('spirit12 day', day.spirit12);
    console.log('spirit12 hour', hour.spirit12);
    console.log('branchRelations', chart.branchRelations.map((r) => r.label));
    console.log('daewoon pillars', chart.daewoon.map((d) => `${d.startAge}:${d.pillar}`));
  });
});
