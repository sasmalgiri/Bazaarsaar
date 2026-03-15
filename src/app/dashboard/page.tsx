'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonaStore } from '@/lib/store/personaStore';
import { createClient } from '@/lib/supabase/client';
import { PersonaHeader } from '@/components/dashboard/PersonaHeader';
import { WatchlistCard } from '@/components/dashboard/WatchlistCard';
import { KPICards } from '@/components/dashboard/KPICards';
import { AdvancedStats } from '@/components/dashboard/AdvancedStats';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { Achievements } from '@/components/dashboard/Achievements';
import { FnOAnalytics } from '@/components/dashboard/FnOAnalytics';
import { EquityCurve } from '@/components/dashboard/EquityCurve';
import { RecentTradesTable } from '@/components/dashboard/RecentTradesTable';
import { PnlBySymbol } from '@/components/dashboard/PnlBySymbol';
import { PnlCalendarHeatmap } from '@/components/dashboard/PnlCalendarHeatmap';
import { BehavioralInsights } from '@/components/dashboard/BehavioralInsights';
import { PlaybookComparison } from '@/components/dashboard/PlaybookComparison';
import { QuickTradeLogger } from '@/components/trades/QuickTradeLogger';
import { GlassCard } from '@/components/ui/GlassCard';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { Link2, SlidersHorizontal, RotateCcw, Brain } from 'lucide-react';
import Link from 'next/link';

interface Trade {
  id: string;
  symbol: string;
  side?: string;
  price?: number;
  quantity?: number;
  net_pnl?: number;
  pnl?: number;
  traded_at?: string;
  segment?: string;
}

interface BrokerConnection {
  status: string;
  broker: string;
  last_sync_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { persona, onboardingCompleted, _hasHydrated } = usePersonaStore();
  const { widgets, toggleWidget, resetWidgets } = useDashboardStore();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [broker, setBroker] = useState<BrokerConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);

  const isEnabled = (id: string) => widgets.find((w) => w.id === id)?.enabled !== false;

  useEffect(() => {
    if (!_hasHydrated) return; // wait for localStorage to load
    if (!onboardingCompleted || !persona) {
      router.replace('/onboarding');
    }
  }, [_hasHydrated, onboardingCompleted, persona, router]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: tradeData }, { data: brokerData }] = await Promise.all([
        supabase
          .from('trade')
          .select('id, symbol, side, price, quantity, net_pnl, pnl, traded_at, segment')
          .eq('user_id', user.id)
          .order('traded_at', { ascending: true }),
        supabase
          .from('broker_connection')
          .select('status, broker, last_sync_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setTrades((tradeData as Trade[]) || []);
      setBroker(brokerData as BrokerConnection | null);
      setLoading(false);
    }
    fetchData();
  }, []);

  const kpiData = useMemo(() => {
    if (trades.length === 0) {
      return { totalTrades: 0, winCount: 0, lossCount: 0, netPnl: 0, avgWin: 0, avgLoss: 0, currentStreak: 0 };
    }

    const wins = trades.filter((t) => (t.net_pnl || t.pnl || 0) > 0);
    const losses = trades.filter((t) => (t.net_pnl || t.pnl || 0) < 0);
    const netPnl = trades.reduce((sum, t) => sum + (t.net_pnl || t.pnl || 0), 0);
    const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + (t.net_pnl || t.pnl || 0), 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + (t.net_pnl || t.pnl || 0), 0) / losses.length : 0;

    // Calculate current streak
    let streak = 0;
    const sorted = [...trades].sort((a, b) => (b.traded_at || '').localeCompare(a.traded_at || ''));
    if (sorted.length > 0) {
      const firstPnl = sorted[0].net_pnl || sorted[0].pnl || 0;
      const isWin = firstPnl > 0;
      for (const t of sorted) {
        const pnl = t.net_pnl || t.pnl || 0;
        if ((isWin && pnl > 0) || (!isWin && pnl < 0)) {
          streak++;
        } else {
          break;
        }
      }
      if (!isWin) streak = -streak;
    }

    return {
      totalTrades: trades.length,
      winCount: wins.length,
      lossCount: losses.length,
      netPnl,
      avgWin,
      avgLoss,
      currentStreak: streak,
    };
  }, [trades]);

  if (!_hasHydrated || !persona) return null;

  const hasTrades = trades.length > 0;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <PersonaHeader />
        <button
          type="button"
          onClick={() => setShowCustomize((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
            showCustomize
              ? 'text-green-500 border-green-500/30 bg-green-500/10'
              : 'text-[#6b6b8a] border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]'
          }`}
        >
          <SlidersHorizontal size={14} />
          Customize
        </button>
      </div>

      {/* Customize Panel */}
      {showCustomize && (
        <GlassCard className="p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#d4d4e8] uppercase tracking-wider">Dashboard Widgets</h3>
            <button
              type="button"
              onClick={resetWidgets}
              className="flex items-center gap-1 text-[11px] text-[#6b6b8a] bg-transparent border-none cursor-pointer hover:text-[#b0b0c8] transition-colors"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {widgets.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => toggleWidget(w.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                  w.enabled
                    ? 'text-green-500 border-green-500/20 bg-green-500/10'
                    : 'text-[#4a4a6a] border-white/[0.06] bg-[#11111a]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${w.enabled ? 'bg-green-500' : 'bg-[#2a2a3a]'}`} />
                {w.label}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {/* KPIs — full width */}
      {isEnabled('kpis') && (
        loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <GlassCard key={i} className="p-4 h-20 animate-pulse"><span /></GlassCard>
            ))}
          </div>
        ) : hasTrades ? (
          <div className="mb-5">
            <KPICards {...kpiData} />
          </div>
        ) : null
      )}

      {/* Advanced Stats */}
      {isEnabled('advancedStats') && hasTrades && (
        <div className="mb-5">
          <AdvancedStats trades={trades} />
        </div>
      )}

      {/* AI Insights */}
      {isEnabled('aiInsights') && hasTrades && (
        <div className="mb-5">
          <AIInsights trades={trades} />
        </div>
      )}

      {/* Achievements */}
      {isEnabled('achievements') && (
        <div className="mb-5">
          <Achievements
            totalTrades={kpiData.totalTrades}
            journaledCount={0}
            currentStreak={kpiData.currentStreak}
            journalStreak={0}
            winRate={kpiData.totalTrades > 0 ? (kpiData.winCount / kpiData.totalTrades) * 100 : 0}
            playbooks={0}
            checklistCompletion={0}
          />
        </div>
      )}

      {/* Main grid — Behavioral Insights first */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Behavioral Intelligence — PRIMARY content */}
        {isEnabled('behavioral') && (
          <div className="lg:col-span-2">
            <BehavioralInsights />
          </div>
        )}

        {/* F&O / Segment Analytics */}
        {isEnabled('fnoAnalytics') && hasTrades && <FnOAnalytics trades={trades} />}

        {/* Playbook Comparison */}
        {isEnabled('playbooks') && <PlaybookComparison />}

        {/* Broker Status */}
        {isEnabled('broker') && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 size={18} className="text-green-500" />
              <h3 className="text-sm font-semibold text-[#d4d4e8]">Broker Connection</h3>
            </div>
            {broker?.status === 'active' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 live-dot" />
                  <span className="text-sm text-green-500 font-medium">Connected — {broker.broker}</span>
                </div>
                {broker.last_sync_at && (
                  <p className="text-[10px] text-[#4a4a6a]">
                    Last synced: {new Date(broker.last_sync_at).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            ) : broker?.status === 'expired' ? (
              <div className="py-4 text-center">
                <p className="text-sm text-amber-500 mb-2">Token expired — reconnect required</p>
                <Link href="/settings" className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline">
                  Reconnect Zerodha
                </Link>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-[#6b6b8a] mb-3">No broker connected yet</p>
                <Link href="/settings" className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline">
                  Connect Zerodha
                </Link>
              </div>
            )}
          </GlassCard>
        )}

        {isEnabled('watchlist') && <WatchlistCard />}
      </div>

      {/* Charts — only show when trades exist */}
      {hasTrades && (
        <>
          {(isEnabled('equity') || isEnabled('pnlSymbol')) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {isEnabled('equity') && <EquityCurve trades={trades} />}
              {isEnabled('pnlSymbol') && <PnlBySymbol trades={trades} />}
            </div>
          )}

          {isEnabled('heatmap') && (
            <div className="mb-5">
              <PnlCalendarHeatmap trades={trades} />
            </div>
          )}
        </>
      )}

      {/* Recent Trades */}
      {isEnabled('recentTrades') && (
        <div className="mb-5">
          <RecentTradesTable trades={[...trades].reverse()} />
        </div>
      )}

      {/* Quick Trade Logger FAB */}
      <QuickTradeLogger />
    </div>
  );
}
