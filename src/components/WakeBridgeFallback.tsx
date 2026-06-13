import { WAKE_STAGES, WAKE_TIPS } from '@/lib/wake/content';

/** React 하이드레이션 전 즉시 보이는 CSS 애니메이션 스플래시 */
export function WakeBridgeFallback() {
  const tip = WAKE_TIPS[0];
  return (
    <div id="8bit-wake-static" className="wake-bridge wake-bridge--static" aria-live="polite">
      <div className="wake-bridge__glow wake-bridge__glow--pulse" aria-hidden />
      <div className="wake-bridge__panel">
        <p className="wake-bridge__brand">
          <span className="wake-bridge__mark wake-bridge__mark--pulse">8</span>
          8-bit
        </p>
        <p className="wake-bridge__stage" id="8bit-wake-stage">
          {WAKE_STAGES[0]}
        </p>
        <div className="wake-bridge__glyphs wake-bridge__glyphs--pulse" aria-hidden>
          {['甲', '乙', '子', '丑', '丙', '寅', '丁', '卯'].map((g, i) => (
            <span
              key={g}
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
        <div className="wake-bridge__tip">
          <p className="wake-bridge__tip-title">{tip.title}</p>
          <p className="wake-bridge__tip-body">{tip.body}</p>
        </div>
      </div>
    </div>
  );
}
