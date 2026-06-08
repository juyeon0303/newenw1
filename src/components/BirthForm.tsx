'use client';

import { useState } from 'react';
import type { ManseryeokInput } from '@/lib/manseryeok';
import { SEOUL_LONGITUDE } from '@/lib/manseryeok/time/correction';

export interface BirthFormValues {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
  yajasi: boolean;
  unknownTime: boolean;
}

const DEFAULT: BirthFormValues = {
  year: 2000,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: 'male',
  yajasi: false,
  unknownTime: false,
};

export function defaultTimeCorrection() {
  return {
    longitude: SEOUL_LONGITUDE,
    applyEquationOfTime: true,
    applyDst: true,
  } as const;
}

export function birthValuesToInput(v: BirthFormValues): ManseryeokInput {
  return {
    year: v.year,
    month: v.month,
    day: v.day,
    hour: v.unknownTime ? 0 : v.hour,
    minute: v.unknownTime ? 0 : v.minute,
    gender: v.gender,
    yajasi: v.unknownTime ? false : v.yajasi,
    unknownTime: v.unknownTime,
    timeCorrection: defaultTimeCorrection(),
  };
}

interface Props {
  onSubmit: (input: ManseryeokInput) => void;
  initial?: Partial<BirthFormValues>;
}

export function BirthForm({ onSubmit, initial }: Props) {
  const [v, setV] = useState<BirthFormValues>({ ...DEFAULT, ...initial });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(birthValuesToInput(v));
  }

  return (
    <form className="birth-form" onSubmit={handleSubmit}>
      <div className="birth-form__grid">
        <label>
          <span>년</span>
          <input
            type="number"
            min={1900}
            max={2100}
            value={v.year}
            onChange={(e) => setV({ ...v, year: +e.target.value })}
            required
          />
        </label>
        <label>
          <span>월</span>
          <input
            type="number"
            min={1}
            max={12}
            value={v.month}
            onChange={(e) => setV({ ...v, month: +e.target.value })}
            required
          />
        </label>
        <label>
          <span>일</span>
          <input
            type="number"
            min={1}
            max={31}
            value={v.day}
            onChange={(e) => setV({ ...v, day: +e.target.value })}
            required
          />
        </label>
        {!v.unknownTime && (
          <>
            <label>
              <span>시</span>
              <input
                type="number"
                min={0}
                max={23}
                value={v.hour}
                onChange={(e) => setV({ ...v, hour: +e.target.value })}
                required
              />
            </label>
            <label>
              <span>분</span>
              <input
                type="number"
                min={0}
                max={59}
                value={v.minute}
                onChange={(e) => setV({ ...v, minute: +e.target.value })}
              />
            </label>
          </>
        )}
      </div>

      <div className="birth-form__row">
        <label className="birth-form__radio">
          <input
            type="radio"
            name="gender"
            checked={v.gender === 'male'}
            onChange={() => setV({ ...v, gender: 'male' })}
          />
          남
        </label>
        <label className="birth-form__radio">
          <input
            type="radio"
            name="gender"
            checked={v.gender === 'female'}
            onChange={() => setV({ ...v, gender: 'female' })}
          />
          여
        </label>
        <label className="birth-form__check">
          <input
            type="checkbox"
            checked={v.unknownTime}
            onChange={(e) => setV({ ...v, unknownTime: e.target.checked, yajasi: false })}
          />
          시간모름
        </label>
        {!v.unknownTime && (
          <label className="birth-form__check">
            <input
              type="checkbox"
              checked={v.yajasi}
              onChange={(e) => setV({ ...v, yajasi: e.target.checked })}
            />
            야자시 적용
          </label>
        )}
      </div>

      {v.unknownTime && (
        <p className="birth-form__hint">년·월·일주(삼주)만 산출합니다. 시주·대운은 시간 확인 후 다시 보세요.</p>
      )}

      <button type="submit" className="btn btn--primary">
        팔자 산출
      </button>
    </form>
  );
}
