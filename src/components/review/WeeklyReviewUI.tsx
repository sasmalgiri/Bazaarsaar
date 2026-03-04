'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { TrendingUp, TrendingDown, BarChart3, BookOpen } from 'lucide-react';
import type { WeeklyReport } from '@/types';

export function WeeklyReviewUI() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    async function fetchReports() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('weekly_report')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(12);

      if (data && data.length > 0) {
        setReports(data as unknown as WeeklyReport[]);
        setSelected(data[0] as unknown as WeeklyReport);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-sm text-[#6b6b8a]">Loading reports...</p>
      </GlassCard>
    );
  }

  if (reports.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <BarChart3 size={32} className="mx-auto text-[#32324a] mb-3" />
        <p className="text-sm text-[#6b6b8a] mb-1">No weekly reports yet</p>
        <p className="text-xs text-[#4a4a6a]">
          Weekly reports are generated automatically once you have trades.
          Reports are descriptive summaries of your trading patterns.
        </p>
        <SEBIDisclaimer type="journal" />
      </GlassCard>
    );
  }

  const report = selected!;
  const winRate = report.total_trades > 0 ? ((report.win_count / report.total_trades) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-all border ${
              selected?.id === r.id
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-white/[0.04] text-[#6b6b8a] border-white/[0.06] hover:bg-white/[0.08]'
            }`}
          >
            {new Date(r.week_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            {' - '}
            {new Date(r.week_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#6b6b8a] mb-1">Total Trades</p>
          <p className="text-2xl font-bold font-mono text-[#fafaff]">{report.total_trades}</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#6b6b8a] mb-1">Win Rate</p>
          <p className="text-2xl font-bold font-mono text-[#fafaff]">{winRate}%</p>
          <p className="text-[10px] text-[#4a4a6a]">{report.win_count}W / {report.loss_count}L</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#6b6b8a] mb-1">Net P&L</p>
          <p className={`text-2xl font-bold font-mono ${Number(report.net_pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(report.net_pnl) >= 0 ? '+' : ''}{Number(report.net_pnl).toLocaleString('en-IN')}
          </p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#6b6b8a] mb-1">Journal Fill</p>
          <p className="text-2xl font-bold font-mono text-[#fafaff]">{Number(report.journal_fill_rate).toFixed(0)}%</p>
        </GlassCard>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Best Trade</h3>
          </div>
          <p className="text-lg font-mono text-green-500">
            +{Number(report.largest_win).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#4a4a6a] mt-1">
            Avg win: {Number(report.avg_win).toLocaleString('en-IN')}
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Worst Trade</h3>
          </div>
          <p className="text-lg font-mono text-red-500">
            {Number(report.largest_loss).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#4a4a6a] mt-1">
            Avg loss: {Number(report.avg_loss).toLocaleString('en-IN')}
          </p>
        </GlassCard>

        {report.top_symbols && report.top_symbols.length > 0 && (
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-[#d4d4e8] mb-3">Top Symbols</h3>
            <div className="flex flex-wrap gap-2">
              {report.top_symbols.map((sym) => (
                <span key={sym} className="text-xs font-mono text-[#d4d4e8] px-2 py-1 rounded bg-white/[0.04]">
                  {sym}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {report.emotion_distribution && Object.keys(report.emotion_distribution).length > 0 && (
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-[#d4d4e8]">Emotion Distribution</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(report.emotion_distribution).map(([emotion, count]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-xs text-[#6b6b8a] capitalize">{emotion}</span>
                  <span className="text-xs font-mono text-[#d4d4e8]">{count as number}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      <SEBIDisclaimer type="journal" />
    </div>
  );
}
