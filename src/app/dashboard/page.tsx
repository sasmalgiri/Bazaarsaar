'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonaStore } from '@/lib/store/personaStore';
import { PersonaHeader } from '@/components/dashboard/PersonaHeader';
import { WatchlistCard } from '@/components/dashboard/WatchlistCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeftRight, CalendarCheck, Link2 } from 'lucide-react';
import Link from 'next/link';

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
        {/* Sync Status */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={18} className="text-green-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Broker Connection</h3>
          </div>
          <div className="py-6 text-center">
            <p className="text-sm text-[#6b6b8a] mb-3">No broker connected yet</p>
            <Link
              href="/settings"
              className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline"
            >
              Connect Zerodha
            </Link>
          </div>
        </GlassCard>

        <WatchlistCard />

        {/* Recent Trades */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight size={18} className="text-cyan-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Recent Trades</h3>
          </div>
          <div className="py-6 text-center">
            <p className="text-sm text-[#6b6b8a] mb-1">No trades yet</p>
            <p className="text-xs text-[#4a4a6a]">
              Connect your broker or import a CSV to see your trades here.
            </p>
          </div>
        </GlassCard>

        {/* Weekly Summary */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck size={18} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">This Week</h3>
          </div>
          <div className="py-6 text-center">
            <p className="text-sm text-[#6b6b8a] mb-1">No weekly data yet</p>
            <p className="text-xs text-[#4a4a6a]">
              Your weekly summary will appear once you have trades.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
