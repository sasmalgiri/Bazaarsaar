import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/insights/behavioral
 * Returns behavioral analytics: emotion→P&L patterns, playbook comparison, mistake detection.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch trades + journal entries in parallel
    const [{ data: trades }, { data: journals }, { data: checks }] = await Promise.all([
      supabase
        .from('trade')
        .select('id, symbol, side, pnl, net_pnl, traded_at')
        .eq('user_id', user.id)
        .order('traded_at', { ascending: true }),
      supabase
        .from('journal_entry')
        .select('id, trade_id, playbook_id, emotion, checklist_followed, rating, thesis')
        .eq('user_id', user.id),
      supabase
        .from('journal_check')
        .select('journal_entry_id, step_id, checked'),
    ]);

    if (!trades || trades.length === 0) {
      return NextResponse.json({ insights: null, message: 'No trades yet' });
    }

    // Build trade map
    const tradeMap = new Map<string, { pnl: number; symbol: string; side: string; traded_at: string }>();
    for (const t of trades) {
      tradeMap.set(t.id, {
        pnl: t.net_pnl || t.pnl || 0,
        symbol: t.symbol,
        side: t.side || '',
        traded_at: t.traded_at || '',
      });
    }

    // Build journal map keyed by trade_id
    const journalByTrade = new Map<string, { id: string; trade_id: string; playbook_id: string | null; emotion: string | null; checklist_followed: boolean; rating: number | null; thesis: string | null }>();
    if (journals) {
      for (const j of journals) {
        journalByTrade.set(j.trade_id, j);
      }
    }

    // Build checklist completion map keyed by journal_entry_id
    const checkMap = new Map<string, { total: number; checked: number }>();
    if (checks) {
      for (const c of checks) {
        const existing = checkMap.get(c.journal_entry_id) || { total: 0, checked: 0 };
        existing.total++;
        if (c.checked) existing.checked++;
        checkMap.set(c.journal_entry_id, existing);
      }
    }

    // === 1. Emotion → P&L Patterns ===
    const emotionStats: Record<string, { count: number; wins: number; losses: number; totalPnl: number; avgPnl: number }> = {};

    for (const [tradeId, trade] of tradeMap) {
      const journal = journalByTrade.get(tradeId);
      const emotion = journal?.emotion || 'untagged';

      if (!emotionStats[emotion]) {
        emotionStats[emotion] = { count: 0, wins: 0, losses: 0, totalPnl: 0, avgPnl: 0 };
      }
      const s = emotionStats[emotion];
      s.count++;
      s.totalPnl += trade.pnl;
      if (trade.pnl > 0) s.wins++;
      else if (trade.pnl < 0) s.losses++;
    }

    // Calculate averages
    for (const s of Object.values(emotionStats)) {
      s.avgPnl = s.count > 0 ? s.totalPnl / s.count : 0;
    }

    // === 2. Mistake Patterns (losing > X% of time with specific emotion) ===
    const mistakePatterns: { emotion: string; lossRate: number; count: number; avgLoss: number; message: string }[] = [];

    for (const [emotion, stats] of Object.entries(emotionStats)) {
      if (emotion === 'untagged' || stats.count < 3) continue;
      const lossRate = (stats.losses / stats.count) * 100;
      if (lossRate >= 55) {
        mistakePatterns.push({
          emotion,
          lossRate: Math.round(lossRate),
          count: stats.count,
          avgLoss: Math.round(stats.avgPnl),
          message: `You lose money ${Math.round(lossRate)}% of the time when trading with ${emotion.toUpperCase()} emotion (${stats.count} trades)`,
        });
      }
    }

    // Sort by loss rate descending
    mistakePatterns.sort((a, b) => b.lossRate - a.lossRate);

    // === 3. Checklist Discipline vs Outcome ===
    let followedCount = 0;
    let followedWins = 0;
    let followedPnl = 0;
    let skippedCount = 0;
    let skippedWins = 0;
    let skippedPnl = 0;

    for (const [tradeId, trade] of tradeMap) {
      const journal = journalByTrade.get(tradeId);
      if (!journal) continue;

      if (journal.checklist_followed) {
        followedCount++;
        followedPnl += trade.pnl;
        if (trade.pnl > 0) followedWins++;
      } else {
        skippedCount++;
        skippedPnl += trade.pnl;
        if (trade.pnl > 0) skippedWins++;
      }
    }

    const disciplineInsight = {
      followedChecklist: {
        count: followedCount,
        winRate: followedCount > 0 ? Math.round((followedWins / followedCount) * 100) : 0,
        avgPnl: followedCount > 0 ? Math.round(followedPnl / followedCount) : 0,
      },
      skippedChecklist: {
        count: skippedCount,
        winRate: skippedCount > 0 ? Math.round((skippedWins / skippedCount) * 100) : 0,
        avgPnl: skippedCount > 0 ? Math.round(skippedPnl / skippedCount) : 0,
      },
    };

    // === 4. Playbook Win Rate Comparison ===
    const playbookStats: Record<string, { id: string; count: number; wins: number; totalPnl: number }> = {};

    for (const [tradeId, trade] of tradeMap) {
      const journal = journalByTrade.get(tradeId);
      if (!journal?.playbook_id) continue;

      if (!playbookStats[journal.playbook_id]) {
        playbookStats[journal.playbook_id] = { id: journal.playbook_id, count: 0, wins: 0, totalPnl: 0 };
      }
      const s = playbookStats[journal.playbook_id];
      s.count++;
      s.totalPnl += trade.pnl;
      if (trade.pnl > 0) s.wins++;
    }

    // Fetch playbook names
    const playbookIds = Object.keys(playbookStats);
    let playbookComparison: { id: string; title: string; tradeCount: number; winRate: number; avgPnl: number; totalPnl: number }[] = [];

    if (playbookIds.length > 0) {
      const { data: playbooks } = await supabase
        .from('user_playbook')
        .select('id, title')
        .in('id', playbookIds);

      const nameMap: Record<string, string> = {};
      playbooks?.forEach((p: { id: string; title: string }) => { nameMap[p.id] = p.title; });

      playbookComparison = Object.values(playbookStats).map((s) => ({
        id: s.id,
        title: nameMap[s.id] || 'Unknown',
        tradeCount: s.count,
        winRate: s.count > 0 ? Math.round((s.wins / s.count) * 100) : 0,
        avgPnl: s.count > 0 ? Math.round(s.totalPnl / s.count) : 0,
        totalPnl: Math.round(s.totalPnl),
      }));

      playbookComparison.sort((a, b) => b.winRate - a.winRate);
    }

    // === 5. Journal Health ===
    const totalTrades = trades.length;
    const journaledTrades = journals?.length || 0;
    const journalFillRate = totalTrades > 0 ? Math.round((journaledTrades / totalTrades) * 100) : 0;

    // === 6. Top Improvement Area ===
    let topImprovement = '';
    if (mistakePatterns.length > 0) {
      topImprovement = `Avoid trading when feeling ${mistakePatterns[0].emotion}. It costs you ₹${Math.abs(mistakePatterns[0].avgLoss)} per trade on average.`;
    } else if (journalFillRate < 50) {
      topImprovement = `Journal more trades. You're only logging ${journalFillRate}% — aim for 80%+ to spot patterns.`;
    } else if (disciplineInsight.skippedChecklist.count > disciplineInsight.followedChecklist.count) {
      topImprovement = 'Follow your checklist more consistently. Trades with checklist have better win rates.';
    }

    return NextResponse.json({
      insights: {
        emotionStats,
        mistakePatterns,
        disciplineInsight,
        playbookComparison,
        journalHealth: {
          totalTrades,
          journaledTrades,
          fillRate: journalFillRate,
        },
        topImprovement,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
