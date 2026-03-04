'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { FileText } from 'lucide-react';

export function DailyIntelligenceCard() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={18} className="text-green-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Daily Intelligence Pack</h3>
      </div>

      <p className="text-xs text-[#6b6b8a] mb-4">{today}</p>

      <div className="py-8 text-center">
        <div className="text-3xl mb-3">&#128230;</div>
        <p className="text-sm text-[#6b6b8a] mb-1">Pack not yet generated</p>
        <p className="text-xs text-[#4a4a6a]">
          Your daily intelligence will appear here once the data pipeline is running.
        </p>
      </div>

      <SEBIDisclaimer type="dailyPack" />
    </GlassCard>
  );
}
