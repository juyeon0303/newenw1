import Link from 'next/link';
import { TipBulbIcon } from '@/components/TipBulbIcon';
import { EXPLORE_TIPS } from '@/lib/philosophy/explore-tips';
import { FREE_TIER_MANIFESTO } from '@/lib/business/monetization-plan';

export const metadata = {
  title: '명리 위키',
  description: '사주 명리 오픈 아카이브 — 사장님 필력의 실전 읽기 노트.',
};

export default function WikiPage() {
  return (
    <div className="tips-page">
      <header className="tips-page__header">
        <p className="tips-page__eyebrow">OPEN ARCHIVE · 名理</p>
        <h1 className="tips-page__title">
          <TipBulbIcon className="tips-page__bulb" />
          <span>명리 위키</span>
        </h1>
        <p className="tips-page__subtitle">{FREE_TIER_MANIFESTO}</p>
        <p className="wiki-page__sub">공부하며 쌓는 칼럼. 앞으로 더 추가됩니다.</p>
        <Link href="/explore" className="btn btn--primary">
          명리 탐색
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
