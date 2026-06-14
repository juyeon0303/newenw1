import Link from 'next/link';
import type { CommunityPost } from '@/lib/community/types';
import { formatCommunityDate } from '@/lib/community/format';

interface Props {
  post: CommunityPost;
}

export function PostCard({ post }: Props) {
  const preview =
    post.body.length > 160 ? `${post.body.slice(0, 160).trim()}…` : post.body;

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <span className="post-card__author">{post.authorName}</span>
        <time dateTime={post.createdAt}>{formatCommunityDate(post.createdAt)}</time>
      </div>
      <h2 className="post-card__title">
        <Link href={`/community/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-card__preview">{preview}</p>
      <footer className="post-card__footer">
        <Link href={`/community/${post.id}`} className="post-card__replies">
          댓글 {post.replyCount}
        </Link>
      </footer>
    </article>
  );
}
