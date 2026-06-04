import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import { buildExploreBundle } from '@/lib/philosophy/build-explore';
import {
  PRIORITY_CRITERIA,
  scoreRelation,
  scoreSpirit,
  scoreTenStar,
  scoreToTier,
} from '@/lib/philosophy/priority';

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

describe('PRIORITY_CRITERIA', () => {
  it('문서화된 임계값과 scoreToTier가 일치한다', () => {
    expect(scoreToTier(130)).toBe('core');
    expect(scoreToTier(129)).toBe('important');
    expect(scoreToTier(90)).toBe('important');
    expect(scoreToTier(89)).toBe('reference');
    expect(PRIORITY_CRITERIA.tiers.core.label).toBe('핵심');
  });
});

describe('scoreTenStar', () => {
  it('일주 천간·지지는 핵심, 지장간은 참고 고정', () => {
    expect(scoreTenStar('day', 'stem').tier).toBe('core');
    expect(scoreTenStar('day', 'branch').tier).toBe('core');
    expect(scoreTenStar('day', 'hidden').tier).toBe('reference');
    expect(scoreTenStar('year', 'hidden').tier).toBe('reference');
  });

  it('년주 천간만이면 참고(총점 57)', () => {
    const pr = scoreTenStar('year', 'stem');
    expect(pr.score).toBe(57);
    expect(pr.tier).toBe('reference');
  });
});

describe('scoreRelation', () => {
  it('일주 충·형은 점수와 무관하게 핵심', () => {
    expect(scoreRelation('충', 'branch', ['day', 'hour']).tier).toBe('core');
    expect(scoreRelation('형', 'branch', ['month', 'day']).tier).toBe('core');
  });

  it('천간충은 천간합보다 높은 점수', () => {
    const chong = scoreRelation('충', 'stem', ['month', 'day']);
    const hap = scoreRelation('합', 'stem', ['month', 'day']);
    expect(chong.score).toBeGreaterThan(hap.score);
  });

  it('년주만 합이면 참고', () => {
    expect(scoreRelation('합', 'branch', ['year']).tier).toBe('reference');
  });
});

describe('scoreSpirit', () => {
  it('일지·일간 기준은 상향, 년지는 참고', () => {
    expect(scoreSpirit('귀인', '일지').tier).toBe('core');
    expect(scoreSpirit('12신살', '년지').tier).toBe('reference');
  });
});

describe('김성모 팔자 통합', () => {
  const bundle = buildExploreBundle(calculateManseryeok(KIM));

  it('자오충·갑경충은 핵심', () => {
    for (const entry of bundle.relationByKey.values()) {
      const label = entry.hits[0].displayLabel;
      if (label.includes('자오충') || label.includes('갑경충')) {
        expect(entry.tier).toBe('core');
      }
    }
  });

  it('지장간 정재만 참고', () => {
    const jeongjae = bundle.hiddenTenStarByName.get('정재');
    expect(jeongjae).toBeDefined();
    expect(jeongjae!.tier).toBe('reference');
    expect(bundle.tenStarByName.has('정재')).toBe(false);
  });

  it('일주 지지 정관은 핵심', () => {
    expect(bundle.tenStarByName.get('정관')?.tier).toBe('core');
  });

  it('overview 최상위는 형충', () => {
    expect(bundle.overview[0].category).toBe('relation');
    expect(bundle.overview[0].tier).toBe('core');
  });
});
