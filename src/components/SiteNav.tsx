'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useLocale } from '@/contexts/LocaleContext';

type NavLink = { href: string; label: string; zone?: string };

const links: NavLink[] = [
  { href: '/', label: '처음', zone: 'landing' },
  { href: '/philosophy', label: '사이트 철학', zone: 'philosophy' },
  { href: '/explore', label: '명리 탐색', zone: 'free' },
  { href: '/wiki', label: '명리 위키', zone: 'open' },
  { href: '/community', label: '운명 광장', zone: 'open' },
  { href: '/premium', label: '프리미엄', zone: 'paid' },
];

export function SiteNav() {
  const { locale } = useLocale();
  const pathname = usePathname();

  return (
    <header className="site-nav">
      <Link href="/" className="site-nav__brand">
        <span className="site-nav__mark">8</span>
        <span className="site-nav__brand-8code">8-BIT</span>
      </Link>
      <nav className="site-nav__links">
        {links.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === '/explore' && pathname.startsWith('/explore'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav__link${active ? ' site-nav__link--active' : ''}${
                item.zone === 'paid' ? ' site-nav__link--premium' : ''
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
