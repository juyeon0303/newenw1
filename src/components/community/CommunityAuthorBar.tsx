'use client';

import { useEffect, useState } from 'react';
import { ensureAuthor, loadAuthor } from '@/lib/community/author-session';

interface Props {
  onAuthorChange?: (name: string) => void;
  compact?: boolean;
}

export function CommunityAuthorBar({ onAuthorChange, compact }: Props) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const a = loadAuthor();
    if (a) {
      setName(a.name);
      onAuthorChange?.(a.name);
    }
  }, [onAuthorChange]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const author = ensureAuthor(name);
    setName(author.name);
    setSaved(true);
    onAuthorChange?.(author.name);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form className="community-author" onSubmit={handleSave}>
      <label className="community-author__label">
        <span>닉네임</span>
        <input
          type="text"
          maxLength={24}
          placeholder="탐구에서 쓸 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="btn btn--ghost btn--sm">
        {saved ? '저장됨' : '저장'}
      </button>
      {!compact && (
        <p className="community-author__hint">
          로그인 없이 이 기기에만 식별자가 저장됩니다. 글 삭제는 같은 기기·같은 닉네임일 때만
          가능합니다.
        </p>
      )}
    </form>
  );
}
