import Link from 'next/link';
import { PostCard } from '@/components/community/PostCard';
import { listPosts } from '@/lib/community/store';
import {
  COMMUNITY_INTRO,
  COMMUNITY_NOTICE,
  COMMUNITY_RULES,
} from '@/lib/philosophy/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '커뮤니티',
  description: '8-BIT를 달고 익명으로 고민·밈·질문을 나누는 공간.',
};

export default async function CommunityPage() {
  const posts = await listPosts({ limit: 100 });

  return (
    <div className="community-page">
      <header className="community-page__header">
        <p className="community-page__eyebrow">OPEN · UGC</p>
        <h1>커뮤니티</h1>
        <p className="community-page__intro">{COMMUNITY_INTRO}</p>
        <div className="community-page__actions">
          <Link href="/community/new" className="btn btn--primary">
            글 쓰기
          </Link>
          <Link href="/live" className="btn btn--ghost">
            실시간 채팅
          </Link>
          <Link href="/explore" className="btn btn--ghost">
            내 8-BIT 보기
          </Link>
        </div>
      </header>

      <aside className="community-notice" aria-labelledby="community-notice-title">
        <h2 id="community-notice-title">{COMMUNITY_NOTICE.title}</h2>
        {COMMUNITY_NOTICE.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </aside>

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
