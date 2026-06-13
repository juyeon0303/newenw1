'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ManseryeokInput } from '@/lib/manseryeok';
import { birthValuesToInput } from '@/components/BirthForm';

interface Props {
  onSubmit: (input: ManseryeokInput) => void;
  submitLabel?: string;
  initial?: Partial<{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: 'male' | 'female';
    unknownTime: boolean;
  }>;
}

export function EightCodeBirthForm({
  onSubmit,
  initial,
  submitLabel = '8-BIT 분석하기',
}: Props) {
  const [year, setYear] = useState(initial?.year ?? 1995);
  const [month, setMonth] = useState(initial?.month ?? 6);
  const [day, setDay] = useState(initial?.day ?? 15);
  const [hour, setHour] = useState(initial?.hour ?? 12);
  const [minute, setMinute] = useState(initial?.minute ?? 0);
  const [gender, setGender] = useState<'male' | 'female'>(initial?.gender ?? 'male');
  const [unknownTime, setUnknownTime] = useState(initial?.unknownTime ?? false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(
      birthValuesToInput({
        year,
        month,
        day,
        hour,
        minute,
        gender,
        yajasi: false,
        unknownTime,
      }),
    );
  }

  const field =
    'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/30 transition';

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full max-w-md space-y-5"
    >
      <div className="grid grid-cols-3 gap-3">
        <label className="block col-span-1">
          <span className="text-xs text-white/50 mb-1.5 block">년</span>
          <input
            type="number"
            className={field}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
          />
        </label>
        <label className="block col-span-1">
          <span className="text-xs text-white/50 mb-1.5 block">월</span>
          <input
            type="number"
            min={1}
            max={12}
            className={field}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            required
          />
        </label>
        <label className="block col-span-1">
          <span className="text-xs text-white/50 mb-1.5 block">일</span>
          <input
            type="number"
            min={1}
            max={31}
            className={field}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            required
          />
        </label>
      </div>

      {!unknownTime && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-white/50 mb-1.5 block">시</span>
            <input
              type="number"
              min={0}
              max={23}
              className={field}
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs text-white/50 mb-1.5 block">분</span>
            <input
              type="number"
              min={0}
              max={59}
              className={field}
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      <div className="flex gap-2">
        {(['male', 'female'] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition active:scale-[0.98] ${
              gender === g
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/20'
            }`}
          >
            {g === 'male' ? '남' : '여'}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={unknownTime}
          onChange={(e) => setUnknownTime(e.target.checked)}
          className="rounded border-white/20"
        />
        시간모름 (삼주만 산출)
      </label>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="w-full rounded-xl py-3.5 text-sm font-semibold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 text-slate-950 shadow-lg shadow-fuchsia-500/25"
      >
        {submitLabel}
      </motion.button>
    </motion.form>
  );
}
