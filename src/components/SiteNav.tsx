import Link from 'next/link';

const links = [
  { href: '/', label: '처음' },
  { href: '/explore', label: '탐구' },
  { href: '/about', label: '사주란' },
];

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link href="/" className="site-nav__brand">
        <span className="site-nav__mark">探</span>
        <span>사주 탐구</span>
      </Link>
      <nav className="site-nav__links">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="site-nav__link">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
