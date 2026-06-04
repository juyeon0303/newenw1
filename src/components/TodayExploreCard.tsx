'use client';

import type { DailyPrompt } from '@/lib/session/daily-prompt';

interface Props {
  prompt: DailyPrompt;
  onSuggest?: () => void;
}

export function TodayExploreCard({ prompt, onSuggest }: Props) {
  return (
    <div className="today-card">
      <p className="today-card__label">{prompt.title}</p>
      <p className="today-card__body">{prompt.body}</p>
      {onSuggest && prompt.suggestKey && (
        <button type="button" className="today-card__btn" onClick={onSuggest}>
          이어가기
        </button>
      )}
    </div>
  );
}
