'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { ManseryeokInput } from '@/lib/manseryeok';
import { useChart } from '@/contexts/ChartContext';
import { loadSavedSession } from '@/lib/session/explore-storage';
import { EightCodeBirthForm } from '@/components/eightcode/EightCodeBirthForm';
import { EightCharExtraction } from '@/components/landing/EightCharExtraction';

export function LandingClient() {
  const router = useRouter();
  const { compute, chart: existingChart } = useChart();
  const [extracting, setExtracting] = useState(false);
  const [pendingChart, setPendingChart] = useState<ReturnType<typeof compute> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const savedInput = loadSavedSession()?.input;
  const formInitial = savedInput
    ? {
        year: savedInput.year,
        month: savedInput.month,
        day: savedInput.day,
        hour: savedInput.hour,
        minute: savedInput.minute,
        gender: savedInput.gender,
        unknownTime: savedInput.unknownTime,
      }
    : undefined;

  function handleSubmit(input: ManseryeokInput) {
    try {
      setError(null);
      const result = compute(input);
      setPendingChart(result);
      setExtracting(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '계산 오류');
    }
  }

  if (extracting && pendingChart) {
    return (
      <EightCharExtraction
        chart={pendingChart}
        onComplete={() => router.push('/explore')}
      />
    );
  }

  return (
    <div className="landing-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="landing-page__shell"
      >
        <div className="landing-page__inner">
          <header className="landing-page__header">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="landing-page__title"
            >
              8-bit
            </motion.h1>
            <p className="landing-page__tag">8-bit</p>
            <p className="landing-page__intro">
              생년월일시만 입력하세요.
              <br />
              원리는 공개, 해석은 투명합니다.
            </p>
          </header>

          <EightCodeBirthForm
            onSubmit={handleSubmit}
            initial={formInitial}
            submitLabel="나의 8글자 추출하기"
          />
          {error && <p className="landing-page__error">{error}</p>}

          {existingChart && (
            <Link href="/explore" className="landing-page__resume">
              저장된 8-bit 보기 →
            </Link>
          )}
        </div>
      </motion.div>

      <nav className="landing-page__links" aria-label="빠른 이동">
        <Link href="/philosophy">사이트 철학</Link>
        <Link href="/explore">명리 탐색</Link>
        <Link href="/wiki">명리 위키</Link>
      </nav>
    </div>
  );
}
