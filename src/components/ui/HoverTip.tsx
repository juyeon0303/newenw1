'use client';

import type { ReactNode } from 'react';

interface Props {
  tip: string;
  children: ReactNode;
  className?: string;
}

export function HoverTip({ tip, children, className = '' }: Props) {
  return (
    <span className={`hover-tip ${className}`.trim()}>
      {children}
      <span className="hover-tip__popup" role="tooltip">
        {tip}
      </span>
    </span>
  );
}
