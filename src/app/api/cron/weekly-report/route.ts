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
      const { data: journals } = await admin.from('journal_entry').select('trade_id').eq('user_id', userId).in('trade_id', tradeIds);
      const journalFillRate = trades.length > 0 ? ((journals?.length || 0) / trades.length) * 100 : 0;

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
        emotion_distribution: {},
        generated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,week_start' });

      generated++;
    }

    return NextResponse.json({ ok: true, reports: generated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
