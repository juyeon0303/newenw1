'use client';

import { useState } from 'react';
import type { ExploreSessionApi } from '@/hooks/useExploreSession';
import type { ExploreBundle } from '@/lib/philosophy/build-explore';
import { chartLabel } from '@/lib/session/chart-fingerprint';
import { parseStorageKey } from '@/lib/session/item-keys';
import type { ManseryeokResult } from '@/lib/manseryeok';

interface Props {
  chart: ManseryeokResult;
  bundle: ExploreBundle;
  session: ExploreSessionApi;
  onOpenItem: (category: string, key: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExploreJournal({ chart, bundle, session, onOpenItem }: Props) {
  const [memoryDraft, setMemoryDraft] = useState('');
  const { data } = session;

  const noteEntries = Object.entries(data.notes)
    .map(([key, note]) => {
      const label = resolveLabel(key, bundle);
      return { key, label, ...note };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="journal">
      <header className="journal__header">
        <h3>탐구 노트</h3>
        <p className="journal__meta">{chartLabel(chart.meta.input)} · 이 기기에만 저장</p>
      </header>

      <section className="journal__capture">
        <h4>기억 조각</h4>
        <p className="journal__hint">방금 떠오른 것 — 짧게 적어 두었다가 나중에 다시 읽습니다.</p>
        <div className="journal__capture-row">
          <input
            type="text"
            className="journal__capture-input"
            value={memoryDraft}
            onChange={(e) => setMemoryDraft(e.target.value)}
            placeholder="예: 2019년 가을, 그 사람과…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && memoryDraft.trim()) {
                session.addMemory(memoryDraft);
                setMemoryDraft('');
              }
            }}
          />
          <button
            type="button"
            className="btn btn--ghost journal__capture-btn"
            disabled={!memoryDraft.trim()}
            onClick={() => {
              session.addMemory(memoryDraft);
              setMemoryDraft('');
            }}
          >
            추가
          </button>
        </div>
        {data.memories.length > 0 && (
          <ul className="journal__memories">
            {data.memories.map((m) => (
              <li key={m.id}>
                <span className="journal__mem-time">{formatDate(m.createdAt)}</span>
                <span>{m.text}</span>
                <button
                  type="button"
                  className="journal__mem-del"
                  aria-label="삭제"
                  onClick={() => session.removeMemory(m.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {data.bookmarks.length > 0 && (
        <section className="journal__section">
          <h4>북마크한 질문 ({data.bookmarks.length})</h4>
          <ul className="journal__bookmarks">
            {data.bookmarks.map((b) => (
              <li key={b.id}>
                <span className="journal__bm-label">{b.itemLabel}</span>
                <p>{b.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="journal__section">
        <h4>항목별 노트 ({noteEntries.length})</h4>
        {noteEntries.length === 0 ? (
          <p className="journal__empty">탐구 탭에서 항목을 읽으며 노트를 남겨 보세요.</p>
        ) : (
          <ul className="journal__notes">
            {noteEntries.map((n) => (
              <li key={n.key}>
                <button
                  type="button"
                  className="journal__note-link"
                  onClick={() => {
                    const { category, key } = parseStorageKey(n.key);
                    onOpenItem(category, key);
                  }}
                >
                  {n.label}
                </button>
                <p>{n.text}</p>
                <span className="journal__note-time">{formatDate(n.updatedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function resolveLabel(key: string, bundle: ExploreBundle): string {
  if (key.startsWith('daewoon:')) {
    return `대운 ${key.slice('daewoon:'.length)}세~`;
  }
  if (key.startsWith('month-command')) return '월령·계절';
  if (key.startsWith('relation:')) {
    const k = key.slice('relation:'.length);
    return bundle.relationByKey.get(k)?.hits[0]?.displayLabel ?? k;
  }
  if (key.startsWith('tenstar:')) return key.slice('tenstar:'.length);
  if (key.startsWith('hidden:')) return `${key.slice('hidden:'.length)} (지장간)`;
  if (key.startsWith('spirit:')) return key.slice('spirit:'.length);
  return key;
}
