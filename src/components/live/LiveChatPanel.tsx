'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveMessage } from '@/lib/live-chat/types';
import { formatLiveTime } from '@/lib/live-chat/format';
import { ensureAuthor, loadAuthor } from '@/lib/community/author-session';
import { CommunityAuthorBar } from '@/components/community/CommunityAuthorBar';

const POLL_MS = 2000;

export function LiveChatPanel() {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [connected, setConnected] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<string | null>(null);
  const stickToBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const mergeMessages = useCallback((incoming: LiveMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const next = [...prev];
      for (const m of incoming) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          next.push(m);
        }
      }
      return next.slice(-300);
    });
    lastIdRef.current = incoming[incoming.length - 1]?.id ?? lastIdRef.current;
  }, []);

  const loadInitial = useCallback(async () => {
    try {
      const res = await fetch('/api/live/messages', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const list = (data.messages ?? []) as LiveMessage[];
      setMessages(list.slice(-300));
      lastIdRef.current = list[list.length - 1]?.id ?? null;
      setConnected(true);
      requestAnimationFrame(() => scrollToBottom('auto'));
    } catch {
      setConnected(false);
    }
  }, [scrollToBottom]);

  const pollNew = useCallback(async () => {
    try {
      const afterId = lastIdRef.current;
      const url = afterId
        ? `/api/live/messages?afterId=${encodeURIComponent(afterId)}`
        : '/api/live/messages';
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const incoming = (data.messages ?? []) as LiveMessage[];
      if (incoming.length > 0 && stickToBottomRef.current) {
        mergeMessages(incoming);
        requestAnimationFrame(() => scrollToBottom());
      } else if (incoming.length > 0) {
        mergeMessages(incoming);
      }
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, [mergeMessages, scrollToBottom]);

  useEffect(() => {
    loadInitial();
    const id = window.setInterval(pollNew, POLL_MS);
    return () => window.clearInterval(id);
  }, [loadInitial, pollNew]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stickToBottomRef.current = nearBottom;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const author = ensureAuthor(loadAuthor()?.name ?? '');
    if (!author.name.trim()) {
      setError('닉네임을 저장한 뒤 채팅을 보내 주세요.');
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    setPending(true);
    try {
      const res = await fetch('/api/live/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: author.id,
          authorName: author.name,
          body: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '전송하지 못했습니다.');
        return;
      }
      const message = data.message as LiveMessage;
      mergeMessages([message]);
      setText('');
      stickToBottomRef.current = true;
      requestAnimationFrame(() => scrollToBottom());
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="live-chat">
      <div className="live-chat__status">
        <span className={`live-chat__dot${connected ? ' live-chat__dot--on' : ''}`} />
        <span>{connected ? '실시간 연결됨' : '연결 끊김 · 재시도 중…'}</span>
      </div>

      <div
        ref={listRef}
        className="live-chat__messages"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <p className="live-chat__empty">첫 채팅을 남겨 보세요.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="live-chat__msg">
              <span className="live-chat__msg-author">{m.authorName}</span>
              <span className="live-chat__msg-time">{formatLiveTime(m.createdAt)}</span>
              <p className="live-chat__msg-body">{m.body}</p>
            </div>
          ))
        )}
      </div>

      <div className="live-chat__composer">
        <CommunityAuthorBar compact />
        <form className="live-chat__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="live-chat__input"
            maxLength={280}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="채팅 입력 (280자)"
            autoComplete="off"
          />
          <button type="submit" className="btn btn--primary btn--sm" disabled={pending}>
            {pending ? '…' : '전송'}
          </button>
        </form>
        {error && <p className="live-chat__error">{error}</p>}
      </div>
    </div>
  );
}
