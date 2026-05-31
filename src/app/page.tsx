import Link from 'next/link';
import { SAJU_MANIFESTO } from '@/lib/philosophy/content';

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <p className="hero__manifesto">{SAJU_MANIFESTO}</p>
        <p className="hero__eyebrow">非統計 · 非決定論 · 探究</p>
        <h1>
          사주는 답이 아니라
          <br />
          <em>기억을 꺼내는 계기</em>다
        </h1>
        <p className="hero__sub">
          만세력 데이터를 보고, 문장 읽다가 떠오른 사람·장면·순간만 골라도 됩니다.
        </p>
        <div className="hero__actions">
          <Link href="/explore" className="btn btn--primary">
            팔자 탐구하기
          </Link>
          <Link href="/about" className="btn btn--ghost">
            사주란 무엇인가
          </Link>
        </div>
      </section>

      <section className="principles">
        <div className="principle">
          <span className="principle__num">一</span>
          <h2>정확한 좌표</h2>
          <p>
            입춘·절기·경도 보정·대운까지. 만세력 수준의 데이터를 산출합니다.
            해석의 재료는 정밀해야 합니다.
          </p>
        </div>
        <div className="principle">
          <span className="principle__num">二</span>
          <h2>축을 바꿔 본다</h2>
          <p>
            월령·십성·형충·운 — 같은 팔자도 어디를 보면
            다른 기억이 떠오릅니다.
          </p>
        </div>
        <div className="principle">
          <span className="principle__num">三</span>
          <h2>탐구의 자유</h2>
          <p>
            역술가·책·앱 말이 안 맞으면, 그때 실제로 있었던 일부터
            다시 떠올려 보면 됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}
