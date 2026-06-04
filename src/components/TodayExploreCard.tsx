'use client';

import type { DailyPrompt } from '@/lib/session/daily-prompt';

interface Props {
  prompt: DailyPrompt;
  onSuggest?: () => void;
}

export function TodayExploreCard({ prompt, onSuggest }: Props) {
  return (
    <div className="today-card">
      <h4>{prompt.title}</h4>
      <p>{prompt.body}</p>
      {onSuggest && prompt.suggestKey && (
        <button type="button" className="today-card__btn" onClick={onSuggest}>
          우선순위 항목으로 이어가기 →
        </button>
      )}
    </div>
  );
}
