'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Brain, AlertTriangle, TrendingUp, TrendingDown, BookCheck, Target } from 'lucide-react';

interface EmotionStat {
  count: number;
  wins: number;
  losses: number;
  totalPnl: number;
  avgPnl: number;
}

interface MistakePattern {
  emotion: string;
  lossRate: number;
  count: number;
  avgLoss: number;
  message: string;
}

interface DisciplineInsight {
  followedChecklist: { count: number; winRate: number; avgPnl: number };
  skippedChecklist: { count: number; winRate: number; avgPnl: number };
}

interface BehavioralData {
  emotionStats: Record<string, EmotionStat>;
  mistakePatterns: MistakePattern[];
  disciplineInsight: DisciplineInsight;
  journalHealth: { totalTrades: number; journaledTrades: number; fillRate: number };
  topImprovement: string;
}

const EMOTION_EMOJIS: Record<string, string> = {
  confident: '\uD83D\uDE0E',
  neutral: '\uD83D\uDE10',
  fearful: '\uD83D\uDE28',
  greedy: '\uD83E\uDD11',
  fomo: '\uD83D\uDE30',
  revenge: '\uD83D\uDE21',
  untagged: '\u2753',
};

export function BehavioralInsights() {
  const [data, setData] = useState<BehavioralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights/behavioral');
        const json = await res.json();
        if (json.insights) setData(json.insights);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-4 bg-white/[0.06] rounded w-48 mb-4" />
        <div className="h-20 bg-white/[0.06] rounded" />
      </GlassCard>
    );
  }

  if (!data) return null;

  const { emotionStats, mistakePatterns, disciplineInsight, journalHealth, topImprovement } = data;

  // Filter out untagged for emotion display
  const taggedEmotions = Object.entries(emotionStats).filter(([k]) => k !== 'untagged');

  return (
    <div className="space-y-5">
      {/* Top Improvement Nudge */}
      {topImprovement && (
        <GlassCard className="p-5 border-l-4 border-amber-500/50">
          <div className="flex items-start gap-3">
            <Brain size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">This Week&apos;s Focus</h3>
              <p className="text-sm text-[#b0b0c8]">{topImprovement}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Mistake Patterns — the "why am I losing" answer */}
      {mistakePatterns.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Mistake Patterns Detected</h3>
          </div>
          <p className="text-[10px] text-[#4a4a6a] mb-4">These emotions are costing you money. Tag more trades to improve accuracy. / ये भावनाएं आपके पैसे डुबो रही हैं।</p>
          <div className="space-y-3">
            {mistakePatterns.map((mp) => (
              <div key={mp.emotion} className="p-3 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{EMOTION_EMOJIS[mp.emotion] || '\u26A0\uFE0F'}</span>
                  <span className="text-sm font-medium text-red-400 capitalize">{mp.emotion}</span>
                  <span className="text-[10px] text-[#4a4a6a] ml-auto">{mp.count} trades</span>
                </div>
                <p className="text-xs text-[#b0b0c8]">{mp.message}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-full bg-white/[0.06] rounded-full h-1.5 w-24">
                      <div
                        className="h-1.5 rounded-full bg-red-500"
                        style={{ width: `${mp.lossRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-red-400">{mp.lossRate}% loss</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400">
                    avg {mp.avgLoss < 0 ? '' : '+'}{mp.avgLoss.toLocaleString('en-IN')}/trade
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Emotion → P&L Breakdown */}
      {taggedEmotions.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-cyan-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Emotion → P&L Breakdown</h3>
          </div>
          <p className="text-[10px] text-[#4a4a6a] mb-4">Which feelings make you money and which cost you? / कौन सी भावनाएं पैसे बनाती हैं, कौन सी डुबोती हैं?</p>
          <div className="space-y-2">
            {taggedEmotions
              .sort(([, a], [, b]) => b.avgPnl - a.avgPnl)
              .map(([emotion, stats]) => {
                const winRate = stats.count > 0 ? Math.round((stats.wins / stats.count) * 100) : 0;
                return (
                  <div key={emotion} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-lg w-8 text-center">{EMOTION_EMOJIS[emotion] || '\u2753'}</span>
                    <span className="text-sm text-[#d4d4e8] capitalize w-20">{emotion}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono w-10 text-right ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                          {winRate}%
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-mono w-20 text-right ${stats.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.avgPnl >= 0 ? '+' : ''}{Math.round(stats.avgPnl).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#4a4a6a] w-12 text-right">{stats.count} trades</span>
                  </div>
                );
              })}
          </div>
          <p className="text-[10px] text-[#4a4a6a] mt-3">Avg P&L per trade by emotional state. Journal more trades to improve accuracy.</p>
        </GlassCard>
      )}

      {/* Discipline: Checklist followed vs skipped */}
      {(disciplineInsight.followedChecklist.count > 0 || disciplineInsight.skippedChecklist.count > 0) && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <BookCheck size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Discipline Impact</h3>
          </div>
          <p className="text-[10px] text-[#4a4a6a] mb-4">Does following your checklist actually help? See the proof. / Checklist follow करने से फ़ायदा होता है? सबूत देखें।</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-500/[0.06] border border-green-500/10 text-center">
              <p className="text-[10px] text-[#6b6b8a] uppercase tracking-wider mb-2">Followed Checklist</p>
              <p className="text-2xl font-bold font-mono text-green-500">{disciplineInsight.followedChecklist.winRate}%</p>
              <p className="text-[10px] text-[#4a4a6a]">win rate</p>
              <p className={`text-sm font-mono mt-1 ${disciplineInsight.followedChecklist.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {disciplineInsight.followedChecklist.avgPnl >= 0 ? '+' : ''}{disciplineInsight.followedChecklist.avgPnl.toLocaleString('en-IN')}/trade
              </p>
              <p className="text-[10px] text-[#4a4a6a] mt-1">{disciplineInsight.followedChecklist.count} trades</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-center">
              <p className="text-[10px] text-[#6b6b8a] uppercase tracking-wider mb-2">Skipped Checklist</p>
              <p className="text-2xl font-bold font-mono text-red-500">{disciplineInsight.skippedChecklist.winRate}%</p>
              <p className="text-[10px] text-[#4a4a6a]">win rate</p>
              <p className={`text-sm font-mono mt-1 ${disciplineInsight.skippedChecklist.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {disciplineInsight.skippedChecklist.avgPnl >= 0 ? '+' : ''}{disciplineInsight.skippedChecklist.avgPnl.toLocaleString('en-IN')}/trade
              </p>
              <p className="text-[10px] text-[#4a4a6a] mt-1">{disciplineInsight.skippedChecklist.count} trades</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Journal Health */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {journalHealth.fillRate >= 70 ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-amber-500" />
            )}
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Journal Health</h3>
          </div>
          <span className={`text-lg font-bold font-mono ${journalHealth.fillRate >= 70 ? 'text-green-500' : journalHealth.fillRate >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
            {journalHealth.fillRate}%
          </span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-2 mb-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${journalHealth.fillRate >= 70 ? 'bg-green-500' : journalHealth.fillRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(100, journalHealth.fillRate)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#4a4a6a]">
          {journalHealth.journaledTrades} of {journalHealth.totalTrades} trades journaled.
          {journalHealth.fillRate < 70 && ' Tag emotions & playbooks to unlock mistake detection.'}
        </p>
      </GlassCard>
    </div>
  );
}
