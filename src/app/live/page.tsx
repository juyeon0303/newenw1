import Link from 'next/link';
import { LiveChatPanel } from '@/components/live/LiveChatPanel';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '실시간 채팅',
  description: '8-BIT 커뮤니티 실시간 채팅 — 유튜브·스트리밍 채팅처럼 대화가 올라옵니다.',
};

export default function LivePage() {
  return (
    <div className="live-page">
      <header className="live-page__header">
        <div>
          <p className="live-page__eyebrow">LIVE · CHAT</p>
          <h1>실시간 채팅</h1>
          <p className="live-page__intro">
            커뮤니티 안의 실시간 채팅입니다. 글·댓글은{' '}
            <Link href="/community">커뮤니티 목록</Link>에서 확인할 수 있습니다.
          </p>
        </div>
        <Link href="/community" className="btn btn--ghost btn--sm">
          ← 커뮤니티
        </Link>
      </header>

      <LiveChatPanel />
    </div>
  );
}
