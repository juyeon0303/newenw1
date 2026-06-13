import Link from 'next/link';
import {
  SAJU_MANIFESTO,
  ABOUT_LEAD,
  COORDINATE_AXIOM,
  TWIN_PARADOX_HEADLINE,
  SITE_PHILOSOPHY_HEADLINE,
  SAJU_DETERMINISM,
  HOME_PROBE_NOTE,
  HOME_READING_NOTE,
} from '@/lib/philosophy/content';

export const metadata = {
  title: '사이트 철학',
  description: '8-BIT가 지키는 관점.',
};

export default function PhilosophyPage() {
  return (
    <div className="home">
      <header className="wiki-page__header">
        <Link href="/" className="community-back">
          ← 처음
        </Link>
        <h1>사이트 철학</h1>
        <p className="wiki-page__sub">답답함에서 시작한, 진정성 있는 명리 아키텍처.</p>
      </header>

      <p className="hero__manifesto">{SAJU_MANIFESTO}</p>

      <section className="home-lead">
        <h2 className="home-lead__headline">사주란</h2>
        <p className="home-lead__text">{ABOUT_LEAD}</p>
      </section>

      <section className="axiom">
        <h2 className="axiom__headline">{TWIN_PARADOX_HEADLINE}</h2>
        <blockquote className="axiom__quote">{COORDINATE_AXIOM}</blockquote>
      </section>

      <section className="site-philosophy">
        <h2 className="site-philosophy__headline">{SITE_PHILOSOPHY_HEADLINE}</h2>
        <h3 className="site-philosophy__topic">{SAJU_DETERMINISM.title}</h3>
        <div className="site-philosophy__body">{SAJU_DETERMINISM.body}</div>
      </section>

      <section className="home-reading">
        <h2 className="home-reading__headline">{HOME_PROBE_NOTE.headline}</h2>
        <div className="home-reading__body">{HOME_PROBE_NOTE.body}</div>
      </section>

      <section className="home-reading">
        <h2 className="home-reading__headline">{HOME_READING_NOTE.headline}</h2>
        <div className="home-reading__body">{HOME_READING_NOTE.body}</div>
      </section>
    </div>
  );
}
