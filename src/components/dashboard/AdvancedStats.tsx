'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatINR } from '@/lib/marketTime';
import {
  Ratio,
  Crosshair,
  TrendingDown,
  CalendarCheck,
  CalendarX,
  CalendarDays,
  BarChart3,
  Trophy,
  Skull,
  Activity,
} from 'lucide-react';

interface Trade {
  traded_at?: string;
  net_pnl?: number;
  pnl?: number;
  side?: string;
  symbol?: string;
  quantity?: number;
  price?: number;
  segment?: string;
}

interface AdvancedStatsProps {
  trades: Trade[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

function getPnl(t: Trade): number {
  return t.net_pnl ?? t.pnl ?? 0;
}

function getDateKey(t: Trade): string | null {
  if (!t.traded_at) return null;
  const d = new Date(t.traded_at);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export function AdvancedStats({ trades }: AdvancedStatsProps) {
  const stats = useMemo(() => {
    if (!trades || trades.length === 0) return null;

    // --- Per-trade metrics ---
    const pnls = trades.map(getPnl);
    const wins = pnls.filter((p) => p > 0);
    const losses = pnls.filter((p) => p < 0);

    const totalProfit = wins.reduce((s, v) => s + v, 0);
    const totalLoss = losses.reduce((s, v) => s + Math.abs(v), 0);

    // Profit Factor
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    // Expectancy
    const winRate = trades.length > 0 ? wins.length / trades.length : 0;
    const lossRate = trades.length > 0 ? losses.length / trades.length : 0;
    const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
    const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
    const expectancy = winRate * avgWin - lossRate * avgLoss;

    // Largest Win / Loss
    const largestWin = wins.length > 0 ? Math.max(...wins) : 0;
    const largestLoss = losses.length > 0 ? Math.min(...pnls.filter((p) => p < 0)) : 0;

    // --- Daily aggregation ---
    const dailyMap = new Map<string, { pnl: number; count: number; date: string }>();
    for (const t of trades) {
      const key = getDateKey(t);
      if (!key) continue;
      const existing = dailyMap.get(key) || { pnl: 0, count: 0, date: key };
      existing.pnl += getPnl(t);
      existing.count += 1;
      dailyMap.set(key, existing);
    }

    const dailyEntries = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const tradingDays = dailyEntries.length;

    // Max Drawdown
    let peak = 0;
    let cumPnl = 0;
    let maxDrawdown = 0;
    let peakValue = 0;
    for (const day of dailyEntries) {
      cumPnl += day.pnl;
      if (cumPnl > peak) {
        peak = cumPnl;
        peakValue = peak;
      }
      const dd = peak - cumPnl;
      if (dd > maxDrawdown) maxDrawdown = dd;
    }
    const maxDrawdownPct = peakValue > 0 ? (maxDrawdown / peakValue) * 100 : 0;

    // Best / Worst Day
    let bestDay = { pnl: -Infinity, date: '' };
    let worstDay = { pnl: Infinity, date: '' };
    for (const day of dailyEntries) {
      if (day.pnl > bestDay.pnl) bestDay = { pnl: day.pnl, date: day.date };
      if (day.pnl < worstDay.pnl) worstDay = { pnl: day.pnl, date: day.date };
    }
    if (bestDay.pnl === -Infinity) bestDay = { pnl: 0, date: '--' };
    if (worstDay.pnl === Infinity) worstDay = { pnl: 0, date: '--' };

    // Avg Trades/Day
    const avgTradesPerDay = tradingDays > 0 ? trades.length / tradingDays : 0;

    // Sharpe Ratio (annualized from daily returns)
    const dailyReturns = dailyEntries.map((d) => d.pnl);
    const meanReturn = dailyReturns.length > 0 ? dailyReturns.reduce((s, v) => s + v, 0) / dailyReturns.length : 0;
    const variance =
      dailyReturns.length > 1
        ? dailyReturns.reduce((s, v) => s + (v - meanReturn) ** 2, 0) / (dailyReturns.length - 1)
        : 0;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0;

    // Day-of-Week Analysis (Mon=1 ... Fri=5)
    const dowStats: { wins: number; total: number }[] = Array.from({ length: 5 }, () => ({
      wins: 0,
      total: 0,
    }));
    for (const day of dailyEntries) {
      const d = new Date(day.date);
      const dow = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
      if (dow >= 1 && dow <= 5) {
        dowStats[dow - 1].total += 1;
        if (day.pnl > 0) dowStats[dow - 1].wins += 1;
      }
    }
    const dowWinRates = dowStats.map((s) => (s.total > 0 ? Math.round((s.wins / s.total) * 100) : 0));

    return {
      profitFactor,
      expectancy,
      maxDrawdown,
      maxDrawdownPct,
      bestDay,
      worstDay,
      avgTradesPerDay,
      largestWin,
      largestLoss,
      sharpeRatio,
      dowWinRates,
      dowStats,
    };
  }, [trades]);

  if (!stats) {
    return (
      <GlassCard className="p-6">
        <p className="text-sm text-[#6b6b8a]">No trade data available for advanced statistics.</p>
      </GlassCard>
    );
  }

  const {
    profitFactor,
    expectancy,
    maxDrawdown,
    maxDrawdownPct,
    bestDay,
    worstDay,
    avgTradesPerDay,
    largestWin,
    largestLoss,
    sharpeRatio,
    dowWinRates,
    dowStats,
  } = stats;

  function formatDate(dateStr: string): string {
    if (!dateStr || dateStr === '--') return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  const cards = [
    {
      label: 'Profit Factor',
      tooltip: 'Total profits divided by total losses. Above 1.5 is considered good.',
      value: profitFactor === Infinity ? 'No Losses' : profitFactor.toFixed(2),
      icon: Ratio,
      color:
        profitFactor === Infinity || profitFactor >= 1.5
          ? 'text-green-500'
          : profitFactor >= 1
            ? 'text-amber-500'
            : 'text-red-500',
    },
    {
      label: 'Expectancy',
      tooltip: '(Win% x Avg Win) - (Loss% x Avg Loss). Positive means each trade is expected to be profitable on average.',
      value: formatINR(expectancy, true),
      sub: 'per trade',
      icon: Crosshair,
      color: expectancy > 0 ? 'text-green-500' : expectancy < 0 ? 'text-red-500' : 'text-[#6b6b8a]',
    },
    {
      label: 'Max Drawdown',
      tooltip: 'Largest peak-to-trough decline in cumulative P&L. Lower is better.',
      value: formatINR(maxDrawdown, true),
      sub: maxDrawdownPct > 0 ? `${maxDrawdownPct.toFixed(1)}% from peak` : undefined,
      icon: TrendingDown,
      color: maxDrawdownPct > 20 ? 'text-red-500' : maxDrawdownPct > 10 ? 'text-amber-500' : 'text-green-500',
    },
    {
      label: 'Best Day',
      tooltip: 'Highest single-day P&L across all trading days.',
      value: formatINR(bestDay.pnl, true),
      sub: formatDate(bestDay.date),
      icon: CalendarCheck,
      color: 'text-green-500',
    },
    {
      label: 'Worst Day',
      tooltip: 'Lowest single-day P&L across all trading days.',
      value: formatINR(worstDay.pnl, true),
      sub: formatDate(worstDay.date),
      icon: CalendarX,
      color: 'text-red-500',
    },
    {
      label: 'Avg Trades/Day',
      tooltip: 'Average number of trades executed per trading day.',
      value: avgTradesPerDay.toFixed(1),
      icon: CalendarDays,
      color: 'text-cyan-500',
    },
    {
      label: 'Largest Win',
      tooltip: 'Single largest winning trade amount.',
      value: formatINR(largestWin, true),
      icon: Trophy,
      color: 'text-green-500',
    },
    {
      label: 'Largest Loss',
      tooltip: 'Single largest losing trade amount.',
      value: formatINR(largestLoss, true),
      icon: Skull,
      color: 'text-red-500',
    },
    {
      label: 'Sharpe Ratio',
      tooltip: 'Risk-adjusted return: (avg daily return / std dev) x sqrt(252). Above 1 is decent, above 2 is excellent.',
      value: sharpeRatio.toFixed(2),
      icon: Activity,
      color:
        sharpeRatio >= 2
          ? 'text-green-500'
          : sharpeRatio >= 1
            ? 'text-amber-500'
            : 'text-red-500',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 size={16} className="text-cyan-500" />
        <h2 className="text-sm font-semibold text-[#d4d4e8]">Advanced Statistics</h2>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <GlassCard key={card.label} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={14} className={card.color} />
              <Tooltip text={card.tooltip}>
                <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider cursor-help border-b border-dotted border-[#4a4a6a]">
                  {card.label}
                </span>
              </Tooltip>
            </div>
            <p className={`text-xl font-bold font-mono ${card.color}`}>{card.value}</p>
            {card.sub && (
              <p className="text-[10px] text-[#4a4a6a] mt-0.5">{card.sub}</p>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Day-of-Week Analysis — wider card */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-cyan-500" />
          <Tooltip text="Win rate breakdown by day of the week. Helps identify your most and least profitable days.">
            <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider cursor-help border-b border-dotted border-[#4a4a6a]">
              Day-of-Week Win Rate
            </span>
          </Tooltip>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {DAY_LABELS.map((day, i) => {
            const rate = dowWinRates[i];
            const total = dowStats[i].total;
            const barColor =
              rate >= 60 ? 'bg-green-500' : rate >= 45 ? 'bg-amber-500' : total > 0 ? 'bg-red-500' : 'bg-white/[0.06]';
            const textColor =
              rate >= 60 ? 'text-green-500' : rate >= 45 ? 'text-amber-500' : total > 0 ? 'text-red-500' : 'text-[#4a4a6a]';

            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-[#6b6b8a] font-medium">{day}</span>
                {/* Bar container */}
                <div className="w-full h-20 bg-white/[0.04] rounded relative flex items-end justify-center overflow-hidden">
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${barColor}`}
                    style={{ height: total > 0 ? `${Math.max(rate, 4)}%` : '0%' }}
                  />
                </div>
                <span className={`text-xs font-bold font-mono ${textColor}`}>
                  {total > 0 ? `${rate}%` : '--'}
                </span>
                <span className="text-[9px] text-[#4a4a6a]">
                  {total > 0 ? `${total}d` : 'no data'}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
