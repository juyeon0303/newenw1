import Link from 'next/link';
import { LiveChatPanel } from '@/components/live/LiveChatPanel';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '가가라이브',
  description: '8-BIT 실시간 채팅 — 유튜브·스트리밍 채팅처럼 대화가 올라옵니다.',
};

export default function LivePage() {
  return (
    <div className="live-page">
      <header className="live-page__header">
        <div>
          <p className="live-page__eyebrow">LIVE · CHAT</p>
          <h1>가가라이브</h1>
          <p className="live-page__intro">
            실시간 채팅입니다. 글·댓글은{' '}
            <Link href="/community">커뮤니티</Link>에서, 여기서는 채팅만 오갑니다.
          </p>
        </div>
        <Link href="/community" className="btn btn--ghost btn--sm">
          커뮤니티
        </Link>
      </header>

      <div className="live-page__stage">
        <div className="live-page__video-placeholder" aria-hidden>
          <span className="live-page__video-label">8-BIT LIVE</span>
          <p className="live-page__video-note">방송 영은 추후 연결 예정</p>
        </div>
        <LiveChatPanel />
      </div>
    </div>
  );
}
