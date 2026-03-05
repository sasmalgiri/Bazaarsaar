import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/playbooks/stats
 * Returns per-playbook performance stats: trade count, win rate, total P&L, avg checklist completion.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get all user's journal entries that have a playbook
    const { data: journals } = await supabase
      .from('journal_entry')
      .select('id, trade_id, playbook_id')
      .eq('user_id', user.id)
      .not('playbook_id', 'is', null);

    if (!journals || journals.length === 0) {
      return NextResponse.json({ stats: [] });
    }

    // Get trade P&L data for these journal entries
    const tradeIds = journals.map((j: { trade_id: string }) => j.trade_id);
    const { data: trades } = await supabase
      .from('trade')
      .select('id, pnl, net_pnl')
      .in('id', tradeIds);

    const tradePnlMap: Record<string, number> = {};
    trades?.forEach((t: { id: string; pnl?: number; net_pnl?: number }) => {
      tradePnlMap[t.id] = t.net_pnl || t.pnl || 0;
    });

    // Get checklist completion data
    const journalIds = journals.map((j: { id: string }) => j.id);
    const { data: checks } = await supabase
      .from('journal_check')
      .select('journal_entry_id, checked')
      .in('journal_entry_id', journalIds);

    const checkCompletion: Record<string, { total: number; checked: number }> = {};
    checks?.forEach((c: { journal_entry_id: string; checked: boolean }) => {
      if (!checkCompletion[c.journal_entry_id]) checkCompletion[c.journal_entry_id] = { total: 0, checked: 0 };
      checkCompletion[c.journal_entry_id].total++;
      if (c.checked) checkCompletion[c.journal_entry_id].checked++;
    });

    // Get playbook names
    const playbookIds = [...new Set(journals.map((j: { playbook_id: string }) => j.playbook_id))];
    const { data: playbooks } = await supabase
      .from('user_playbook')
      .select('id, title')
      .in('id', playbookIds);

    const playbookNameMap: Record<string, string> = {};
    playbooks?.forEach((p: { id: string; title: string }) => { playbookNameMap[p.id] = p.title; });

    // Aggregate per playbook
    const statsMap: Record<string, {
      playbook_id: string;
      title: string;
      trade_count: number;
      wins: number;
      losses: number;
      total_pnl: number;
      checklist_rates: number[];
    }> = {};

    for (const j of journals as { id: string; trade_id: string; playbook_id: string }[]) {
      if (!statsMap[j.playbook_id]) {
        statsMap[j.playbook_id] = {
          playbook_id: j.playbook_id,
          title: playbookNameMap[j.playbook_id] || 'Unknown',
          trade_count: 0,
          wins: 0,
          losses: 0,
          total_pnl: 0,
          checklist_rates: [],
        };
      }

      const s = statsMap[j.playbook_id];
      const pnl = tradePnlMap[j.trade_id] || 0;
      s.trade_count++;
      s.total_pnl += pnl;
      if (pnl > 0) s.wins++;
      else if (pnl < 0) s.losses++;

      const cc = checkCompletion[j.id];
      if (cc && cc.total > 0) {
        s.checklist_rates.push((cc.checked / cc.total) * 100);
      }
    }

    const stats = Object.values(statsMap).map((s) => ({
      playbook_id: s.playbook_id,
      title: s.title,
      trade_count: s.trade_count,
      win_rate: s.trade_count > 0 ? (s.wins / s.trade_count) * 100 : 0,
      total_pnl: s.total_pnl,
      avg_checklist_completion: s.checklist_rates.length > 0
        ? s.checklist_rates.reduce((a, b) => a + b, 0) / s.checklist_rates.length
        : 0,
    }));

    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
