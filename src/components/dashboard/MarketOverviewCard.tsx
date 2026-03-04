'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MOCK_INDICES = [
  { symbol: 'NIFTY 50', value: 22450.5, change: 125.3, changePercent: 0.56 },
  { symbol: 'BANK NIFTY', value: 47890.25, change: -98.75, changePercent: -0.21 },
  { symbol: 'NIFTY IT', value: 38120.0, change: 245.5, changePercent: 0.65 },
  { symbol: 'NIFTY PHARMA', value: 17845.75, change: -42.3, changePercent: -0.24 },
];

export function MarketOverviewCard() {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-green-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Market Overview</h3>
      </div>

      <div className="space-y-3">
        {MOCK_INDICES.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <div key={idx.symbol} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-sm text-[#b0b0c8]">{idx.symbol}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-[#d4d4e8]">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <div className={`flex items-center gap-1 text-xs font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-[#4a4a6a] mt-3">Placeholder data. Live data coming soon.</p>
    </GlassCard>
  );
}
