'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatINR } from '@/lib/marketTime';
import { BarChart3, TrendingUp, TrendingDown, PieChart, ArrowUpDown } from 'lucide-react';

interface Trade {
  traded_at?: string;
  net_pnl?: number;
  pnl?: number;
  side?: string;
  symbol?: string;
  segment?: string;
  quantity?: number;
  price?: number;
}

export function FnOAnalytics({ trades }: { trades: Trade[] }) {
  const stats = useMemo(() => {
    const foTrades = trades.filter((t) => t.segment === 'FO');
    const eqTrades = trades.filter((t) => t.segment === 'EQ' || !t.segment);

    if (foTrades.length === 0 && eqTrades.length === 0) return null;

    const getPnl = (t: Trade) => t.net_pnl || t.pnl || 0;

    const calcStats = (arr: Trade[]) => {
      const wins = arr.filter((t) => getPnl(t) > 0);
      const losses = arr.filter((t) => getPnl(t) < 0);
      const totalPnl = arr.reduce((s, t) => s + getPnl(t), 0);
      const winRate = arr.length > 0 ? (wins.length / arr.length) * 100 : 0;
      const avgPnl = arr.length > 0 ? totalPnl / arr.length : 0;
      return { count: arr.length, wins: wins.length, losses: losses.length, totalPnl, winRate, avgPnl };
    };

    const fo = calcStats(foTrades);
    const eq = calcStats(eqTrades);

    // Expiry day analysis for F&O (Thursday typically)
    const expiryTrades = foTrades.filter((t) => {
      if (!t.traded_at) return false;
      const day = new Date(t.traded_at).getDay();
      return day === 4; // Thursday
    });
    const nonExpiryTrades = foTrades.filter((t) => {
      if (!t.traded_at) return false;
      const day = new Date(t.traded_at).getDay();
      return day !== 4;
    });

    const expiry = calcStats(expiryTrades);
    const nonExpiry = calcStats(nonExpiryTrades);

    // Buy vs Sell P&L for F&O
    const foBuys = calcStats(foTrades.filter((t) => t.side === 'BUY'));
    const foSells = calcStats(foTrades.filter((t) => t.side === 'SELL'));

    return { fo, eq, expiry, nonExpiry, foBuys, foSells, hasFO: foTrades.length > 0 };
  }, [trades]);

  if (!stats || (!stats.hasFO && stats.eq.count === 0)) return null;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-purple-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Segment Analytics</h3>
      </div>

      {/* EQ vs F&O comparison */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-cyan-500/[0.06] border border-cyan-500/10 text-center">
          <p className="text-[10px] text-[#6b6b8a] uppercase tracking-wider mb-1">Equity</p>
          <p className={`text-lg font-bold font-mono ${stats.eq.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatINR(stats.eq.totalPnl, true)}
          </p>
          <p className="text-[10px] text-[#4a4a6a]">
            {stats.eq.count} trades · {stats.eq.winRate.toFixed(0)}% win
          </p>
        </div>
        {stats.hasFO && (
          <div className="p-3 rounded-lg bg-purple-500/[0.06] border border-purple-500/10 text-center">
            <p className="text-[10px] text-[#6b6b8a] uppercase tracking-wider mb-1">F&O</p>
            <p className={`text-lg font-bold font-mono ${stats.fo.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatINR(stats.fo.totalPnl, true)}
            </p>
            <p className="text-[10px] text-[#4a4a6a]">
              {stats.fo.count} trades · {stats.fo.winRate.toFixed(0)}% win
            </p>
          </div>
        )}
      </div>

      {stats.hasFO && (
        <>
          {/* Expiry vs Non-Expiry */}
          {stats.expiry.count >= 2 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart size={12} className="text-amber-500" />
                <Tooltip text="Performance on expiry days (Thursdays) vs other days">
                  <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider cursor-help border-b border-dotted border-[#4a4a6a]">
                    Expiry Day Analysis
                  </span>
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#4a4a6a] mb-1">Expiry Days</p>
                  <p className={`text-sm font-mono ${stats.expiry.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatINR(stats.expiry.avgPnl, true)}/trade
                  </p>
                  <p className="text-[9px] text-[#4a4a6a]">{stats.expiry.winRate.toFixed(0)}% win · {stats.expiry.count} trades</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] text-[#4a4a6a] mb-1">Non-Expiry Days</p>
                  <p className={`text-sm font-mono ${stats.nonExpiry.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatINR(stats.nonExpiry.avgPnl, true)}/trade
                  </p>
                  <p className="text-[9px] text-[#4a4a6a]">{stats.nonExpiry.winRate.toFixed(0)}% win · {stats.nonExpiry.count} trades</p>
                </div>
              </div>
            </div>
          )}

          {/* Buy vs Sell for F&O */}
          {stats.foBuys.count >= 2 && stats.foSells.count >= 2 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpDown size={12} className="text-cyan-500" />
                <Tooltip text="Option buying vs option selling performance">
                  <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider cursor-help border-b border-dotted border-[#4a4a6a]">
                    Buying vs Selling
                  </span>
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-green-500/[0.03] border border-green-500/[0.08]">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp size={10} className="text-green-500" />
                    <p className="text-[9px] text-green-500/70">Buying</p>
                  </div>
                  <p className={`text-sm font-mono ${stats.foBuys.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatINR(stats.foBuys.totalPnl, true)}
                  </p>
                  <p className="text-[9px] text-[#4a4a6a]">{stats.foBuys.winRate.toFixed(0)}% · {stats.foBuys.count} trades</p>
                </div>
                <div className="p-2 rounded bg-red-500/[0.03] border border-red-500/[0.08]">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingDown size={10} className="text-red-500" />
                    <p className="text-[9px] text-red-500/70">Selling</p>
                  </div>
                  <p className={`text-sm font-mono ${stats.foSells.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatINR(stats.foSells.totalPnl, true)}
                  </p>
                  <p className="text-[9px] text-[#4a4a6a]">{stats.foSells.winRate.toFixed(0)}% · {stats.foSells.count} trades</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
