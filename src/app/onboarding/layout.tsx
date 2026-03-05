import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Get Started' };

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
