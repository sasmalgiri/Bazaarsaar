import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import DisclaimerBanner from '@/components/ui/DisclaimerBanner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bazaarsaar.com';

export const metadata: Metadata = {
  title: {
    default: 'BazaarSaar | \u092C\u093E\u091C\u093C\u093E\u0930\u0938\u093E\u0930 - Indian Market Intelligence',
    template: '%s | BazaarSaar',
  },
  description: 'Trade journal, broker sync, and weekly analytics for swing traders, long-term investors, and options traders in the Indian stock market.',
  keywords: ['Indian stock market', 'trade journal', 'trading journal India', 'Zerodha sync', 'options trading India', 'no investment advice', 'market analytics', 'bazaarsaar'],
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'BazaarSaar',
    title: 'BazaarSaar | \u092C\u093E\u091C\u093C\u093E\u0930\u0938\u093E\u0930 - Indian Market Intelligence',
    description: 'Trade journal, broker sync, and weekly analytics for Indian market participants.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BazaarSaar - Indian Market Intelligence',
    creator: '@sasmalgiri',
  },
  robots: { index: true, follow: true },
  applicationName: 'BazaarSaar',
  category: 'Finance',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} bg-[#0a0a0f] ambient-bg`}>
        <Providers>
          <DisclaimerBanner />
          <main className="min-h-screen relative z-10">
            {children}
          </main>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
