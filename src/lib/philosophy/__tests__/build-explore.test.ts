import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import {
  buildExploreBundle,
  sortedRelationKeys,
  sortedTenStarKeys,
} from '@/lib/philosophy/build-explore';

const KIM = {
  year: 2003,
  month: 12,
  day: 23,
  hour: 12,
  minute: 16,
  gender: 'male' as const,
  yajasi: false,
  timeCorrection: { applyEquationOfTime: false, applyDst: false, longitude: 126.978 },
};

describe('buildExploreBundle', () => {
  it('김성모 팔자에서 십성·신살·형충 질문을 생성한다', () => {
    const chart = calculateManseryeok(KIM);
    const bundle = buildExploreBundle(chart);

    expect(bundle.tenStarByName.has('상관')).toBe(true);
    expect(bundle.tenStarByName.has('정관')).toBe(true);
    expect(bundle.tenStarByName.get('상관')!.questions.length).toBeGreaterThan(3);
    expect(bundle.spiritByName.has('천을귀인')).toBe(true);
    expect(bundle.spiritByName.has('장성살')).toBe(true);

    const sanggwan = bundle.tenStarByName.get('상관')!;
    expect(sanggwan.questions.some((q) => q.text.includes('학교'))).toBe(true);
    expect(sanggwan.questions.every((q) => !q.text.includes('년주'))).toBe(true);

    // 정재는 지장간에만 — 겉 십성 목록에는 없음
    expect(bundle.tenStarByName.has('정재')).toBe(false);
    expect(bundle.hiddenTenStarByName.has('정재')).toBe(true);

    // 자오충·갑경충
    expect(sortedRelationKeys(bundle).length).toBeGreaterThan(0);
    const relationLabels = [...bundle.relationByKey.values()].map((e) => e.hits[0].displayLabel);
    expect(relationLabels.some((l) => l.includes('자오충'))).toBe(true);
    expect(relationLabels.some((l) => l.includes('갑경충'))).toBe(true);

    // 충이 십성보다 우선순위 상위
    const top = bundle.overview[0];
    expect(top.category).toBe('relation');
    expect(top.label).toMatch(/충/);

    // 십성 칩은 중요도 순
    expect(sortedTenStarKeys(bundle)[0]).toBeTruthy();
  });
});
