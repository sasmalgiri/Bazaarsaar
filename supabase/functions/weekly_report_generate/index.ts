import { getUserClient, getServiceClient, corsHeaders } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = getUserClient(authHeader);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate week boundaries (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const serviceClient = getServiceClient();

    // Fetch trades for the week
    const { data: trades } = await serviceClient
      .from('trade')
      .select('*')
      .eq('user_id', user.id)
      .gte('traded_at', weekStart.toISOString())
      .lte('traded_at', weekEnd.toISOString());

    if (!trades || trades.length === 0) {
      return new Response(JSON.stringify({ error: 'No trades found for this week' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    // Top symbols by trade count
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
    const { data: journals } = await serviceClient
      .from('journal_entry')
      .select('trade_id')
      .eq('user_id', user.id)
      .in('trade_id', tradeIds);

    const journalFillRate = trades.length > 0 ? ((journals?.length || 0) / trades.length) * 100 : 0;

    // Emotion distribution from journal entries
    const emotionDist: Record<string, number> = {};
    if (journals && journals.length > 0) {
      const { data: fullJournals } = await serviceClient
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
      generated_at: new Date().toISOString(),
    };

    await serviceClient.from('weekly_report').upsert(report, { onConflict: 'user_id,week_start' });

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
