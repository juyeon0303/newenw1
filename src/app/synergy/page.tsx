import { Suspense } from 'react';
import { SynergyClient } from '@/components/SynergyClient';

export const metadata = {
  title: '시너지',
  description: '두 팔자의 오행·관계 시너지와 귀인 매칭.',
};

export default function SynergyPage() {
  return (
    <Suspense fallback={<p className="synergy-muted">…</p>}>
      <SynergyClient />
    </Suspense>
  );
}
