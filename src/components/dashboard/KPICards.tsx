'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { TrendingUp, TrendingDown, Target, BarChart3, Flame, Scale } from 'lucide-react';
import { formatINR } from '@/lib/marketTime';

interface KPICardsProps {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  netPnl: number;
  avgWin: number;
  avgLoss: number;
  currentStreak: number; // positive = win streak, negative = loss streak
}

export function KPICards({ totalTrades, winCount, lossCount, netPnl, avgWin, avgLoss, currentStreak }: KPICardsProps) {
  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
  const riskReward = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;
  const streakLabel = currentStreak > 0
    ? `${currentStreak}W`
    : currentStreak < 0
      ? `${Math.abs(currentStreak)}L`
      : '--';
  const streakColor = currentStreak > 0 ? 'text-green-500' : currentStreak < 0 ? 'text-red-500' : 'text-[#6b6b8a]';

  const kpis = [
    {
      label: 'Total Trades',
      tooltip: 'Total number of completed trades imported',
      value: totalTrades.toString(),
      icon: BarChart3,
      color: 'text-cyan-500',
    },
    {
      label: 'Win Rate',
      tooltip: 'Percentage of trades with positive P&L',
      value: `${winRate.toFixed(1)}%`,
      sub: `${winCount}W / ${lossCount}L`,
      icon: Target,
      color: winRate >= 50 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Net P&L',
      tooltip: 'Total profit minus total loss across all trades',
      value: formatINR(netPnl, true),
      icon: netPnl >= 0 ? TrendingUp : TrendingDown,
      color: netPnl >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Avg Win / Loss',
      tooltip: 'Risk-Reward ratio: how much you win vs lose per trade on average. Above 1.5 is good.',
      value: riskReward > 0 ? `${riskReward.toFixed(2)}R` : '--',
      sub: riskReward > 0 ? `${formatINR(avgWin, true)} / ${formatINR(Math.abs(avgLoss), true)}` : undefined,
      icon: Scale,
      color: riskReward >= 1.5 ? 'text-green-500' : riskReward >= 1 ? 'text-amber-500' : 'text-red-500',
    },
    {
      label: 'Streak',
      tooltip: 'Current consecutive wins (W) or losses (L)',
      value: streakLabel,
      icon: Flame,
      color: streakColor,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <GlassCard key={kpi.label} className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <kpi.icon size={14} className={kpi.color} />
            <Tooltip text={kpi.tooltip}>
              <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider cursor-help border-b border-dotted border-[#4a4a6a]">
                {kpi.label}
              </span>
            </Tooltip>
          </div>
          <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          {kpi.sub && (
            <p className="text-[10px] text-[#4a4a6a] mt-0.5">{kpi.sub}</p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
