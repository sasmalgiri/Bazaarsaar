'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { BookCheck, Trophy, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface PlaybookCompare {
  id: string;
  title: string;
  tradeCount: number;
  winRate: number;
  avgPnl: number;
  totalPnl: number;
}

export function PlaybookComparison() {
  const [playbooks, setPlaybooks] = useState<PlaybookCompare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/insights/behavioral');
        const json = await res.json();
        if (json.insights?.playbookComparison) {
          setPlaybooks(json.insights.playbookComparison);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-4 bg-white/[0.06] rounded w-48 mb-4" />
        <div className="h-20 bg-white/[0.06] rounded" />
      </GlassCard>
    );
  }

  if (playbooks.length === 0) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookCheck size={16} className="text-green-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Playbook Performance</h3>
        </div>
        <p className="text-xs text-[#6b6b8a]">
          Assign playbooks to your trade journals to see which strategies work best for you.
        </p>
        <Link
          href="/playbooks"
          className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent hover:bg-green-500/10 transition-all no-underline"
        >
          Set Up Playbooks
        </Link>
      </GlassCard>
    );
  }

  const best = playbooks[0];
  const worst = playbooks[playbooks.length - 1];

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookCheck size={16} className="text-green-500" />
        <h3 className="text-sm font-semibold text-[#d4d4e8]">Playbook Win Rates</h3>
      </div>

      <div className="space-y-3">
        {playbooks.map((pb, i) => {
          const isBest = i === 0 && playbooks.length > 1;
          const isWorst = i === playbooks.length - 1 && playbooks.length > 1;

          return (
            <Link key={pb.id} href={`/playbooks/${pb.id}`} className="block no-underline group">
              <div className={`p-3 rounded-lg border transition-colors hover:bg-white/[0.02] ${
                isBest ? 'border-green-500/20 bg-green-500/[0.04]' :
                isWorst ? 'border-red-500/10 bg-red-500/[0.02]' :
                'border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isBest && <Trophy size={12} className="text-green-500" />}
                    {isWorst && <TrendingDown size={12} className="text-red-500" />}
                    <span className="text-sm font-medium text-[#d4d4e8]">{pb.title}</span>
                  </div>
                  <span className="text-[10px] text-[#4a4a6a]">{pb.tradeCount} trades</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Win Rate Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/[0.06] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${pb.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${pb.winRate}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold ${pb.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                        {pb.winRate}%
                      </span>
                    </div>
                  </div>

                  {/* Avg P&L */}
                  <span className={`text-xs font-mono w-24 text-right ${pb.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pb.avgPnl >= 0 ? '+' : ''}{pb.avgPnl.toLocaleString('en-IN')}/trade
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {playbooks.length > 1 && best.winRate !== worst.winRate && (
        <p className="text-[10px] text-[#4a4a6a] mt-3">
          Your &ldquo;{best.title}&rdquo; playbook outperforms &ldquo;{worst.title}&rdquo; by {best.winRate - worst.winRate}pp win rate.
          Consider refining or retiring underperforming strategies.
        </p>
      )}
    </GlassCard>
  );
}
