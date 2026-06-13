'use client';

import { Suspense } from 'react';
import { ExploreDashboard } from '@/components/explore/ExploreDashboard';

function ExploreClientInner() {
  return (
    <div className="explore-route px-2 py-6 md:py-10 max-w-5xl mx-auto">
      <ExploreDashboard />
    </div>
  );
}

export function ExploreClient() {
  return (
    <Suspense
      fallback={
        <div className="explore-empty">
          <p>8-BIT…</p>
        </div>
      }
    >
      <ExploreClientInner />
    </Suspense>
  );
}
