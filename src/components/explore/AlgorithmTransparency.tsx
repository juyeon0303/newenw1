'use client';

import type { TransparencyBreakdown } from '@/lib/interpretation/transparency';

interface Props {
  breakdown: TransparencyBreakdown;
  className?: string;
}

export function AlgorithmTransparency({ breakdown, className = '' }: Props) {
  return (
    <details className={`algo-transparency ${className}`.trim()}>
      <summary className="algo-transparency__summary">점수 산식 보기</summary>
      <div className="algo-transparency__body">
        <p className="algo-transparency__formula">
          <code>{breakdown.formula}</code>
        </p>
        <ul className="algo-transparency__lines">
          {breakdown.lines.map((line) => (
            <li key={line.label}>
              <span>{line.label}</span>
              <span className={line.value < 0 ? 'algo-transparency__neg' : ''}>
                {line.value >= 0 ? `+${line.value}` : line.value}
              </span>
              {line.note && <span className="algo-transparency__note">{line.note}</span>}
            </li>
          ))}
          <li className="algo-transparency__total">
            <span>결과</span>
            <strong>{breakdown.result}</strong>
          </li>
        </ul>
        <p className="algo-transparency__disclaimer">{breakdown.disclaimer}</p>
      </div>
    </details>
  );
}
