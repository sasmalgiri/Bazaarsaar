import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cron: auto-generate weekly reports for all users with trades this week.
 * Runs Friday 6 PM UTC (11:30 PM IST).
 * Vercel Cron calls this with CRON_SECRET header for security.
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    // Calculate week boundaries (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Find all users with trades this week
    const { data: userTrades } = await admin
      .from('trade')
      .select('user_id')
      .gte('traded_at', weekStart.toISOString())
      .lte('traded_at', weekEnd.toISOString());

    if (!userTrades || userTrades.length === 0) {
      return NextResponse.json({ ok: true, message: 'No trades this week', reports: 0 });
    }

    const userIds = [...new Set(userTrades.map((t: { user_id: string }) => t.user_id))];
    let generated = 0;

    for (const userId of userIds) {
      const { data: trades } = await admin
        .from('trade')
        .select('*')
        .eq('user_id', userId)
        .gte('traded_at', weekStart.toISOString())
        .lte('traded_at', weekEnd.toISOString());

      if (!trades || trades.length === 0) continue;

      const wins = trades.filter((t: { net_pnl?: number; pnl?: number }) => (t.net_pnl || t.pnl || 0) > 0);
      const losses = trades.filter((t: { net_pnl?: number; pnl?: number }) => (t.net_pnl || t.pnl || 0) < 0);
      const grossPnl = trades.reduce((sum: number, t: { pnl?: number }) => sum + (t.pnl || 0), 0);
      const netPnl = trades.reduce((sum: number, t: { net_pnl?: number; pnl?: number }) => sum + (t.net_pnl || t.pnl || 0), 0);
      const avgWin = wins.length > 0 ? wins.reduce((s: number, t: { net_pnl?: number; pnl?: number }) => s + (t.net_pnl || t.pnl || 0), 0) / wins.length : 0;
      const avgLoss = losses.length > 0 ? losses.reduce((s: number, t: { net_pnl?: number; pnl?: number }) => s + (t.net_pnl || t.pnl || 0), 0) / losses.length : 0;
      const largestWin = wins.length > 0 ? Math.max(...wins.map((t: { net_pnl?: number; pnl?: number }) => t.net_pnl || t.pnl || 0)) : 0;
      const largestLoss = losses.length > 0 ? Math.min(...losses.map((t: { net_pnl?: number; pnl?: number }) => t.net_pnl || t.pnl || 0)) : 0;

      const symbolCounts: Record<string, number> = {};
      trades.forEach((t: { symbol: string }) => { symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1; });
      const topSymbols = Object.entries(symbolCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([sym]) => sym);

      const tradeIds = trades.map((t: { id: string }) => t.id);
      const { data: journals } = await admin.from('journal_entry').select('trade_id, emotion').eq('user_id', userId).in('trade_id', tradeIds);
      const journalFillRate = trades.length > 0 ? ((journals?.length || 0) / trades.length) * 100 : 0;

      // Emotion distribution from journal entries
      const emotionDist: Record<string, number> = {};
      journals?.forEach((j: { emotion?: string }) => {
        if (j.emotion) emotionDist[j.emotion] = (emotionDist[j.emotion] || 0) + 1;
      });

      // Enhanced metrics: profit factor, expectancy, max drawdown
      const grossWins = wins.reduce((s: number, t: { net_pnl?: number; pnl?: number }) => s + Math.abs(t.net_pnl || t.pnl || 0), 0);
      const grossLosses = losses.reduce((s: number, t: { net_pnl?: number; pnl?: number }) => s + Math.abs(t.net_pnl || t.pnl || 0), 0);
      const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0;

      const winRate = trades.length > 0 ? wins.length / trades.length : 0;
      const lossRate = 1 - winRate;
      const expectancy = (winRate * avgWin) - (lossRate * Math.abs(avgLoss));

      // Max drawdown: peak-to-trough on cumulative P&L
      let peak = 0;
      let cumPnl = 0;
      let maxDrawdown = 0;
      const sortedTrades = [...trades].sort((a: { traded_at: string }, b: { traded_at: string }) =>
        new Date(a.traded_at).getTime() - new Date(b.traded_at).getTime()
      );
      for (const t of sortedTrades) {
        cumPnl += ((t as { net_pnl?: number; pnl?: number }).net_pnl || (t as { pnl?: number }).pnl || 0);
        if (cumPnl > peak) peak = cumPnl;
        const dd = peak - cumPnl;
        if (dd > maxDrawdown) maxDrawdown = dd;
      }
      const maxDrawdownPct = peak > 0 ? (maxDrawdown / peak) * 100 : 0;

      // Playbook adherence
      const { data: journalsWithPlaybook } = await admin
        .from('journal_entry')
        .select('id, playbook_id')
        .eq('user_id', userId)
        .in('trade_id', tradeIds)
        .not('playbook_id', 'is', null);

      const playbookUsedCount = journalsWithPlaybook?.length || 0;
      let avgChecklistCompletion = 0;
      const topMissedSteps: string[] = [];

      if (playbookUsedCount > 0) {
        const journalIds = journalsWithPlaybook!.map((j: { id: string }) => j.id);
        const { data: checks } = await admin
          .from('journal_check')
          .select('journal_entry_id, step_id, checked')
          .in('journal_entry_id', journalIds);

        if (checks && checks.length > 0) {
          const byJournal: Record<string, { total: number; checked: number }> = {};
          const missedCounts: Record<string, number> = {};
          for (const c of checks as { journal_entry_id: string; step_id: string; checked: boolean }[]) {
            if (!byJournal[c.journal_entry_id]) byJournal[c.journal_entry_id] = { total: 0, checked: 0 };
            byJournal[c.journal_entry_id].total++;
            if (c.checked) byJournal[c.journal_entry_id].checked++;
            else missedCounts[c.step_id] = (missedCounts[c.step_id] || 0) + 1;
          }
          const rates = Object.values(byJournal).map((v) => v.total > 0 ? (v.checked / v.total) * 100 : 0);
          avgChecklistCompletion = rates.reduce((a, b) => a + b, 0) / rates.length;

          // Top 3 missed step IDs → resolve names
          const topMissedIds = Object.entries(missedCounts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id]) => id);
          if (topMissedIds.length > 0) {
            const { data: stepTexts } = await admin.from('user_playbook_step').select('id, step_text').in('id', topMissedIds);
            if (stepTexts) {
              for (const id of topMissedIds) {
                const step = stepTexts.find((s: { id: string }) => s.id === id);
                if (step) topMissedSteps.push((step as { step_text: string }).step_text);
              }
            }
          }
        }
      }

      await admin.from('weekly_report').upsert({
        user_id: userId,
        week_start: weekStartStr,
        week_end: weekEndStr,
        total_trades: trades.length,
        win_count: wins.length,
        loss_count: losses.length,
        gross_pnl: grossPnl,
        net_pnl: netPnl,
        avg_win: avgWin,
        avg_loss: avgLoss,
        largest_win: largestWin,
        largest_loss: largestLoss,
        journal_fill_rate: journalFillRate,
        top_symbols: topSymbols,
        emotion_distribution: emotionDist,
        playbook_used_count: playbookUsedCount,
        avg_checklist_completion: avgChecklistCompletion,
        top_missed_steps: topMissedSteps,
        profit_factor: profitFactor === Infinity ? 999 : profitFactor,
        expectancy: expectancy,
        max_drawdown: maxDrawdown,
        max_drawdown_pct: maxDrawdownPct,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,week_start' });

      generated++;
    }

    return NextResponse.json({ ok: true, reports: generated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
