import { describe, expect, it } from 'vitest';
import { calculateManseryeok } from '@/lib/manseryeok';
import {
  buildDaewoonCommentary,
  buildDaewoonMetaNote,
  buildMonthCommandCommentary,
} from '@/lib/philosophy/commentary';

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

describe('luck commentary', () => {
  const chart = calculateManseryeok(KIM);

  it('대운 메타 해설', () => {
    const note = buildDaewoonMetaNote(chart);
    expect(note.paragraphs[0].text).toMatch(/5세/);
    expect(note.paragraphs[0].text).toMatch(/순행|역행/);
  });

  it('김성모 현재 대운(庚申) — 원국과 충·합 맥락', () => {
    const idx = chart.luckMeta.currentDaewoonIndex;
    const luck = chart.daewoon[idx];
    const note = buildDaewoonCommentary(luck, chart, { isCurrent: true, index: idx });
    expect(note.contextLine).toMatch(/현재 대운/);
    expect(note.paragraphs.some((p) => p.text.includes('편재') || p.text.includes(luck.stemTenStarKo))).toBe(true);
  });

  it('월령 해설 — 일간↔월령 생극', () => {
    const note = buildMonthCommandCommentary(chart);
    expect(note.contextLine).toMatch(/일간↔월령/);
    expect(note.paragraphs.some((p) => p.text.includes('癸') || p.text.includes('계'))).toBe(true);
    expect(note.reflection).toBeTruthy();
  });
});
