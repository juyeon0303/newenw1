'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  WAKE_EARTHLY,
  WAKE_HEAVENLY,
  WAKE_STAGES,
  WAKE_TIPS,
} from '@/lib/wake/content';

const TIP_INTERVAL_MS = 4200;
const STAGE_INTERVAL_MS = 2400;
const MIN_FAST_MS = 700;
const MIN_SLOW_MS = 2200;
const MAX_VISIBLE_MS = 4500;
const MAX_COLD_MS = 10000;
const COLD_WAKE_MS = 2800;

function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function isColdWake(): boolean {
  if (typeof performance === 'undefined') return false;
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav) return false;
  return nav.responseStart - nav.requestStart > COLD_WAKE_MS;
}

/** React 트리 밖 DOM 삭제 금지 — class만 토글 */
function hideStaticSplash() {
  document.getElementById('8bit-wake-static')?.classList.add('wake-bridge--exit');
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
  const cold = useMemo(() => isColdWake(), []);

  const [visible, setVisible] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    hideStaticSplash();

    const stageTimer = window.setInterval(() => {
      setStageIndex((i) => (i + 1) % WAKE_STAGES.length);
    }, STAGE_INTERVAL_MS);

    const tipTimer = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, TIP_INTERVAL_MS);

    const started = performance.now();
    const minMs = cold ? MIN_SLOW_MS : MIN_FAST_MS;
    const maxMs = cold ? MAX_COLD_MS : MAX_VISIBLE_MS;

    const dismiss = () => {
      hideStaticSplash();
      setExiting(true);
      window.setTimeout(() => setVisible(false), 380);
    };

    const scheduleDismiss = () => {
      const elapsed = performance.now() - started;
      const wait = Math.max(0, minMs - elapsed);
      return window.setTimeout(dismiss, wait);
    };

    const minTimer = scheduleDismiss();
    const safetyTimer = window.setTimeout(dismiss, maxMs);

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(tipTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [cold, tips.length]);

  if (!visible) return null;

  const tip = tips[tipIndex];

  return (
    <div
      id="8bit-wake-bridge"
      className={`wake-bridge${exiting ? ' wake-bridge--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div className="wake-bridge__glow wake-bridge__glow--pulse" aria-hidden />
      <div className="wake-bridge__panel">
        <p className="wake-bridge__brand">
          <span className="wake-bridge__mark wake-bridge__mark--pulse">8</span>
          8-bit
        </p>
        <p className="wake-bridge__stage" key={stageIndex}>
          {WAKE_STAGES[stageIndex]}
        </p>

        <div className="wake-bridge__glyphs wake-bridge__glyphs--pulse" aria-hidden>
          {glyphs.map((g, i) => (
            <span
              key={`${g}-${i}`}
              className="wake-bridge__glyph"
              style={{ animationDelay: `${i * 0.14}s` }}
            >
              {g}
            </span>
          ))}
        </div>

        <div className="wake-bridge__bar" aria-hidden>
          <span className="wake-bridge__bar-fill wake-bridge__bar-fill--css" />
        </div>

        <div className="wake-bridge__tip" key={tip.title}>
          <p className="wake-bridge__tip-title">{tip.title}</p>
          <p className="wake-bridge__tip-body">{tip.body}</p>
        </div>

        {cold && (
          <p className="wake-bridge__note">
            무료 서버가 잠에서 깨는 중이에요. 곧 열립니다.
          </p>
        )}
      </div>
    </div>
  );
}
