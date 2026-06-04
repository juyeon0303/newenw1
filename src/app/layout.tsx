import type { Metadata, Viewport } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { SITE_FOOTER } from '@/lib/philosophy/content';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '사주 탐구',
    template: '%s | 사주 탐구',
  },
  description: '만세력 좌표 산출과 탐구·커뮤니티 중심의 사주 사이트. 해설보다 질문과 나눔.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '사주탐구',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1814',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SiteNav />
        <main className="main">{children}</main>
        <footer className="footer">
          <p lang="en">{SITE_FOOTER}</p>
        </footer>
      </body>
    </html>
  );
}
