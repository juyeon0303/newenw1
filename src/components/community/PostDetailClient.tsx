'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CommunityPost, CommunityReply } from '@/lib/community/types';
import { formatCommunityDate } from '@/lib/community/format';
import { ensureAuthor, loadAuthor } from '@/lib/community/author-session';
import { CommunityAuthorBar } from './CommunityAuthorBar';

interface Props {
  post: CommunityPost;
  replies: CommunityReply[];
}

export function PostDetailClient({ post, replies: initialReplies }: Props) {
  const router = useRouter();
  const [replies, setReplies] = useState(initialReplies);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const author = loadAuthor();
  const isOwner = author?.id === post.authorId;

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const a = ensureAuthor(author?.name ?? '');
    setPending(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: a.id,
          authorName: a.name,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '댓글을 달지 못했습니다.');
        return;
      }
      setReplies((prev) => [...prev, data.reply]);
      setBody('');
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!author || !isOwner) return;
    if (!confirm('이 글을 삭제할까요? 댓글도 함께 삭제됩니다.')) return;
    const res = await fetch(`/api/community/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: author.id }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? '삭제할 수 없습니다.');
      return;
    }
    router.push('/community');
    router.refresh();
  }

  return (
    <div className="gaga-live-detail">
      <header className="gaga-live-detail__head">
        <div className="gaga-live-detail__meta">
          <span className="gaga-live__author">{post.authorName}</span>
          <time dateTime={post.createdAt}>{formatCommunityDate(post.createdAt)}</time>
        </div>
        <h1>{post.title}</h1>
        {isOwner && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleDelete}>
            삭제
          </button>
        )}
      </header>
      <div className="gaga-live-detail__body">{post.body}</div>

      <section className="community-replies">
        <h2>댓글 {replies.length}</h2>
        <ul className="community-replies__list">
          {replies.map((r) => (
            <li key={r.id} className="community-replies__item">
              <div className="community-replies__meta">
                <strong>{r.authorName}</strong>
                <time dateTime={r.createdAt}>{formatCommunityDate(r.createdAt)}</time>
              </div>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
        {replies.length === 0 && (
          <p className="community-replies__empty">아직 댓글이 없습니다.</p>
        )}
      </section>

      <section className="community-reply-form">
        <h2>댓글 달기</h2>
        <CommunityAuthorBar />
        <form onSubmit={handleReply}>
          <textarea
            rows={4}
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="5자 이상"
          />
          {error && <p className="community-form__error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? '등록 중…' : '댓글 등록'}
          </button>
        </form>
      </section>
    </div>
  );
}
