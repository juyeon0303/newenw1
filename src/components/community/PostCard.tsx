import Link from 'next/link';
import type { CommunityPost } from '@/lib/community/types';
import { formatCommunityDate } from '@/lib/community/format';

interface Props {
  post: CommunityPost;
}

export function PostCard({ post }: Props) {
  const preview =
    post.body.length > 200 ? `${post.body.slice(0, 200).trim()}…` : post.body;

  return (
    <article className="gaga-live__item">
      <div className="gaga-live__item-meta">
        <span className="gaga-live__author">{post.authorName}</span>
        <time dateTime={post.createdAt}>{formatCommunityDate(post.createdAt)}</time>
      </div>
      <h2 className="gaga-live__item-title">
        <Link href={`/community/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="gaga-live__item-preview">{preview}</p>
      <footer className="gaga-live__item-footer">
        <Link href={`/community/${post.id}`} className="gaga-live__replies">
          댓글 {post.replyCount}
        </Link>
      </footer>
    </article>
  );
}
