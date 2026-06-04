import Link from 'next/link';
import {
  SAJU_MANIFESTO,
  ABOUT_LEAD,
  COORDINATE_AXIOM,
  TWIN_PARADOX_HEADLINE,
  SITE_PHILOSOPHY_HEADLINE,
  SAJU_DETERMINISM,
  EXPLORE_PHILOSOPHY,
  HOME_CATCHPHRASE,
  HOME_HERO_INVITE,
  HOME_PROBE_NOTE,
  HOME_READING_NOTE,
} from '@/lib/philosophy/content';
import { ResumeExploreBanner } from '@/components/ResumeExploreBanner';

export default function HomePage() {
  return (
    <div className="home">
      <ResumeExploreBanner />
      <section className="hero">
        <p className="hero__manifesto">{SAJU_MANIFESTO}</p>
        <p className="hero__eyebrow">非統計 · 探究 · 共有</p>
        <h1>{HOME_CATCHPHRASE}</h1>
        <p className="hero__sub">{HOME_HERO_INVITE}</p>
        <div className="hero__actions">
          <Link href="/explore" className="btn btn--primary">
            팔자 탐구하기
          </Link>
          <Link href="/community" className="btn btn--ghost">
            탐구 커뮤니티
          </Link>
        </div>
      </section>

      <section className="home-lead" aria-labelledby="home-lead-heading">
        <h2 id="home-lead-heading" className="home-lead__headline">
          사주란
        </h2>
        <p className="home-lead__text">{ABOUT_LEAD}</p>
      </section>

      <section className="axiom" aria-labelledby="twin-paradox-heading">
        <h2 id="twin-paradox-heading" className="axiom__headline">
          {TWIN_PARADOX_HEADLINE}
        </h2>
        <blockquote className="axiom__quote">{COORDINATE_AXIOM}</blockquote>
      </section>

      <section className="site-philosophy" aria-labelledby="site-philosophy-heading">
        <h2 id="site-philosophy-heading" className="site-philosophy__headline">
          {SITE_PHILOSOPHY_HEADLINE}
        </h2>
        <h3 className="site-philosophy__topic">{SAJU_DETERMINISM.title}</h3>
        <div className="site-philosophy__body">{SAJU_DETERMINISM.body}</div>
        <h3 className="site-philosophy__topic site-philosophy__topic--sub">
          {EXPLORE_PHILOSOPHY.title}
        </h3>
        <div className="site-philosophy__body">{EXPLORE_PHILOSOPHY.body}</div>
      </section>

      <section className="home-reading" aria-labelledby="home-probe-heading">
        <h2 id="home-probe-heading" className="home-reading__headline">
          {HOME_PROBE_NOTE.headline}
        </h2>
        <div className="home-reading__body">{HOME_PROBE_NOTE.body}</div>
      </section>

      <section className="home-reading" aria-labelledby="home-reading-heading">
        <h2 id="home-reading-heading" className="home-reading__headline">
          {HOME_READING_NOTE.headline}
        </h2>
        <div className="home-reading__body">{HOME_READING_NOTE.body}</div>
      </section>

      <section className="principles">
        <div className="principle">
          <span className="principle__num">一</span>
          <h2>정확한 좌표</h2>
          <p>
            입춘·절기·경도 보정·대운까지. 만세력 수준의 데이터를 산출합니다.
            생시가 다르면 좌표가 다르다는 전제 위에서, 해석의 재료는 정밀해야 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
