import Link from 'next/link';
import {
  WHAT_SAJU_IS_NOT,
  SAJU_MANIFESTO,
  COORDINATE_AXIOM,
  TWIN_PARADOX_HEADLINE,
} from '@/lib/philosophy/content';

export const metadata = {
  title: '사주란 — 사주 탐구',
  description: '사주는 통계도, 결정론도 아닙니다.',
};

export default function AboutPage() {
  return (
    <article className="about">
      <p className="about__manifesto">{SAJU_MANIFESTO}</p>
      <h1>사주란 무엇인가</h1>
      <p className="about__lead">
        사주(四柱)는 생년월일시를 음양오행·간지의 좌표로 옮긴 <em>해석의 틀</em>이다.
        과학적 예측 모델이 아니라, 동아시아 철학·신비주의·상징학의 전통 안에서
        자아와 시간을 성찰하는 언어에 가깝다.
      </p>

      <section className="about__axiom">
        <h2>{TWIN_PARADOX_HEADLINE}</h2>
        <blockquote className="about__axiom-quote">{COORDINATE_AXIOM}</blockquote>
      </section>

      <section>
        <h2>사주가 아닌 것</h2>
        <div className="about__cards">
          {WHAT_SAJU_IS_NOT.map((item) => (
            <div key={item.title} className="about__card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>그러면 어떻게 읽는가</h2>
        <ol className="about__steps">
          <li>
            <strong>데이터를 본다</strong> — 년·월·일·시의 간지, 십성, 지장간, 12운성, 형충회합, 운(대운·세운).
            이것은 &lsquo;만세력&rsquo;이 산출하는 좌표다.
          </li>
          <li>
            <strong>연결해서 본다</strong> — 구조·계절(월령)·운(대운·세운)을
            한 덩어리로 놓고 관계를 본다.
          </li>
          <li>
            <strong>질문을 세운다</strong> — &lsquo;무엇이 강한가&rsquo;보다
            &lsquo;그때 누가 있었는지&rsquo;, &lsquo;몸이 어떻게 반응했는지&rsquo;를 먼저 떠올린다.
          </li>
          <li>
            <strong>다시 본다</strong> — 해석이 마음에 들지 않으면,
            다른 축(월령·십성·운·형충)에서 읽어 본다.
          </li>
        </ol>
      </section>

      <section>
        <h2>이 사이트의 입장</h2>
        <p>
          우리는 사주를 &lsquo;맞추면 끝&rsquo;인 점술이 아니라 &lsquo;끝없이 질문할 수 있는&rsquo; 탐구 도구로
          제공한다. 입춘·절기·경도 보정·대운까지 데이터를 정밀하게 산출하되,
          해석은 사용자의 사유에 맡긴다.
        </p>
      </section>

      <Link href="/explore" className="btn btn--primary">
        팔자 탐구 시작
      </Link>
    </article>
  );
}
