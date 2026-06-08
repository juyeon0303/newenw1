import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import { buildFreePrincipleReport } from '@/lib/analysis/free-report';

const KIM = {
  year: 2003,
  month: 12,
  day: 23,
  hour: 12,
  minute: 16,
  gender: 'male' as const,
  yajasi: false,
  timeCorrection: { longitude: 127, applyEquationOfTime: true, applyDst: true },
};

describe('buildFreePrincipleReport', () => {
  it('격국·용신·십성 요약을 반환한다', () => {
    const chart = calculateManseryeok(KIM);
    const report = buildFreePrincipleReport(chart);

    expect(report.gyeokguk.name).toMatch(/격|미정/);
    expect(report.gyeokguk.basis).not.toMatch(/월주 천간 십성이 .+이므로, 전통 명리에서 흔히 쓰는 월간 격명/);
    expect(report.yongsin.candidates.length).toBeGreaterThan(0);
    expect(report.tenStarSummary.length).toBeGreaterThan(0);
    expect(report.transparencyNote.length).toBeGreaterThan(10);
  });
});
