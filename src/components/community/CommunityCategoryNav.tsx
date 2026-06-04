import Link from 'next/link';
import { COMMUNITY_CATEGORIES } from '@/lib/community/types';

interface Props {
  active?: string;
}

export function CommunityCategoryNav({ active }: Props) {
  return (
    <nav className="community-cats" aria-label="카테고리">
      <Link
        href="/community"
        className={`community-cats__chip${!active ? ' community-cats__chip--active' : ''}`}
      >
        전체
      </Link>
      {COMMUNITY_CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/community?category=${c.id}`}
          className={`community-cats__chip${active === c.id ? ' community-cats__chip--active' : ''}`}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
