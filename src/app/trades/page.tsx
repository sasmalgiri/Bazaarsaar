'use client';

import { TradesList } from '@/components/trades/TradesList';
import { ArrowLeftRight } from 'lucide-react';

export default function TradesPage() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ArrowLeftRight size={24} className="text-cyan-500" />
          <h1 className="text-2xl font-bold text-[#fafaff]">Your Trades</h1>
        </div>
        <p className="text-sm text-[#6b6b8a] ml-[36px]">
          Every time you buy or sell a stock, that&apos;s a &quot;trade.&quot; This page shows all your trades in one place — like a diary of your buying and selling.
        </p>
        <p className="text-[11px] text-amber-500/50 ml-[36px] mt-0.5" lang="hi">
          जब भी आप कोई stock खरीदते या बेचते हैं, उसे &quot;trade&quot; कहते हैं। यह page आपके सभी trades दिखाता है — जैसे आपकी खरीद-बिक्री की डायरी।
        </p>
      </div>
      <TradesList />
    </div>
  );
}
