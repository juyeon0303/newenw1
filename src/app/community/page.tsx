import Link from 'next/link';
import { CommunityCategoryNav } from '@/components/community/CommunityCategoryNav';
import { PostCard } from '@/components/community/PostCard';
import { listPosts } from '@/lib/community/store';
import { isValidCategory } from '@/lib/community/validation';
import type { CommunityCategoryId } from '@/lib/community/types';
import {
  COMMUNITY_INTRO,
  COMMUNITY_NOTICE,
  COMMUNITY_RULES,
} from '@/lib/philosophy/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '운명 광장',
  description: '8-bit를 달고 익명으로 고민·밈·질문을 나누는 집단지성 공간.',
};

type SearchParams = Promise<{ category?: string }>;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const category =
    sp.category && isValidCategory(sp.category)
      ? (sp.category as CommunityCategoryId)
      : undefined;

  const posts = await listPosts({ category, limit: 100 });

  return (
    <div className="community-page">
      <header className="community-page__header">
        <p className="community-page__eyebrow">OPEN · UGC</p>
        <h1>운명 광장</h1>
        <p className="community-page__intro">{COMMUNITY_INTRO}</p>
        <div className="community-page__actions">
          <Link href="/community/new" className="btn btn--primary">
            글 쓰기
          </Link>
          <Link href="/explore" className="btn btn--ghost">
            내 8-bit 보기
          </Link>
        </div>
      </header>

      <aside className="community-notice" aria-labelledby="community-notice-title">
        <h2 id="community-notice-title">{COMMUNITY_NOTICE.title}</h2>
        {COMMUNITY_NOTICE.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </aside>

      <CommunityCategoryNav active={category} />

      {posts.length === 0 ? (
        <p className="community-page__empty">
          아직 글이 없습니다. 첫 탐구를 남겨 보세요.
        </p>
      ) : (
        <div className="community-feed">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <aside className="community-rules">
        <h2>안내</h2>
        <ul>
          {COMMUNITY_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
