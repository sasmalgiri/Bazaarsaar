import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pre-Market Checklist',
  description: 'Daily morning checklist to prepare for trading. Check mindset, market conditions, trading plan, and risk management before market opens.',
};

export default function MorningChecklistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
