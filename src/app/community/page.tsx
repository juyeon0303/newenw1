import Link from 'next/link';
import { PostCard } from '@/components/community/PostCard';
import { listPosts } from '@/lib/community/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '가가라이브',
  description: '8-BIT 가가라이브 — 올라오는 글이 그대로 보이는 실시간 피드.',
};

export default async function CommunityPage() {
  const posts = await listPosts({ limit: 100 });

  return (
    <div className="gaga-live">
      <header className="gaga-live__header">
        <p className="gaga-live__eyebrow">LIVE · FEED</p>
        <h1>가가라이브</h1>
        <p className="gaga-live__intro">
          분류 없이 올라온 글이 최신순으로 보입니다. 생년월일시 전체·실명·연락처는 올리지
          마세요.
        </p>
        <div className="gaga-live__actions">
          <Link href="/community/new" className="btn btn--primary">
            글 쓰기
          </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <p className="gaga-live__empty">아직 글이 없습니다. 첫 글을 남겨 보세요.</p>
      ) : (
        <div className="gaga-live__feed" role="feed" aria-label="가가라이브 피드">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
