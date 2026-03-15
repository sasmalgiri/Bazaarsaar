'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, X, TrendingDown } from 'lucide-react';

interface RuleBreakAlertProps {
  tradeId: string;
  symbol: string;
  side: string;
}

interface ViolationData {
  rule: string;
  impact: string;
  severity: 'high' | 'medium';
}

type PnlRow = { net_pnl: number | null; pnl: number | null };
const rowPnl = (t: PnlRow) => (t.net_pnl || t.pnl || 0);

export function RuleBreakAlert({ tradeId, symbol, side }: RuleBreakAlertProps) {
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkRules() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const alerts: ViolationData[] = [];

      // Check 1: Is the user already at daily loss limit?
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTrades } = await supabase
        .from('trade')
        .select('net_pnl, pnl')
        .eq('user_id', user.id)
        .gte('traded_at', `${today}T00:00:00`)
        .lte('traded_at', `${today}T23:59:59`);

      if (todayTrades && todayTrades.length > 0) {
        const dailyPnl = (todayTrades as PnlRow[]).reduce((s, t) => s + rowPnl(t), 0);
        if (dailyPnl < -5000) {
          alerts.push({
            rule: 'Daily loss limit exceeded',
            impact: `You are already down ₹${Math.abs(Math.round(dailyPnl)).toLocaleString('en-IN')} today. Your morning checklist says stop at max daily loss.`,
            severity: 'high',
          });
        }

        // Check 2: Overtrading - more than 10 trades today
        if (todayTrades.length >= 10) {
          alerts.push({
            rule: 'Overtrading warning',
            impact: `${todayTrades.length} trades today. Your data shows win rate drops on heavy trading days.`,
            severity: 'medium',
          });
        }
      }

      // Check 3: Is this a symbol where the user historically loses?
      const { data: symbolTrades } = await supabase
        .from('trade')
        .select('net_pnl, pnl')
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (symbolTrades && symbolTrades.length >= 5) {
        const rows = symbolTrades as PnlRow[];
        const symbolPnl = rows.reduce((s, t) => s + rowPnl(t), 0);
        const winCount = rows.filter((t) => rowPnl(t) > 0).length;
        const winRate = (winCount / symbolTrades.length) * 100;

        if (winRate < 35 && symbolPnl < 0) {
          alerts.push({
            rule: `Weak symbol: ${symbol}`,
            impact: `You have a ${Math.round(winRate)}% win rate on ${symbol} across ${symbolTrades.length} trades. Total P&L: ₹${Math.round(symbolPnl).toLocaleString('en-IN')}`,
            severity: 'medium',
          });
        }
      }

      // Check 4: Revenge trading — loss followed by immediate trade
      if (todayTrades && todayTrades.length >= 2) {
        const lastTrade = todayTrades[todayTrades.length - 1];
        const prevTrade = todayTrades[todayTrades.length - 2];
        if (rowPnl(prevTrade as PnlRow) < -1000) {
          alerts.push({
            rule: 'Possible revenge trade',
            impact: 'Your previous trade was a significant loss. Take a moment to check if this trade follows your playbook.',
            severity: 'high',
          });
        }
      }

      setViolations(alerts);
    }
    checkRules();
  }, [tradeId, symbol, side]);

  if (violations.length === 0 || dismissed) return null;

  return (
    <div className="mb-4 space-y-2 animate-fade-in">
      {violations.map((v, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            v.severity === 'high'
              ? 'border-red-500/30 bg-red-500/[0.06]'
              : 'border-amber-500/30 bg-amber-500/[0.06]'
          }`}
        >
          {v.severity === 'high' ? (
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          ) : (
            <TrendingDown size={18} className="text-amber-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${v.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
              {v.rule}
            </p>
            <p className="text-xs text-[#b0b0c8] mt-1">{v.impact}</p>
          </div>
          <button
            type="button"
            title="Dismiss alert"
            onClick={() => setDismissed(true)}
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#4a4a6a] hover:text-[#d4d4e8] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
