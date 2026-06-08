import Link from 'next/link';
import {
  SAJU_MANIFESTO,
  ABOUT_LEAD,
  COORDINATE_AXIOM,
  TWIN_PARADOX_HEADLINE,
  SITE_PHILOSOPHY_HEADLINE,
  SAJU_DETERMINISM,
  HOME_CATCHPHRASE,
  HOME_HERO_INVITE,
  HOME_PROBE_NOTE,
  HOME_READING_NOTE,
} from '@/lib/philosophy/content';

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-shell">
          <div className="hero-shell__inner">
            <p className="hero__eyebrow">非統計 · 探究 · 共有</p>
            <h1>{HOME_CATCHPHRASE}</h1>
            <p className="hero__sub">{HOME_HERO_INVITE}</p>
            <div className="hero__actions">
              <Link href="/analyze" className="btn btn--primary">
                8CODE 분석
              </Link>
              <Link href="/community" className="btn btn--ghost">
                커뮤니티
              </Link>
            </div>
          </div>
        </div>
        <p className="hero__manifesto">{SAJU_MANIFESTO}</p>
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
        <p className="axiom__note">
          추가 질문이 있다면 <Link href="/community">커뮤니티</Link>를 이용해 주세요.
        </p>
      </section>

      <section className="site-philosophy" aria-labelledby="site-philosophy-heading">
        <h2 id="site-philosophy-heading" className="site-philosophy__headline">
          {SITE_PHILOSOPHY_HEADLINE}
        </h2>
        <h3 className="site-philosophy__topic">{SAJU_DETERMINISM.title}</h3>
        <div className="site-philosophy__body">{SAJU_DETERMINISM.body}</div>
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
    </div>
  );
}
