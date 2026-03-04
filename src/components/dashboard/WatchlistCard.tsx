'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Eye } from 'lucide-react';
import { usePersonaStore } from '@/lib/store/personaStore';
import { useRouter } from 'next/navigation';

export function WatchlistCard() {
  const { watchlist } = usePersonaStore();
  const router = useRouter();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-cyan-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Your Watchlist</h3>
        </div>
        <span className="text-xs font-mono text-[#6b6b8a]">{watchlist.length} stocks</span>
      </div>

      {watchlist.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#6b6b8a] mb-3">No stocks in your watchlist</p>
          <button
            onClick={() => {
              usePersonaStore.getState().setOnboardingStep(1);
              usePersonaStore.getState().setOnboardingCompleted(false);
              router.push('/onboarding');
            }}
            className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all"
          >
            Add Stocks
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlist.slice(0, 10).map((symbol) => (
            <div key={symbol} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-sm font-mono text-[#d4d4e8]">{symbol}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6b6b8a]">--</span>
                <span className="text-xs font-mono text-[#4a4a6a]">--%</span>
              </div>
            </div>
          ))}
          {watchlist.length > 10 && (
            <p className="text-xs text-[#4a4a6a] text-center pt-2">
              +{watchlist.length - 10} more
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
