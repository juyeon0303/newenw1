import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import { buildCareerMonthlyChart } from '@/lib/lifestyle/career-monthly';
import { buildWealthCalendar } from '@/lib/lifestyle/wealth-calendar';
import { buildTalisman } from '@/lib/lifestyle/talisman';

const sample = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 'male' as const,
};

describe('lifestyle engines', () => {
  const chart = calculateManseryeok(sample);

  it('buildCareerMonthlyChart — 12개월', () => {
    const data = buildCareerMonthlyChart(chart, 2026);
    expect(data.months).toHaveLength(12);
    expect(data.peakMonth).toBeGreaterThanOrEqual(1);
    expect(data.peakMonth).toBeLessThanOrEqual(12);
    expect(data.months[0].actionItem.length).toBeGreaterThan(5);
  });

  it('buildWealthCalendar — 신호 분류', () => {
    const data = buildWealthCalendar(chart, new Date(2026, 0, 1), 14);
    expect(data.days.length).toBe(14);
    expect(['buy', 'hold', 'avoid']).toContain(data.days[0].signal);
  });

  it('buildTalisman — SVG URL', () => {
    const t = buildTalisman(chart);
    expect(t.svgDataUrl).toMatch(/^data:image\/svg\+xml/);
    expect(t.mantra.length).toBeGreaterThan(2);
  });
});
