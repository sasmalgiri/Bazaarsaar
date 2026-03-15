'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { BookCheck, Copy, Plus, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import type { UserPlaybook, PlaybookTemplate } from '@/types';

interface PlaybookStat {
  playbook_id: string;
  title: string;
  trade_count: number;
  win_rate: number;
  total_pnl: number;
  avg_checklist_completion: number;
}

export default function PlaybooksPage() {
  const [myPlaybooks, setMyPlaybooks] = useState<UserPlaybook[]>([]);
  const [templates, setTemplates] = useState<PlaybookTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState<string | null>(null);
  const [stats, setStats] = useState<PlaybookStat[]>([]);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();

      const [{ data: my }, { data: tpl }] = await Promise.all([
        supabase.from('user_playbook').select('*').order('created_at', { ascending: false }),
        supabase.from('playbook_template').select('*').order('level'),
      ]);

      setMyPlaybooks((my as unknown as UserPlaybook[]) || []);
      setTemplates((tpl as unknown as PlaybookTemplate[]) || []);
      setLoading(false);

      // Fetch playbook performance stats
      try {
        const statsRes = await globalThis.fetch('/api/playbooks/stats');
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);
      } catch { /* silent */ }
    }
    fetch();
  }, []);

  const handleClone = async (templateId: string) => {
    setCloning(templateId);
    try {
      const res = await fetch('/api/playbooks/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId }),
      });

      const data = await res.json();
      if (data.ok && data.playbook_id) {
        // Refresh playbooks
        const supabase = createClient();
        const { data: updated } = await supabase.from('user_playbook').select('*').order('created_at', { ascending: false });
        setMyPlaybooks((updated as unknown as UserPlaybook[]) || []);
      }
    } finally {
      setCloning(null);
    }
  };

  const handleCreateCustom = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('user_playbook').insert({
      user_id: user.id,
      title: 'Custom Playbook',
      description: 'My custom trading checklist.',
      market: 'EQ',
      level: 'CUSTOM',
    }).select('id').single();

    if (data) {
      const { data: updated } = await supabase.from('user_playbook').select('*').order('created_at', { ascending: false });
      setMyPlaybooks((updated as unknown as UserPlaybook[]) || []);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-[#6b6b8a]">Loading playbooks...</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <BookCheck size={24} className="text-green-500" />
            <h1 className="text-2xl font-bold text-[#fafaff]">Playbooks (Trading Checklists)</h1>
          </div>
          <p className="text-xs text-amber-500/70 mt-1 ml-9">ट्रेडिंग चेकलिस्ट — हर ट्रेड से पहले follow करें</p>
        </div>
        <button
          onClick={handleCreateCustom}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all"
        >
          <Plus size={14} />
          New Custom Playbook
        </button>
      </div>

      {/* What is a Playbook — always visible */}
      <GlassCard className="p-5 mb-8 border-green-500/10">
        <h2 className="text-sm font-semibold text-[#d4d4e8] mb-1">What is a Playbook? / प्लेबुक क्या है?</h2>
        <p className="text-xs text-[#6b6b8a] leading-relaxed mb-1">
          A playbook is your personal trading checklist — like a <strong>recipe</strong> for a specific trade setup.
          Just like a cook follows a recipe step-by-step, you follow your playbook before every trade.
          Over time, BazaarSaar shows you which playbooks actually make you money and where you skip steps.
        </p>
        <p className="text-xs text-amber-500/70 leading-relaxed mb-3">
          प्लेबुक आपकी ट्रेडिंग checklist है — जैसे खाना बनाने की recipe। हर ट्रेड से पहले इसे step-by-step follow करें। BazaarSaar दिखाएगा कि कौन सी playbook पैसे बनाती है और कहां आप steps छोड़ते हैं।
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/[0.03]">
            <p className="text-xs font-medium text-green-500 mb-1">1. Pick a template / टेम्पलेट चुनें</p>
            <p className="text-[11px] text-[#4a4a6a]">Choose a ready-made checklist. Don&apos;t know which? Start with &quot;Breakout Trading&quot; — it&apos;s the simplest.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03]">
            <p className="text-xs font-medium text-green-500 mb-1">2. Use when journaling / जर्नल करते वक्त</p>
            <p className="text-[11px] text-[#4a4a6a]">When you log a trade, select your playbook and check off each step you followed.</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03]">
            <p className="text-xs font-medium text-green-500 mb-1">3. See what works / क्या काम करता है</p>
            <p className="text-[11px] text-[#4a4a6a]">After 10+ trades, see win rates per playbook. Stop guessing, start knowing.</p>
          </div>
        </div>
      </GlassCard>

      {/* My Playbooks */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[#6b6b8a] uppercase tracking-wider mb-3">My Playbooks</h2>
        {myPlaybooks.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <p className="text-sm text-[#6b6b8a] mb-1">No playbooks yet</p>
            <p className="text-xs text-[#4a4a6a]">Clone a template below or create a custom one.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myPlaybooks.map((pb) => (
              <Link key={pb.id} href={`/playbooks/${pb.id}`} className="no-underline">
                <GlassCard className="p-5 hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">{pb.title}</h3>
                      <p className="text-xs text-[#4a4a6a] line-clamp-2">{pb.description}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#6b6b8a]">{pb.market}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#6b6b8a]">{pb.level}</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Playbook Performance Analytics */}
      {stats.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-green-500" />
            <h2 className="text-sm font-semibold text-[#6b6b8a] uppercase tracking-wider">Performance by Playbook</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((s) => (
              <GlassCard key={s.playbook_id} className="p-5">
                <h3 className="text-sm font-semibold text-[#d4d4e8] mb-3">{s.title}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-[#4a4a6a] uppercase">Trades</p>
                    <p className="text-lg font-bold font-mono text-[#fafaff]">{s.trade_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4a4a6a] uppercase">Win Rate</p>
                    <p className={`text-lg font-bold font-mono ${s.win_rate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                      {s.win_rate.toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4a4a6a] uppercase">P&L</p>
                    <p className={`text-lg font-bold font-mono ${s.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {s.total_pnl >= 0 ? '+' : ''}{s.total_pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                {s.avg_checklist_completion > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-[#4a4a6a] mb-1">
                      <span>Checklist completion</span>
                      <span>{s.avg_checklist_completion.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${Math.min(100, s.avg_checklist_completion)}%` }}
                      />
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
          <p className="text-[10px] text-[#4a4a6a] mt-2">
            Descriptive performance summary of your own trades. Not investment advice.
          </p>
        </div>
      )}

      {/* Template Library */}
      <div>
        <h2 className="text-sm font-semibold text-[#6b6b8a] uppercase tracking-wider mb-3">Template Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <GlassCard key={tpl.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">{tpl.title}</h3>
                  <p className="text-xs text-[#4a4a6a]">{tpl.description}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#6b6b8a]">{tpl.market}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    tpl.level === 'PRO' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'
                  }`}>{tpl.level}</span>
                </div>
              </div>
              <button
                onClick={() => handleClone(tpl.id)}
                disabled={cloning === tpl.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#d4d4e8] bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-colors disabled:opacity-50"
              >
                <Copy size={12} />
                {cloning === tpl.id ? 'Copying...' : 'Copy to My Playbooks'}
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[#4a4a6a] text-center mt-6">
        Playbooks are checklists for documentation. Not recommendations.
      </p>
    </div>
  );
}
