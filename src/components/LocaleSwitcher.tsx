'use client';

import { LOCALES, LOCALE_LABELS } from '@/lib/i18n/locale';
import { useLocale } from '@/contexts/LocaleContext';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="locale-switcher" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={locale === l ? 'locale-switcher__btn active' : 'locale-switcher__btn'}
          onClick={() => setLocale(l)}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
