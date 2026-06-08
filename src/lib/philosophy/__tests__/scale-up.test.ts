import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import { buildSynergyReport } from '@/lib/philosophy/synergy';
import { buildDailyGuide } from '@/lib/philosophy/daily-guide';
import { TEN_STAR_KEYS, tenStarLabel } from '@/lib/i18n/ten-star-labels';
import { defaultTimeCorrection } from '@/components/BirthForm';
import { encodeChartParam, parseChartParam } from '@/lib/session/chart-share';

const sampleA = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 'male' as const,
};

const sampleB = {
  year: 1995,
  month: 8,
  day: 3,
  hour: 9,
  minute: 0,
  gender: 'female' as const,
};

describe('buildSynergyReport', () => {
  it('두 팔자의 오행·관계 시너지를 반환한다', () => {
    const a = calculateManseryeok(sampleA);
    const b = calculateManseryeok(sampleB);
    const report = buildSynergyReport(a, b, 'ko');
    expect(report.elementComplements).toHaveLength(5);
    expect(report.synergyScore).toBeGreaterThanOrEqual(0);
    expect(report.synergyScore).toBeLessThanOrEqual(100);
    expect(report.crossBranchRelations.length).toBeGreaterThan(0);
  });
});

describe('buildDailyGuide', () => {
  it('오늘 일진과 액션 플랜을 만든다', () => {
    const chart = calculateManseryeok(sampleA);
    const guide = buildDailyGuide(chart, new Date(2026, 4, 31), 'ko');
    expect(guide.todayPillar).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    expect(guide.biorhythm).toHaveLength(5);
    expect(guide.actions.length).toBeGreaterThan(0);
  });
});

describe('ten-star i18n', () => {
  it('10개 십성 모두 en/ja 라벨이 있다', () => {
    expect(TEN_STAR_KEYS).toHaveLength(10);
    for (const key of TEN_STAR_KEYS) {
      expect(tenStarLabel(key, 'en').psychology.length).toBeGreaterThan(2);
      expect(tenStarLabel(key, 'ja').label.length).toBeGreaterThan(0);
    }
  });
});

describe('chart-share', () => {
  it('URL 인코딩·디코딩이 대칭이다', () => {
    const raw = encodeChartParam({ ...sampleA, yajasi: true, timeCorrection: defaultTimeCorrection() });
    const parsed = parseChartParam(raw);
    expect(parsed?.year).toBe(1990);
    expect(parsed?.yajasi).toBe(true);
    expect(parsed?.timeCorrection?.longitude).toBe(defaultTimeCorrection().longitude);
  });

  it('시간모름 URL 플래그를 복원한다', () => {
    const raw = encodeChartParam({
      ...sampleA,
      hour: 0,
      minute: 0,
      unknownTime: true,
      timeCorrection: defaultTimeCorrection(),
    });
    expect(raw).toContain('-u1');
    const parsed = parseChartParam(raw);
    expect(parsed?.unknownTime).toBe(true);
  });
});
