'use client';

import { DailyIntelligenceCard } from '@/components/dashboard/DailyIntelligenceCard';

export default function DailyPackPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-[#fafaff] mb-6">Daily Intelligence Pack</h1>
      <DailyIntelligenceCard />
    </div>
  );
}
