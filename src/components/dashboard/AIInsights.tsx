'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatINR } from '@/lib/marketTime';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Trophy,
  Calendar,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Trade {
  traded_at?: string;
  net_pnl?: number;
  pnl?: number;
  side?: string;
  symbol?: string;
  quantity?: number;
  price?: number;
}

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'negative' | 'achievement';
  icon: LucideIcon;
  text: string;
  confidence: number; // 0-1
  priority: number; // higher = more relevant
}

interface AIInsightsProps {
  trades: Trade[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getPnl(trade: Trade): number {
  return trade.net_pnl ?? trade.pnl ?? 0;
}

function isWin(trade: Trade): boolean {
  return getPnl(trade) > 0;
}

function getConfidence(sampleSize: number, minRequired: number): number {
  if (sampleSize < minRequired) return 0;
  // Logarithmic confidence: ramps from 0.3 at min to ~1.0 at 10x min
  return Math.min(1, 0.3 + 0.7 * Math.log10(sampleSize / minRequired));
}

export function AIInsights({ trades }: AIInsightsProps) {
  const insights = useMemo(() => {
    if (!trades || trades.length < 3) return [];

    const results: Insight[] = [];

    // ── Pre-compute common aggregates ────────────────────────────

    const tradesWithPnl = trades.filter((t) => getPnl(t) !== 0);
    const totalTrades = tradesWithPnl.length;

    // Group by symbol
    const bySymbol = new Map<string, Trade[]>();
    for (const t of tradesWithPnl) {
      if (!t.symbol) continue;
      const arr = bySymbol.get(t.symbol) || [];
      arr.push(t);
      bySymbol.set(t.symbol, arr);
    }

    // Group by date string (YYYY-MM-DD)
    const byDate = new Map<string, Trade[]>();
    for (const t of tradesWithPnl) {
      if (!t.traded_at) continue;
      const dateKey = t.traded_at.slice(0, 10);
      const arr = byDate.get(dateKey) || [];
      arr.push(t);
      byDate.set(dateKey, arr);
    }

    // ── 1. Best performing symbol ────────────────────────────────

    const symbolStats = Array.from(bySymbol.entries())
      .filter(([, arr]) => arr.length >= 5)
      .map(([symbol, arr]) => {
        const wins = arr.filter(isWin).length;
        const winRate = (wins / arr.length) * 100;
        const totalPnl = arr.reduce((sum, t) => sum + getPnl(t), 0);
        return { symbol, count: arr.length, wins, winRate, totalPnl };
      });

    if (symbolStats.length > 0) {
      const best = symbolStats.reduce((a, b) =>
        a.winRate > b.winRate || (a.winRate === b.winRate && a.totalPnl > b.totalPnl) ? a : b
      );
      if (best.winRate >= 50) {
        results.push({
          id: 'best-symbol',
          type: 'positive',
          icon: TrendingUp,
          text: `${best.symbol} is your best symbol with ${Math.round(best.winRate)}% win rate across ${best.count} trades`,
          confidence: getConfidence(best.count, 5),
          priority: 90,
        });
      }
    }

    // ── 2. Worst performing symbol ───────────────────────────────

    if (symbolStats.length > 0) {
      const worst = symbolStats.reduce((a, b) =>
        a.winRate < b.winRate || (a.winRate === b.winRate && a.totalPnl < b.totalPnl) ? a : b
      );
      if (worst.winRate < 50) {
        results.push({
          id: 'worst-symbol',
          type: 'negative',
          icon: TrendingDown,
          text: `${worst.symbol} is your weakest symbol (${Math.round(worst.winRate)}% win rate) \u2014 consider reducing position size`,
          confidence: getConfidence(worst.count, 5),
          priority: 85,
        });
      }
    }

    // ── 3. Time-based pattern (first hour vs rest) ───────────────

    const tradesWithTime = tradesWithPnl.filter((t) => t.traded_at && t.traded_at.length > 10);
    if (tradesWithTime.length >= 10) {
      const firstHour: Trade[] = [];
      const rest: Trade[] = [];
      for (const t of tradesWithTime) {
        const timePart = t.traded_at!.slice(11, 16); // HH:MM
        const hour = parseInt(timePart.slice(0, 2), 10);
        const min = parseInt(timePart.slice(3, 5), 10);
        const timeNum = hour * 100 + min;
        if (timeNum >= 915 && timeNum <= 1015) {
          firstHour.push(t);
        } else {
          rest.push(t);
        }
      }

      if (firstHour.length >= 5 && rest.length >= 5) {
        const firstHourAvg = firstHour.reduce((s, t) => s + getPnl(t), 0) / firstHour.length;
        const restAvg = rest.reduce((s, t) => s + getPnl(t), 0) / rest.length;

        if (restAvg !== 0) {
          const pctDiff = Math.round(((firstHourAvg - restAvg) / Math.abs(restAvg)) * 100);
          if (Math.abs(pctDiff) >= 10) {
            const better = pctDiff > 0;
            results.push({
              id: 'time-pattern',
              type: better ? 'positive' : 'warning',
              icon: Clock,
              text: better
                ? `You perform ${pctDiff}% better on trades taken in the first hour of market open`
                : `You perform ${Math.abs(pctDiff)}% worse on trades taken in the first hour \u2014 consider waiting for direction`,
              confidence: getConfidence(firstHour.length, 5),
              priority: 75,
            });
          }
        }
      }
    }

    // ── 4. Overtrading detection ─────────────────────────────────

    if (byDate.size >= 5) {
      const heavyDays: Trade[] = [];
      const lightDays: Trade[] = [];

      for (const [, dayTrades] of byDate) {
        if (dayTrades.length >= 5) {
          heavyDays.push(...dayTrades);
        } else {
          lightDays.push(...dayTrades);
        }
      }

      if (heavyDays.length >= 5 && lightDays.length >= 5) {
        const heavyWinRate = Math.round(
          (heavyDays.filter(isWin).length / heavyDays.length) * 100
        );
        const lightWinRate = Math.round(
          (lightDays.filter(isWin).length / lightDays.length) * 100
        );

        if (lightWinRate - heavyWinRate >= 10) {
          results.push({
            id: 'overtrading',
            type: 'warning',
            icon: AlertTriangle,
            text: `On days with 5+ trades, your win rate drops to ${heavyWinRate}% vs ${lightWinRate}% on lighter days`,
            confidence: getConfidence(heavyDays.length + lightDays.length, 10),
            priority: 95,
          });
        }
      }
    }

    // ── 5. Streak analysis ───────────────────────────────────────

    if (totalTrades >= 5) {
      const sorted = [...tradesWithPnl].sort((a, b) => {
        const da = a.traded_at || '';
        const db = b.traded_at || '';
        return da.localeCompare(db);
      });

      let maxWinStreak = 0;
      let maxLossStreak = 0;
      let currentWin = 0;
      let currentLoss = 0;
      let currentStreakStr = '';

      for (const t of sorted) {
        if (isWin(t)) {
          currentWin++;
          currentLoss = 0;
          if (currentWin > maxWinStreak) maxWinStreak = currentWin;
        } else {
          currentLoss++;
          currentWin = 0;
          if (currentLoss > maxLossStreak) maxLossStreak = currentLoss;
        }
      }

      currentStreakStr = currentWin > 0 ? `${currentWin}W` : `${currentLoss}L`;

      if (maxWinStreak >= 3) {
        results.push({
          id: 'streak',
          type: 'achievement',
          icon: Trophy,
          text: `Your longest winning streak was ${maxWinStreak} trades. Current: ${currentStreakStr}`,
          confidence: getConfidence(totalTrades, 5),
          priority: 60,
        });
      }
    }

    // ── 6 & 7. Best / worst day of week ──────────────────────────

    const byDow = new Map<number, number[]>();
    for (const t of tradesWithPnl) {
      if (!t.traded_at) continue;
      const dow = new Date(t.traded_at).getDay();
      const arr = byDow.get(dow) || [];
      arr.push(getPnl(t));
      byDow.set(dow, arr);
    }

    // Only consider weekdays with at least 5 trades
    const dowStats = Array.from(byDow.entries())
      .filter(([dow, arr]) => dow >= 1 && dow <= 5 && arr.length >= 5)
      .map(([dow, arr]) => ({
        dow,
        name: DAY_NAMES[dow],
        avg: arr.reduce((s, v) => s + v, 0) / arr.length,
        count: arr.length,
      }));

    if (dowStats.length >= 2) {
      const bestDay = dowStats.reduce((a, b) => (a.avg > b.avg ? a : b));
      const worstDay = dowStats.reduce((a, b) => (a.avg < b.avg ? a : b));

      if (bestDay.avg > 0) {
        results.push({
          id: 'best-day',
          type: 'positive',
          icon: Calendar,
          text: `${bestDay.name}s are your most profitable day (avg ${formatINR(Math.round(bestDay.avg))})`,
          confidence: getConfidence(bestDay.count, 5),
          priority: 55,
        });
      }

      if (worstDay.avg < 0 && worstDay.dow !== bestDay.dow) {
        results.push({
          id: 'worst-day',
          type: 'negative',
          icon: Calendar,
          text: `${worstDay.name}s tend to be your weakest day (avg ${formatINR(Math.round(worstDay.avg))})`,
          confidence: getConfidence(worstDay.count, 5),
          priority: 50,
        });
      }
    }

    // ── 8. Position sizing insight ───────────────────────────────

    const tradesWithSize = tradesWithPnl.filter(
      (t) => t.quantity != null && t.price != null && t.quantity > 0 && t.price > 0
    );
    if (tradesWithSize.length >= 10) {
      const sizes = tradesWithSize.map((t) => t.quantity! * t.price!);
      const avgSize = sizes.reduce((s, v) => s + v, 0) / sizes.length;

      const aboveAvg = tradesWithSize.filter((t) => t.quantity! * t.price! > avgSize);
      const belowAvg = tradesWithSize.filter((t) => t.quantity! * t.price! <= avgSize);

      if (aboveAvg.length >= 5 && belowAvg.length >= 5) {
        const aboveWinRate = Math.round(
          (aboveAvg.filter(isWin).length / aboveAvg.length) * 100
        );
        const belowWinRate = Math.round(
          (belowAvg.filter(isWin).length / belowAvg.length) * 100
        );

        if (belowWinRate - aboveWinRate >= 10) {
          results.push({
            id: 'position-size',
            type: 'warning',
            icon: AlertTriangle,
            text: `Your larger positions (above avg size) have a ${aboveWinRate}% win rate vs ${belowWinRate}% on smaller ones`,
            confidence: getConfidence(tradesWithSize.length, 10),
            priority: 70,
          });
        }
      }
    }

    // ── 9. Consistency ───────────────────────────────────────────

    if (byDate.size >= 3) {
      // Look at last 20 market days from most recent trade date
      const allDates = Array.from(byDate.keys()).sort();
      const mostRecent = new Date(allDates[allDates.length - 1]);
      let marketDaysChecked = 0;
      let tradedDays = 0;
      const cursor = new Date(mostRecent);

      while (marketDaysChecked < 20) {
        const dow = cursor.getDay();
        if (dow >= 1 && dow <= 5) {
          marketDaysChecked++;
          const key = cursor.toISOString().slice(0, 10);
          if (byDate.has(key)) tradedDays++;
        }
        cursor.setDate(cursor.getDate() - 1);
      }

      if (tradedDays > 0) {
        const type: Insight['type'] = tradedDays >= 15 ? 'achievement' : tradedDays >= 8 ? 'positive' : 'warning';
        results.push({
          id: 'consistency',
          type,
          icon: tradedDays >= 15 ? Trophy : Calendar,
          text: `You've traded ${tradedDays} out of the last 20 market days`,
          confidence: 0.8,
          priority: 40,
        });
      }
    }

    // ── 10. Improvement trend (this month vs last month) ─────────

    if (totalTrades >= 10) {
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

      const thisMonthTrades = tradesWithPnl.filter(
        (t) => t.traded_at && t.traded_at.startsWith(thisMonth)
      );
      const lastMonthTrades = tradesWithPnl.filter(
        (t) => t.traded_at && t.traded_at.startsWith(lastMonth)
      );

      if (thisMonthTrades.length >= 5 && lastMonthTrades.length >= 5) {
        const thisWR = Math.round(
          (thisMonthTrades.filter(isWin).length / thisMonthTrades.length) * 100
        );
        const lastWR = Math.round(
          (lastMonthTrades.filter(isWin).length / lastMonthTrades.length) * 100
        );
        const diff = thisWR - lastWR;

        if (Math.abs(diff) >= 5) {
          const improving = diff > 0;
          results.push({
            id: 'improvement-trend',
            type: improving ? 'positive' : 'warning',
            icon: improving ? Sparkles : TrendingDown,
            text: improving
              ? `Your win rate this month (${thisWR}%) is up from last month (${lastWR}%)`
              : `Your win rate this month (${thisWR}%) is down from last month (${lastWR}%)`,
            confidence: getConfidence(thisMonthTrades.length + lastMonthTrades.length, 10),
            priority: improving ? 80 : 88,
          });
        }
      }
    }

    // ── Sort by priority and return top 6 ────────────────────────

    return results
      .filter((r) => r.confidence > 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6);
  }, [trades]);

  if (insights.length === 0) return null;

  const borderColor: Record<Insight['type'], string> = {
    positive: 'border-green-500/40',
    warning: 'border-amber-500/40',
    negative: 'border-red-500/40',
    achievement: 'border-cyan-500/40',
  };

  const iconColor: Record<Insight['type'], string> = {
    positive: 'text-green-500',
    warning: 'text-amber-500',
    negative: 'text-red-500',
    achievement: 'text-cyan-500',
  };

  const confidenceLabel = (c: number): string => {
    if (c >= 0.8) return 'High';
    if (c >= 0.5) return 'Medium';
    return 'Low';
  };

  const confidenceColor = (c: number): string => {
    if (c >= 0.8) return 'text-green-500';
    if (c >= 0.5) return 'text-amber-500';
    return 'text-[#4a4a6a]';
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-cyan-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">AI Insights</h3>
        <span className="text-[10px] text-[#4a4a6a] ml-auto">{insights.length} insights</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className={`p-3 rounded-lg bg-white/[0.02] border-l-[3px] ${borderColor[insight.type]} border border-white/[0.04]`}
            >
              <div className="flex items-start gap-3">
                <Icon size={16} className={`${iconColor[insight.type]} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#d4d4e8] leading-relaxed">{insight.text}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-white/[0.06] rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-1 rounded-full ${
                            insight.confidence >= 0.8
                              ? 'bg-green-500'
                              : insight.confidence >= 0.5
                                ? 'bg-amber-500'
                                : 'bg-[#4a4a6a]'
                          }`}
                          style={{ width: `${Math.round(insight.confidence * 100)}%` }}
                        />
                      </div>
                      <span className={`text-[9px] font-mono ${confidenceColor(insight.confidence)}`}>
                        {confidenceLabel(insight.confidence)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
