'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import type { Trade } from '@/types';

export function TradesList() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [journalStatus, setJournalStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTrades() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('trade')
        .select('*')
        .eq('user_id', user.id)
        .order('traded_at', { ascending: false })
        .limit(100);

      if (data) {
        setTrades(data as unknown as Trade[]);

        // Check journal status for each trade
        const { data: journals } = await supabase
          .from('journal_entry')
          .select('trade_id')
          .eq('user_id', user.id)
          .in('trade_id', data.map((t: { id: string }) => t.id));

        const statusMap: Record<string, boolean> = {};
        journals?.forEach((j: { trade_id: string }) => { statusMap[j.trade_id] = true; });
        setJournalStatus(statusMap);
      }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  const filtered = trades.filter(t =>
    t.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a]">Loading trades...</p>
      </GlassCard>
    );
  }

  if (trades.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a] mb-3">No trades found</p>
        <p className="text-xs text-[#4a4a6a] mb-4">
          Connect your broker or import a CSV from Settings to see trades here.
        </p>
        <Link
          href="/settings"
          className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline"
        >
          Go to Settings
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a6a]" />
        <input
          type="text"
          placeholder="Filter by symbol..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
        />
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Symbol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Side</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Date</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6b8a] uppercase">Journal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trade) => (
                <tr key={trade.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#d4d4e8]">{trade.symbol}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      trade.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#b0b0c8]">{trade.quantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#b0b0c8]">{Number(trade.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-[#6b6b8a]">
                    {new Date(trade.traded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/trades/${trade.id}`}
                      className="no-underline"
                    >
                      {journalStatus[trade.id] ? (
                        <span className="text-xs text-green-500 flex items-center justify-center gap-1">
                          <BookOpen size={12} /> Done
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          Missing
                        </span>
                      )}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <SEBIDisclaimer type="journal" />
    </div>
  );
}
