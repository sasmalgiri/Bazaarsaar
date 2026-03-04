'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonaStore } from '@/lib/store/personaStore';
import { PersonaHeader } from '@/components/dashboard/PersonaHeader';
import { DailyIntelligenceCard } from '@/components/dashboard/DailyIntelligenceCard';
import { MarketOverviewCard } from '@/components/dashboard/MarketOverviewCard';
import { SignalsCard } from '@/components/dashboard/SignalsCard';
import { WatchlistCard } from '@/components/dashboard/WatchlistCard';

export default function DashboardPage() {
  const router = useRouter();
  const { persona, onboardingCompleted } = usePersonaStore();

  useEffect(() => {
    if (!onboardingCompleted || !persona) {
      router.replace('/onboarding');
    }
  }, [onboardingCompleted, persona, router]);

  if (!persona) return null;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <PersonaHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DailyIntelligenceCard />
        <MarketOverviewCard />
        <SignalsCard />
        <WatchlistCard />
      </div>
    </div>
  );
}
