import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { SiteNav } from '@/components/SiteNav';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SITE_FOOTER } from '@/lib/philosophy/content';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '8CODE · 사주 탐구',
    template: '%s | 8CODE · 사주 탐구',
  },
  description: '8CODE(에잇코드) — 만세력 좌표, 벤토 리포트, 탐구·라이프스타일·커뮤니티.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '8CODE',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#07070f',
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
      <body className={`${geistSans.variable} antialiased`}>
        <LocaleProvider>
          <SiteNav />
          <main className="main">{children}</main>
          <footer className="footer">
            <p lang="en">{SITE_FOOTER}</p>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
