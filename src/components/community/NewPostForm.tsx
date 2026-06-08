'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isValidCategory } from '@/lib/community/validation';
import { COMMUNITY_CATEGORIES, type CommunityCategoryId } from '@/lib/community/types';
import { ensureAuthor, loadAuthor } from '@/lib/community/author-session';
import { CommunityAuthorBar } from './CommunityAuthorBar';

export function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<CommunityCategoryId>('explore');

  useEffect(() => {
    const c = searchParams.get('category');
    if (c && isValidCategory(c)) {
      setCategory(c as CommunityCategoryId);
    }
  }, [searchParams]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const author = ensureAuthor(loadAuthor()?.name ?? '');
    if (!author.name.trim()) {
      setError('닉네임을 저장한 뒤 글을 올려 주세요.');
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: author.id,
          authorName: author.name,
          category,
          title,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '글을 올리지 못했습니다.');
        return;
      }
      router.push(`/community/${data.post.id}`);
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="community-form-wrap">
      <CommunityAuthorBar />
      <form className="community-form" onSubmit={handleSubmit}>
        <label>
          <span>카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CommunityCategoryId)}
          >
            {COMMUNITY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>제목</span>
          <input
            type="text"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="2~120자"
          />
        </label>
        <label>
          <span>본문</span>
          <textarea
            rows={10}
            maxLength={4000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="떠오른 장면, 질문, 해석과 다른 경험 등 (5자 이상)"
          />
        </label>
        {error && <p className="community-form__error">{error}</p>}
        <div className="community-form__actions">
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? '올리는 중…' : '글 올리기'}
          </button>
        </div>
      </form>
    </div>
  );
}
