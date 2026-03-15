import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Trading Basics — BazaarSaar',
  description:
    'Free trading education for beginners in Hindi & English. Learn about trading journals, stop-loss, position sizing, emotions, and more. बिल्कुल मुफ़्त ट्रेडिंग शिक्षा।',
  openGraph: {
    title: 'Learn Trading Basics — BazaarSaar',
    description:
      'Free trading education for Indian beginners. Hindi + English lessons on journals, risk management, emotions & more.',
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
