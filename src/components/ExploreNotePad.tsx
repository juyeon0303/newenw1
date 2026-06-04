'use client';

import { useEffect, useState } from 'react';

interface Props {
  itemKey: string;
  itemLabel: string;
  value: string;
  onSave: (text: string) => void;
  placeholder?: string;
}

export function ExploreNotePad({
  itemKey,
  itemLabel,
  value,
  onSave,
  placeholder = '떠오른 장면·이름·순간을 적어 둡니다. 브라우저에만 저장됩니다.',
}: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [itemKey, value]);

  function handleBlur() {
    if (draft !== value) onSave(draft);
  }

  return (
    <div className="explore-note">
      <label className="explore-note__label" htmlFor={`note-${itemKey}`}>
        노트
      </label>
      <textarea
        id={`note-${itemKey}`}
        className="explore-note__input"
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {draft && (
        <p className="explore-note__hint">포커스를 벗어나면 자동 저장됩니다.</p>
      )}
    </div>
  );
}
