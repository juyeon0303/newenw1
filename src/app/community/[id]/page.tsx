import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostDetailClient } from '@/components/community/PostDetailClient';
import { getPost, listReplies } from '@/lib/community/store';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post?.title ?? '글' };
}

export default async function CommunityPostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  const replies = await listReplies(id);

  return (
    <div className="gaga-live gaga-live--detail">
      <Link href="/community" className="community-back">
        ← 가가라이브
      </Link>
      <PostDetailClient post={post} replies={replies} />
    </div>
  );
}
