import Link from 'next/link';
import { TipBulbIcon } from '@/components/TipBulbIcon';
import { EXPLORE_TIPS } from '@/lib/philosophy/explore-tips';

export const metadata = {
  title: '탐구 TIP',
  description: '팔자 탐구에 도움이 되는 실전 TIP.',
};

export default function TipsPage() {
  return (
    <div className="tips-page">
      <header className="tips-page__header">
        <p className="tips-page__eyebrow">探究 · TIP</p>
        <h1 className="tips-page__title">
          <TipBulbIcon className="tips-page__bulb" />
          <span>탐구 TIP</span>
        </h1>
        <p className="tips-page__subtitle">앞으로 더 추가될 예정입니다.</p>
        <Link href="/analyze" className="btn btn--primary">
          8CODE 분석
        </Link>
      </header>

      <div className="tips-list">
        {EXPLORE_TIPS.map((tip) => (
          <article key={tip.id} className="tips-card" id={tip.id}>
            <h2 className="tips-card__title">{tip.title}</h2>
            <div className="tips-card__body">{tip.body}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
