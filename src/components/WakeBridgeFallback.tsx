import { WAKE_STAGES, WAKE_TIPS } from '@/lib/wake/content';

/** React 하이드레이션 전·SW 캐시 셸용 정적 스플래시 */
export function WakeBridgeFallback() {
  const tip = WAKE_TIPS[0];
  return (
    <div id="8bit-wake-static" className="wake-bridge wake-bridge--static" aria-live="polite">
      <div className="wake-bridge__glow" aria-hidden />
      <div className="wake-bridge__panel">
        <p className="wake-bridge__brand">
          <span className="wake-bridge__mark">8</span>
          8-bit
        </p>
        <p className="wake-bridge__stage">{WAKE_STAGES[0]}</p>
        <div className="wake-bridge__glyphs wake-bridge__glyphs--pulse" aria-hidden>
          {['甲', '乙', '子', '丑', '丙', '寅', '丁', '卯'].map((g) => (
            <span key={g} className="wake-bridge__glyph">
              {g}
            </span>
          ))}
        </div>
        <div className="wake-bridge__bar" aria-hidden>
          <span className="wake-bridge__bar-fill wake-bridge__bar-fill--css" />
        </div>
        <div className="wake-bridge__tip">
          <p className="wake-bridge__tip-title">{tip.title}</p>
          <p className="wake-bridge__tip-body">{tip.body}</p>
        </div>
      </div>
    </div>
  );
}
