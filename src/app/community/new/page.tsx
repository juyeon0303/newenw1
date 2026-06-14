import Link from 'next/link';
import { Suspense } from 'react';
import { NewPostForm } from '@/components/community/NewPostForm';

export const metadata = {
  title: '글 쓰기',
};

export default function CommunityNewPage() {
  return (
    <div className="community-page">
      <header className="community-page__header community-page__header--compact">
        <h1>탐구 글 쓰기</h1>
        <Link href="/community" className="community-back">
          ← 목록
        </Link>
      </header>
      <Suspense fallback={<p className="community-page__empty">…</p>}>
        <NewPostForm />
      </Suspense>
    </div>
  );
}
