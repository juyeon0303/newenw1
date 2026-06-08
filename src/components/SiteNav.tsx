'use client';

import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n/ui-strings';

type NavLink =
  | { href: string; label: string }
  | { href: string; labelKey: 'nav_synergy' };

const links: NavLink[] = [
  { href: '/', label: '처음' },
  { href: '/tips', label: '탐구 TIP' },
  { href: '/analyze', label: '8CODE' },
  { href: '/synergy', labelKey: 'nav_synergy' },
  { href: '/lifestyle', label: '라이프' },
  { href: '/community', label: '커뮤니티' },
];

export function SiteNav() {
  const { locale } = useLocale();

  return (
    <header className="site-nav">
      <Link href="/" className="site-nav__brand">
        <span className="site-nav__mark">8</span>
        <span>
          <span className="site-nav__brand-8code">8CODE</span> · 사주 탐구
        </span>
      </Link>
      <nav className="site-nav__links">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="site-nav__link">
            {'labelKey' in item ? t(item.labelKey, locale) : item.label}
          </Link>
        ))}
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
