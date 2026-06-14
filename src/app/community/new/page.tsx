import Link from 'next/link';
import { Suspense } from 'react';
import { NewPostForm } from '@/components/community/NewPostForm';

export const metadata = {
  title: '글 쓰기 · 가가라이브',
};

export default function CommunityNewPage() {
  return (
    <div className="gaga-live gaga-live--form">
      <header className="gaga-live__header gaga-live__header--compact">
        <div>
          <p className="gaga-live__eyebrow">LIVE · FEED</p>
          <h1>글 쓰기</h1>
        </div>
        <Link href="/community" className="community-back">
          ← 가가라이브
        </Link>
      </header>
      <Suspense fallback={<p className="gaga-live__empty">…</p>}>
        <NewPostForm />
      </Suspense>
    </div>
  );
}
