import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { SiteNav } from '@/components/SiteNav';
import { WakeBridge } from '@/components/WakeBridge';
import { WakeBridgeFallback } from '@/components/WakeBridgeFallback';
import { ChartProvider } from '@/contexts/ChartContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SITE_FOOTER } from '@/lib/philosophy/content';
import { WAKE_STAGES } from '@/lib/wake/content';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '8-bit',
    template: '%s | 8-bit',
  },
  description: '8-bit — 만세력 좌표, 벤토 리포트, 탐구·라이프스타일·커뮤니티.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '8-bit',
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
        <WakeBridgeFallback />
        <WakeBridge />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=${JSON.stringify(WAKE_STAGES)};var i=0,el=document.getElementById('8bit-wake-stage');if(el){setInterval(function(){i=(i+1)%s.length;el.textContent=s[i];},2400);}function hide(){var n=document.getElementById('8bit-wake-static');if(n)n.classList.add('wake-bridge--exit');}setTimeout(hide,10000);window.__8bitHideWakeStatic=hide;})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`,
          }}
        />
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
