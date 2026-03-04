'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { Zap } from 'lucide-react';
import { usePersonaStore } from '@/lib/store/personaStore';

export function SignalsCard() {
  const { persona } = usePersonaStore();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={18} className="text-yellow-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Recent Signals</h3>
        {persona && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#6b6b8a] ml-auto">
            {persona.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="py-8 text-center">
        <div className="text-3xl mb-3">&#128276;</div>
        <p className="text-sm text-[#6b6b8a] mb-1">No signals yet</p>
        <p className="text-xs text-[#4a4a6a]">
          Signals will appear here once the analysis engine is active.
        </p>
      </div>

      <SEBIDisclaimer type="signal" />
    </GlassCard>
  );
}
