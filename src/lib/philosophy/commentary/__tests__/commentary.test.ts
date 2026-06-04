import { describe, expect, it } from 'vitest';
import { getRelationCommentary, getTenStarCommentary, getSpiritCommentary } from '@/lib/philosophy/commentary';

describe('commentary', () => {
  it('십성 해설에 출처와 비단정 톤이 있다', () => {
    const note = getTenStarCommentary('정재');
    expect(note).not.toBeNull();
    expect(note!.paragraphs.length).toBeGreaterThan(0);
    expect(note!.sources.length).toBeGreaterThan(0);
    expect(note!.sources[0].titleHanja).toBeTruthy();
    const allText = [
      ...note!.paragraphs.map((p) => p.text),
      note!.reflection ?? '',
    ].join(' ');
    expect(allText).toMatch(/끝내|단정|뜻하지|본다/);
  });

  it('충 해설과 천간충·쌍별 보충이 있다', () => {
    const branch = getRelationCommentary('충', 'branch')!;
    const stem = getRelationCommentary('충', 'stem', '甲庚충', [])!;
    expect(branch.paragraphs.length).toBeGreaterThan(0);
    expect(branch.reflection).toBeTruthy();
    expect(stem.paragraphs.length).toBeGreaterThan(branch.paragraphs.length);
    expect(stem.paragraphs.some((p) => p.text.includes('甲庚'))).toBe(true);
  });

  it('신살 해설 — 미등록은 generic', () => {
    expect(getSpiritCommentary('천을귀인').sources[0].title).toContain('삼명');
    expect(getSpiritCommentary('없는신살').paragraphs[0].text).toContain('神煞');
  });
});
