'use client';

import { TradesList } from '@/components/trades/TradesList';
import { ArrowLeftRight } from 'lucide-react';

export default function TradesPage() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftRight size={24} className="text-cyan-500" />
        <h1 className="text-2xl font-bold text-[#fafaff]">Trades</h1>
      </div>
      <TradesList />
    </div>
  );
}
