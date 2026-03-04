'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { TradeJournalEditor } from './TradeJournalEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Trade } from '@/types';

interface TradeDetailProps {
  tradeId: string;
}

export function TradeDetail({ tradeId }: TradeDetailProps) {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrade() {
      const supabase = createClient();
      const { data } = await supabase
        .from('trade')
        .select('*')
        .eq('id', tradeId)
        .single();

      if (data) setTrade(data as unknown as Trade);
      setLoading(false);
    }
    fetchTrade();
  }, [tradeId]);

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a]">Loading trade...</p>
      </GlassCard>
    );
  }

  if (!trade) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a]">Trade not found</p>
        <Link href="/trades" className="text-xs text-green-500 no-underline mt-2 block">
          Back to Trades
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/trades" className="flex items-center gap-1.5 text-xs text-[#6b6b8a] hover:text-[#d4d4e8] no-underline transition-colors">
        <ArrowLeft size={14} />
        Back to Trades
      </Link>

      {/* Trade Summary */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-[#fafaff]">{trade.symbol}</h2>
            <p className="text-xs text-[#6b6b8a]">{trade.exchange} &middot; {trade.segment}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
            trade.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {trade.side}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[#4a4a6a] mb-1">Quantity</p>
            <p className="text-sm font-mono text-[#d4d4e8]">{trade.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-[#4a4a6a] mb-1">Price</p>
            <p className="text-sm font-mono text-[#d4d4e8]">{Number(trade.price).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-[#4a4a6a] mb-1">Date</p>
            <p className="text-sm text-[#d4d4e8]">
              {new Date(trade.traded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#4a4a6a] mb-1">Source</p>
            <p className="text-sm text-[#d4d4e8] capitalize">{trade.import_source.replace('_', ' ')}</p>
          </div>
        </div>
      </GlassCard>

      {/* Journal Editor */}
      <TradeJournalEditor tradeId={tradeId} />
    </div>
  );
}
