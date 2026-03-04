import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const admin = createAdminClient();

    // Fetch trades for the week
    const { data: trades } = await admin
      .from('trade')
      .select('*')
      .eq('user_id', user.id)
      .gte('traded_at', weekStart.toISOString())
      .lte('traded_at', weekEnd.toISOString());

    if (!trades || trades.length === 0) {
      return NextResponse.json({ error: 'No trades found for this week' }, { status: 400 });
    }

    // Calculate descriptive statistics
    const wins = trades.filter((t: { net_pnl?: number; pnl?: number }) => (t.net_pnl || t.pnl || 0) > 0);
    const losses = trades.filter((t: { net_pnl?: number; pnl?: number }) => (t.net_pnl || t.pnl || 0) < 0);

    const grossPnl = trades.reduce((sum: number, t: { pnl?: number }) => sum + (t.pnl || 0), 0);
    const netPnl = trades.reduce((sum: number, t: { net_pnl?: number; pnl?: number }) => sum + (t.net_pnl || t.pnl || 0), 0);

    const avgWin = wins.length > 0 ? wins.reduce((sum: number, t: { net_pnl?: number; pnl?: number }) => sum + (t.net_pnl || t.pnl || 0), 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((sum: number, t: { net_pnl?: number; pnl?: number }) => sum + (t.net_pnl || t.pnl || 0), 0) / losses.length : 0;

    const largestWin = wins.length > 0 ? Math.max(...wins.map((t: { net_pnl?: number; pnl?: number }) => t.net_pnl || t.pnl || 0)) : 0;
    const largestLoss = losses.length > 0 ? Math.min(...losses.map((t: { net_pnl?: number; pnl?: number }) => t.net_pnl || t.pnl || 0)) : 0;

    // Top symbols
    const symbolCounts: Record<string, number> = {};
    trades.forEach((t: { symbol: string }) => {
      symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1;
    });
    const topSymbols = Object.entries(symbolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([sym]) => sym);

    // Journal fill rate
    const tradeIds = trades.map((t: { id: string }) => t.id);
    const { data: journals } = await admin
      .from('journal_entry')
      .select('trade_id')
      .eq('user_id', user.id)
      .in('trade_id', tradeIds);

    const journalFillRate = trades.length > 0 ? ((journals?.length || 0) / trades.length) * 100 : 0;

    // Emotion distribution
    const emotionDist: Record<string, number> = {};
    if (journals && journals.length > 0) {
      const { data: fullJournals } = await admin
        .from('journal_entry')
        .select('emotion')
        .eq('user_id', user.id)
        .in('trade_id', tradeIds)
        .not('emotion', 'is', null);

      fullJournals?.forEach((j: { emotion: string }) => {
        if (j.emotion) {
          emotionDist[j.emotion] = (emotionDist[j.emotion] || 0) + 1;
        }
      });
    }

    // Playbook adherence metrics
    let playbookUsedCount = 0;
    let avgChecklistCompletion = 0;
    const missedStepCounts: Record<string, number> = {};

    if (journals && journals.length > 0) {
      const { data: pbJournals } = await admin
        .from('journal_entry')
        .select('id, playbook_id')
        .eq('user_id', user.id)
        .in('trade_id', tradeIds)
        .not('playbook_id', 'is', null);

      if (pbJournals && pbJournals.length > 0) {
        playbookUsedCount = pbJournals.length;

        const journalIds = pbJournals.map((j: { id: string }) => j.id);
        const { data: checks } = await admin
          .from('journal_check')
          .select('journal_entry_id, step_id, checked')
          .in('journal_entry_id', journalIds);

        if (checks && checks.length > 0) {
          const byJournal: Record<string, { total: number; checked: number }> = {};
          checks.forEach((c: { journal_entry_id: string; step_id: string; checked: boolean }) => {
            if (!byJournal[c.journal_entry_id]) byJournal[c.journal_entry_id] = { total: 0, checked: 0 };
            byJournal[c.journal_entry_id].total += 1;
            if (c.checked) byJournal[c.journal_entry_id].checked += 1;
          });

          const rates = Object.values(byJournal).map((v) => v.total > 0 ? (v.checked / v.total) * 100 : 0);
          avgChecklistCompletion = rates.reduce((s, r) => s + r, 0) / rates.length;

          const uncheckedStepIds = checks
            .filter((c: { checked: boolean }) => !c.checked)
            .map((c: { step_id: string }) => c.step_id);

          if (uncheckedStepIds.length > 0) {
            const { data: stepDefs } = await admin
              .from('user_playbook_step')
              .select('id, step_text')
              .in('id', uncheckedStepIds);

            stepDefs?.forEach((s: { id: string; step_text: string }) => {
              missedStepCounts[s.step_text] = (missedStepCounts[s.step_text] || 0) + 1;
            });
          }
        }
      }
    }

    const topMissedSteps = Object.entries(missedStepCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([text]) => text);

    // Upsert weekly report
    const report = {
      user_id: user.id,
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
      generated_at: new Date().toISOString(),
    };

    await admin.from('weekly_report').upsert(report, { onConflict: 'user_id,week_start' });

    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
