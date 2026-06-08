'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WAKE_EARTHLY,
  WAKE_HEAVENLY,
  WAKE_STAGES,
  WAKE_TIPS,
} from '@/lib/wake/content';

const TIP_INTERVAL_MS = 4200;
const STAGE_INTERVAL_MS = 2400;
const MIN_VISIBLE_MS = 1200;
const COLD_WAKE_MS = 2800;
const FAST_RESPONSE_MS = 1500;

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function navTiming(): PerformanceNavigationTiming | undefined {
  if (typeof performance === 'undefined') return undefined;
  return performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
}

function shouldShowWakeBridge(): { show: boolean; cold: boolean } {
  const nav = navTiming();
  if (!nav) return { show: true, cold: false };
  const cold = nav.responseStart - nav.requestStart > COLD_WAKE_MS;
  if (cold) return { show: true, cold: true };
  const fast = nav.responseEnd - nav.requestStart < FAST_RESPONSE_MS;
  return { show: !fast, cold: false };
}

function dismissStaticSplash() {
  const el = document.getElementById('8bit-wake-static');
  if (!el) return;
  el.dataset.state = 'out';
  window.setTimeout(() => el.remove(), 420);
}

export function WakeBridge() {
  const tips = useMemo(() => shuffle(WAKE_TIPS), []);
  const glyphs = useMemo(
    () =>
      shuffle([...WAKE_HEAVENLY.slice(0, 4), ...WAKE_EARTHLY.slice(0, 4)]).slice(
        0,
        8,
      ),
    [],
  );

  const wakeMode = useMemo(() => shouldShowWakeBridge(), []);
  const [visible, setVisible] = useState(wakeMode.show);
  const [stageIndex, setStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!wakeMode.show) {
      dismissStaticSplash();
      return;
    }

    const shownAt = performance.now();
    const minMs = wakeMode.cold ? 3200 : MIN_VISIBLE_MS;

    const stageTimer = window.setInterval(() => {
      setStageIndex((i) => (i + 1) % WAKE_STAGES.length);
    }, STAGE_INTERVAL_MS);

    const tipTimer = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, TIP_INTERVAL_MS);

    const ready = () => {
      const elapsed = performance.now() - shownAt;
      const wait = Math.max(0, minMs - elapsed);
      window.setTimeout(() => {
        setVisible(false);
        dismissStaticSplash();
      }, wait);
    };

    if (document.readyState === 'complete') {
      ready();
    } else {
      window.addEventListener('load', ready, { once: true });
    }

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(tipTimer);
      window.removeEventListener('load', ready);
    };
  }, [wakeMode.cold, wakeMode.show, tips.length]);

  const tip = tips[tipIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="wake-bridge"
          role="status"
          aria-live="polite"
          aria-busy="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="wake-bridge__glow" aria-hidden />
          <div className="wake-bridge__panel">
            <p className="wake-bridge__brand">
              <span className="wake-bridge__mark">8</span>
              8-bit
            </p>
            <p className="wake-bridge__stage">{WAKE_STAGES[stageIndex]}</p>

            <div className="wake-bridge__glyphs" aria-hidden>
              {glyphs.map((g, i) => (
                <motion.span
                  key={`${g}-${i}`}
                  className="wake-bridge__glyph"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                  transition={{
                    duration: 2.2,
                    delay: i * 0.12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {g}
                </motion.span>
              ))}
            </div>

            <div className="wake-bridge__bar" aria-hidden>
              <motion.span
                className="wake-bridge__bar-fill"
                animate={{ x: ['-100%', '220%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tip.title}
                className="wake-bridge__tip"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <p className="wake-bridge__tip-title">{tip.title}</p>
                <p className="wake-bridge__tip-body">{tip.body}</p>
              </motion.div>
            </AnimatePresence>

            {wakeMode.cold && (
              <p className="wake-bridge__note">
                무료 서버가 잠에서 깨는 중이에요. 조금만 기다려 주세요.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
