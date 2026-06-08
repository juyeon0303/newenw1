'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  gradient?: string;
  delay?: number;
}

export function GradientCard({
  children,
  className = '',
  gradient = 'from-violet-500 via-fuchsia-500 to-amber-400',
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`rounded-2xl p-[1px] bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="h-full rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/5 p-5 md:p-6">
        {children}
      </div>
    </motion.div>
  );
}
