'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';
import { formatINR } from '@/lib/marketTime';

interface Trade {
  id: string;
  symbol: string;
  side?: string;
  price?: number;
  quantity?: number;
  net_pnl?: number;
  pnl?: number;
  traded_at?: string;
}

interface RecentTradesTableProps {
  trades: Trade[];
}

export function RecentTradesTable({ trades }: RecentTradesTableProps) {
  const recent = trades.slice(0, 10);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={18} className="text-cyan-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Recent Trades</h3>
        </div>
        {trades.length > 10 && (
          <Link href="/trades" className="text-[10px] text-green-500 hover:text-green-400 no-underline">
            View all →
          </Link>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#6b6b8a] mb-1">No trades yet</p>
          <p className="text-xs text-[#4a4a6a]">Connect your broker or import a CSV.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">Symbol</th>
                <th className="text-left text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">Side</th>
                <th className="text-right text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">Qty</th>
                <th className="text-right text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">Price</th>
                <th className="text-right text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">P&L</th>
                <th className="text-right text-[10px] text-[#4a4a6a] uppercase tracking-wider pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => {
                const pnl = t.net_pnl || t.pnl || 0;
                return (
                  <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5">
                      <Link href={`/trades/${t.id}`} className="text-[#d4d4e8] font-medium hover:text-green-500 no-underline transition-colors">
                        {t.symbol}
                      </Link>
                    </td>
                    <td className={`py-2.5 ${t.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.side || '--'}
                    </td>
                    <td className="py-2.5 text-right text-[#6b6b8a]">{t.quantity || '--'}</td>
                    <td className="py-2.5 text-right text-[#6b6b8a]">
                      {t.price ? formatINR(t.price) : '--'}
                    </td>
                    <td className={`py-2.5 text-right font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pnl >= 0 ? '+' : ''}{formatINR(pnl)}
                    </td>
                    <td className="py-2.5 text-right text-[#4a4a6a]">
                      {t.traded_at ? new Date(t.traded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
