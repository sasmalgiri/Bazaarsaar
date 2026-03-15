'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Compass } from 'lucide-react';
import type { MarketType, TradingStyle, RiskLevel } from '@/types';

const MARKETS: { value: MarketType; label: string; desc: string; descHi: string; emoji: string }[] = [
  { value: 'EQ', label: 'Stocks (Equity)', desc: 'Buy and sell company shares directly — like buying Reliance, TCS, or Infosys', descHi: 'कंपनियों के शेयर सीधे खरीदें-बेचें — जैसे Reliance, TCS', emoji: '\uD83D\uDCCA' },
  { value: 'FNO', label: 'F&O (Advanced)', desc: 'Futures & Options — contracts to buy/sell at future prices. High risk, for experienced traders only', descHi: 'भविष्य की कीमतों पर खरीद-बिक्री के contracts। ज़्यादा जोखिम, सिर्फ़ अनुभवी traders के लिए', emoji: '\uD83C\uDFAF' },
];

const STYLES: { value: TradingStyle; label: string; desc: string; descHi: string; emoji: string }[] = [
  { value: 'INTRADAY', label: 'Same Day', desc: 'Buy and sell on the same day — market closes, you\'re done', descHi: 'एक ही दिन में खरीदो और बेचो', emoji: '\u26A1' },
  { value: 'SWING', label: 'Few Days/Weeks', desc: 'Hold stocks for a few days to weeks, then sell', descHi: 'कुछ दिनों से हफ़्तों तक रखो, फिर बेचो', emoji: '\uD83C\uDF0A' },
  { value: 'LONGTERM', label: 'Long Term', desc: 'Buy and hold for months or years — like a savings plan', descHi: 'महीनों या सालों तक रखो — जैसे बचत योजना', emoji: '\uD83C\uDFE6' },
];

const RISKS: { value: RiskLevel; label: string; desc: string; descHi: string }[] = [
  { value: 'LOW', label: 'Safe & Slow', desc: 'Invest small amounts. If the price drops, you lose less. Best for beginners.', descHi: 'छोटी रकम लगाएं। कीमत गिरे तो कम नुकसान। शुरुआत के लिए सबसे अच्छा।' },
  { value: 'MEDIUM', label: 'Balanced', desc: 'Medium amounts. Some risk, some safety. Good for most people.', descHi: 'मध्यम रकम। कुछ जोखिम, कुछ सुरक्षा। ज़्यादातर लोगों के लिए अच्छा।' },
  { value: 'HIGH', label: 'High Risk', desc: 'Larger amounts. Bigger potential gains but also bigger losses. Only if experienced.', descHi: 'बड़ी रकम। ज़्यादा फ़ायदा हो सकता है पर ज़्यादा नुकसान भी। सिर्फ़ अनुभवी के लिए।' },
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
      const res = await fetch('/api/guided-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          <h1 className="text-3xl font-bold text-[#fafaff] mb-2">Tell Us About Yourself</h1>
          <p className="text-sm text-amber-500/70 mb-1" lang="hi">अपने बारे में बताएं</p>
          <p className="text-sm text-[#6b6b8a]">
            Answer 3 simple questions so we can set up your dashboard.
            Don&apos;t worry — you can change all of this later.
          </p>
          <p className="text-[11px] text-amber-500/50" lang="hi">
            3 आसान सवालों का जवाब दें ताकि हम आपका dashboard तैयार कर सकें। बाद में कभी भी बदल सकते हैं।
          </p>
        </div>

        <GlassCard className="p-6">
          {/* Market */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">What do you trade?</h3>
            <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">आप क्या trade करते हैं?</p>
            <div className="grid grid-cols-2 gap-3">
              {MARKETS.map((m) => (
                <button
                  type="button"
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
                  <span className="text-xs text-[#6b6b8a] block leading-relaxed">{m.desc}</span>
                  <span className="text-[10px] text-amber-500/40 block mt-0.5" lang="hi">{m.descHi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">How long do you hold?</h3>
            <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">आप कितने समय तक stock रखते हैं?</p>
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map((s) => (
                <button
                  type="button"
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
                  <span className="text-[10px] text-[#6b6b8a] block leading-relaxed">{s.desc}</span>
                  <span className="text-[9px] text-amber-500/40 block mt-0.5" lang="hi">{s.descHi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Risk */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
              How much risk are you comfortable with?
            </h3>
            <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">आप कितना जोखिम ले सकते हैं?</p>
            <div className="space-y-2">
              {RISKS.map((r) => (
                <button
                  type="button"
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
                    <span className="text-xs text-[#6b6b8a] block leading-relaxed">{r.desc}</span>
                    <span className="text-[10px] text-amber-500/40 block mt-0.5" lang="hi">{r.descHi}</span>
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
            type="button"
            onClick={handleApply}
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Setting up...' : 'Finish Setup →'}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full text-xs text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#6b6b8a] underline mt-3"
          >
            Skip — use default settings
          </button>

          <p className="text-[10px] text-[#4a4a6a] text-center mt-3">
            This is not financial advice. We just organize your notes and show you patterns.
            <span className="text-amber-500/40 ml-1" lang="hi">यह financial advice नहीं है। हम सिर्फ़ आपके नोट्स व्यवस्थित करते हैं।</span>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
