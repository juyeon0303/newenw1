import { describe, it, expect } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import { buildInterpretationProfile } from '@/lib/interpretation/engine';
import { INTERPRETATION_POLICY } from '@/lib/interpretation/policy';

const sample = calculateManseryeok({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male',
});

describe('buildInterpretationProfile', () => {
  it('철학 정책과 우선순위 인사이트를 반환한다', () => {
    const profile = buildInterpretationProfile(sample);
    expect(profile.policy.rules.noFearMarketing).toBe(true);
    expect(profile.policy.rules.exposeScoring).toBe(true);
    expect(profile.insights.length).toBeLessThanOrEqual(INTERPRETATION_POLICY.topInsightCount);
    expect(profile.insights.length).toBeGreaterThan(0);
    expect(profile.principle.gyeokguk.name).toBeTruthy();
    expect(profile.monthCommandNote.paragraphs.length).toBeGreaterThan(0);
  });

  it('인사이트에 탐구 질문 또는 고전 해설이 붙는다', () => {
    const profile = buildInterpretationProfile(sample);
    const withContent = profile.insights.filter(
      (i) => i.questions.length > 0 || i.commentary !== null,
    );
    expect(withContent.length).toBeGreaterThan(0);
  });
});
