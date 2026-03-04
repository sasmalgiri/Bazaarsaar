'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Compass } from 'lucide-react';
import type { MarketType, TradingStyle, RiskLevel } from '@/types';

const MARKETS: { value: MarketType; label: string; desc: string; emoji: string }[] = [
  { value: 'EQ', label: 'Equity', desc: 'Stocks — cash market', emoji: '\uD83D\uDCCA' },
  { value: 'FNO', label: 'F&O', desc: 'Futures & Options', emoji: '\uD83C\uDFAF' },
];

const STYLES: { value: TradingStyle; label: string; desc: string; emoji: string }[] = [
  { value: 'INTRADAY', label: 'Intraday', desc: 'Same-day trades', emoji: '\u26A1' },
  { value: 'SWING', label: 'Swing', desc: '2\u201330 day holds', emoji: '\uD83C\uDF0A' },
  { value: 'LONGTERM', label: 'Long-term', desc: 'Months to years', emoji: '\uD83C\uDFE6' },
];

const RISKS: { value: RiskLevel; label: string; desc: string }[] = [
  { value: 'LOW', label: 'Conservative', desc: 'Smaller positions, tighter stops' },
  { value: 'MEDIUM', label: 'Moderate', desc: 'Balanced position sizing' },
  { value: 'HIGH', label: 'Aggressive', desc: 'Larger positions, wider stops' },
];

export default function GuidedSetupPage() {
  const router = useRouter();
  const [market, setMarket] = useState<MarketType>('EQ');
  const [style, setStyle] = useState<TradingStyle>('SWING');
  const [risk, setRisk] = useState<RiskLevel>('MEDIUM');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    setBusy(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in first');
        setBusy(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/apply_guided_setup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ market, style, risk }),
      });

      const data = await res.json();
      if (data.ok) {
        router.replace('/dashboard');
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch {
      setError('Setup failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <Compass size={32} className="mx-auto text-green-500 mb-3" />
          <h1 className="text-3xl font-bold text-[#fafaff] mb-2">Quick Setup</h1>
          <p className="text-sm text-[#6b6b8a]">
            This sets up playbooks, tags, and a watchlist for your workflow.
            Descriptive tools only — no recommendations.
          </p>
        </div>

        <GlassCard className="p-6">
          {/* Market */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-3">Market</h3>
            <div className="grid grid-cols-2 gap-3">
              {MARKETS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMarket(m.value)}
                  className={`p-4 rounded-xl text-left cursor-pointer transition-all border ${
                    market === m.value
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/[0.06] bg-[rgba(17,17,24,0.7)] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-xl block mb-1">{m.emoji}</span>
                  <span className="text-sm font-medium text-[#d4d4e8] block">{m.label}</span>
                  <span className="text-xs text-[#4a4a6a]">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-3">Trading Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-xl text-center cursor-pointer transition-all border ${
                    style === s.value
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/[0.06] bg-[rgba(17,17,24,0.7)] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-lg block mb-1">{s.emoji}</span>
                  <span className="text-xs font-medium text-[#d4d4e8] block">{s.label}</span>
                  <span className="text-[10px] text-[#4a4a6a]">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Risk */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-3">
              Risk Preference <span className="normal-case font-normal">(workflow only)</span>
            </h3>
            <div className="space-y-2">
              {RISKS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRisk(r.value)}
                  className={`w-full p-3 rounded-xl text-left cursor-pointer transition-all border flex items-center justify-between ${
                    risk === r.value
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/[0.06] bg-[rgba(17,17,24,0.7)] hover:bg-white/[0.04]'
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-[#d4d4e8]">{r.label}</span>
                    <span className="text-xs text-[#4a4a6a] block">{r.desc}</span>
                  </div>
                  {risk === r.value && (
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg mb-4 text-xs bg-red-500/10 text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Setting up...' : 'Finish Setup'}
          </button>

          <p className="text-[10px] text-[#4a4a6a] text-center mt-3">
            Not financial advice. Playbooks are checklists for your documentation workflow.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
