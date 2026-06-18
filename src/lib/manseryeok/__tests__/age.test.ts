import { describe, it, expect } from 'vitest';
import { internationalAge } from '../age';

describe('internationalAge (만나이)', () => {
  it('생일 전에는 한 살 적게', () => {
    expect(internationalAge(2003, 12, 23, 2026, 5, 31)).toBe(22);
    expect(internationalAge(2003, 12, 23, 2026, 12, 23)).toBe(23);
    expect(internationalAge(2003, 12, 23, 2026, 12, 22)).toBe(22);
  });

  it('대운 구간 경계 — 2003-12-23', () => {
    expect(internationalAge(2003, 12, 23, 2029, 1, 1)).toBe(25);
    expect(internationalAge(2003, 12, 23, 2038, 12, 31)).toBe(35);
    expect(internationalAge(2003, 12, 23, 2018, 12, 31)).toBe(15);
  });
});
