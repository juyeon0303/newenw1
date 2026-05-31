import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '../index';
import { correctBirthTime, CHEONEUL_STANDARD_MERIDIAN } from '../time/correction';

describe('time correction (천을귀인 127.5° 기준)', () => {
  it('서울(127°) 경도 보정은 약 -2분', () => {
    const r = correctBirthTime(
      { year: 1990, month: 5, day: 15, hour: 14, minute: 0 },
      { longitude: 127, applyEquationOfTime: false, applyDst: false },
    );
    expect(r.longitudeCorrectionMinutes).toBeCloseTo((127 - CHEONEUL_STANDARD_MERIDIAN) * 4, 1);
  });

  it('1988 썸머타임 역보정 -60분', () => {
    const r = correctBirthTime(
      { year: 1988, month: 7, day: 1, hour: 14, minute: 0 },
      { longitude: 127, applyEquationOfTime: false, applyDst: true },
    );
    expect(r.dstCorrectionMinutes).toBe(-60);
  });
});

describe('calculateManseryeok', () => {
  it('사주팔자 4기둥을 반환한다', () => {
    const chart = calculateManseryeok({
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      gender: 'male',
      timeCorrection: { applyEquationOfTime: false, applyDst: false },
    });

    expect(chart.pillars.year.pillar).toMatch(/^[\u4e00-\u9fff]{2}$/);
    expect(chart.pillars.month.pillar).toMatch(/^[\u4e00-\u9fff]{2}$/);
    expect(chart.pillars.day.pillar).toMatch(/^[\u4e00-\u9fff]{2}$/);
    expect(chart.pillars.hour.pillar).toMatch(/^[\u4e00-\u9fff]{2}$/);
  });

  it('십성·지장간·12운성(봉/거)·납음·공망을 포함한다', () => {
    const chart = calculateManseryeok({
      year: 1984,
      month: 2,
      day: 2,
      hour: 2,
      gender: 'female',
      timeCorrection: { applyEquationOfTime: false, applyDst: false },
    });

    const day = chart.pillars.day;
    expect(day.stemTenStarKo).toBeTruthy();
    expect(day.hiddenStems.length).toBeGreaterThan(0);
    expect(day.stageBongKo).toBeTruthy();
    expect(day.stageGeoKo).toBeTruthy();
    expect(day.naphae).toBeTruthy();
    expect(chart.void.byDay.length).toBe(2);
    expect(chart.void.byYear.length).toBe(2);
  });

  it('대운·세운·월운을 포함한다', () => {
    const chart = calculateManseryeok({
      year: 1990,
      month: 3,
      day: 24,
      hour: 10,
      minute: 28,
      gender: 'male',
      timeCorrection: { applyEquationOfTime: false, applyDst: false },
    });

    expect(chart.daewoon.length).toBe(10);
    expect(chart.sewoon.length).toBeGreaterThan(0);
    expect(chart.wolwoon.length).toBe(12);
  });

  it('기타 신살과 12신살을 포함한다', () => {
    const chart = calculateManseryeok({
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      gender: 'male',
      timeCorrection: { applyEquationOfTime: false, applyDst: false },
    });

    expect(Array.isArray(chart.extraSpirits)).toBe(true);
    expect(chart.pillars.year.spirit12).toBeDefined();
  });
});
