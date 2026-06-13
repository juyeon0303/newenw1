import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { SiteNav } from '@/components/SiteNav';
import { ChartProvider } from '@/contexts/ChartContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SITE_FOOTER } from '@/lib/philosophy/content';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '8-BIT',
    template: '%s | 8-BIT',
  },
  description: '8-BIT — 만세력 좌표, 벤토 리포트, 탐구·라이프스타일·커뮤니티.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '8-BIT',
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
          <ChartProvider>
            <SiteNav />
            <main className="main">{children}</main>
            <footer className="footer">
              <p lang="en">{SITE_FOOTER}</p>
            </footer>
          </ChartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
