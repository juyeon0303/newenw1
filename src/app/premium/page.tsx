import Link from 'next/link';
import { MONETIZATION_TIERS, FREE_TIER_MANIFESTO } from '@/lib/business/monetization-plan';

export const metadata = {
  title: '프리미엄',
  description: '8-BIT 인생 마스터북·운명 캘린더 — 준비 중.',
};

export default function PremiumPage() {
  return (
    <div className="premium-page">
      <header className="premium-page__header">
        <p className="premium-page__eyebrow">VALUE PRICING · 준비 중</p>
        <h1>프리미엄 존</h1>
        <p className="premium-page__lead">{FREE_TIER_MANIFESTO}</p>
        <p className="premium-page__sub">
          공부와 원리는 무료입니다. 아래 상품은 인생에서 시간과 리스크를 아끼는 가이드용이며,
          결제 연동은 추후 오픈합니다.
        </p>
      </header>

      <div className="premium-grid">
        {MONETIZATION_TIERS.filter((t) => t.id !== 'wiki_ads').map((tier) => (
          <article key={tier.id} className="premium-card">
            <p className="premium-card__price">{tier.priceHint}</p>
            <h2>{tier.title}</h2>
            <p>{tier.rationale}</p>
            <span className="premium-card__badge">COMING SOON</span>
          </article>
        ))}
      </div>

      <div className="premium-page__cta">
        <p>지금은 무료 탐색으로 충분합니다.</p>
        <Link href="/explore" className="btn btn--primary">
          명리 탐색으로
        </Link>
        <Link href="/" className="btn btn--ghost">
          8글자 추출
        </Link>
      </div>
    </div>
  );
}
