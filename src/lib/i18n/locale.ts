export const LOCALES = ['ko', 'en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'EN',
  ja: '日本語',
};

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function normalizeLocale(v: string | null | undefined): Locale {
  return v && isLocale(v) ? v : 'ko';
}
