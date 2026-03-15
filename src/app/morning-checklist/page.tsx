'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import {
  Sun, CheckCircle2, Circle, RotateCcw, Save, TrendingUp,
  TrendingDown, Minus, Brain, AlertTriangle, Clock
} from 'lucide-react';
import { MarketIntel } from '@/components/dashboard/MarketIntel';

interface CheckItem {
  id: string;
  label: string;
  category: 'mindset' | 'market' | 'plan' | 'risk';
}

interface CheckItemWithHelp extends CheckItem {
  help?: string;
  helpHi?: string;
}

const DEFAULT_CHECKLIST: CheckItemWithHelp[] = [
  // Mindset
  { id: 'sleep', label: 'I slept well and feel mentally sharp', category: 'mindset' },
  { id: 'emotion', label: 'I am emotionally calm — no revenge/FOMO from yesterday', category: 'mindset', help: 'Revenge = trading to recover losses. FOMO = buying because others are.', helpHi: 'Revenge = नुकसान वापस पाने के लिए trade। FOMO = दूसरे खरीद रहे तो मैं भी।' },
  { id: 'goal', label: 'I have a clear daily P&L target and stop-loss limit', category: 'mindset', help: 'Decide max loss BEFORE market opens (e.g., ₹2,000). Hit it? Stop trading.', helpHi: 'बाज़ार खुलने से पहले max नुकसान तय करें (जैसे ₹2,000)। Hit हो? Trading बंद।' },
  // Market
  { id: 'global', label: 'I checked global cues (Gift Nifty, US markets, Asia)', category: 'market', help: 'Gift Nifty (formerly SGX Nifty) shows where Indian market may open. Check before 9 AM.', helpHi: 'Gift Nifty बताता है कि भारतीय बाज़ार कहां खुल सकता है। सुबह 9 बजे से पहले check करें।' },
  { id: 'news', label: 'I checked today\'s events (RBI policy, company results, expiry day)', category: 'market', help: 'Big events cause wild moves. Be cautious on RBI days, Budget, and Thursday (F&O expiry).', helpHi: 'बड़ी events से बाज़ार में तेज़ हलचल। RBI days, Budget, और गुरुवार (F&O expiry) पर सावधान रहें।' },
  { id: 'fii', label: 'I checked FII/DII data and sector trends', category: 'market', help: 'FII = Foreign Institutional Investors (विदेशी संस्थान). DII = Domestic Institutional Investors (भारतीय संस्थान). Their buying/selling moves the market.', helpHi: 'FII = विदेशी संस्थागत निवेशक। DII = भारतीय संस्थागत निवेशक। इनकी खरीद-बिक्री बाज़ार चलाती है।' },
  // Plan
  { id: 'levels', label: 'I have marked key price levels for my stocks', category: 'plan', help: 'Support = price where stock stops falling (buyers step in). Resistance = price where stock stops rising (sellers step in).', helpHi: 'Support = वो कीमत जहां stock गिरना बंद करता है। Resistance = वो कीमत जहां stock बढ़ना बंद करता है।' },
  { id: 'watchlist', label: 'My watchlist for today is ready (max 5 stocks)', category: 'plan' },
  { id: 'setup', label: 'I know which setups I will trade today', category: 'plan', help: 'A setup = specific conditions that must be true before you buy/sell. No setup = no trade.', helpHi: 'Setup = खरीदने/बेचने से पहले कुछ conditions पूरी होनी चाहिए। कोई setup नहीं = कोई trade नहीं।' },
  // Risk
  { id: 'size', label: 'My position size is within my risk rules (1-2% per trade)', category: 'risk', help: 'Position sizing = how many shares to buy. Risk max 1-2% of your capital per trade.', helpHi: 'Position sizing = कितने shares खरीदें। एक trade में अपनी पूंजी का max 1-2% जोखिम लें।' },
  { id: 'stoploss', label: 'I will place stop-loss on every trade', category: 'risk', help: 'Stop-loss = auto-exit price if trade goes wrong. Set it BEFORE entering the trade.', helpHi: 'Stop-loss = trade ग़लत जाए तो automatic exit price। Trade में enter करने से पहले लगाएं।' },
  { id: 'maxloss', label: 'I will stop trading if I hit my max daily loss', category: 'risk', help: 'This prevents revenge trading. Hit your daily limit? Close the app. Tomorrow is a new day.', helpHi: 'यह revenge trading रोकता है। Daily limit hit? App बंद करो। कल नया दिन है।' },
];

const CATEGORY_CONFIG = {
  mindset: { label: 'Mindset Check', icon: Brain, color: 'text-purple-500', border: 'border-purple-500/20' },
  market: { label: 'Market Prep', icon: TrendingUp, color: 'text-cyan-500', border: 'border-cyan-500/20' },
  plan: { label: 'Trading Plan', icon: Clock, color: 'text-amber-500', border: 'border-amber-500/20' },
  risk: { label: 'Risk Management', icon: AlertTriangle, color: 'text-red-500', border: 'border-red-500/20' },
};

type MarketBias = 'bullish' | 'bearish' | 'neutral' | '';

export default function MorningChecklistPage() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [bias, setBias] = useState<MarketBias>('');
  const [notes, setNotes] = useState('');
  const [maxLoss, setMaxLoss] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [saved, setSaved] = useState(false);
  const [todayDone, setTodayDone] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load today's checklist from localStorage
    const stored = localStorage.getItem(`bazaarsaar-morning-${today}`);
    if (stored) {
      const data = JSON.parse(stored);
      setChecked(data.checked || {});
      setBias(data.bias || '');
      setNotes(data.notes || '');
      setMaxLoss(data.maxLoss || '');
      setTargetProfit(data.targetProfit || '');
      setTodayDone(true);
    }
  }, [today]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = DEFAULT_CHECKLIST.length;
  const completion = Math.round((checkedCount / totalCount) * 100);

  const handleSave = (redirect = true) => {
    const data = { checked, bias, notes, maxLoss, targetProfit, date: today };
    localStorage.setItem(`bazaarsaar-morning-${today}`, JSON.stringify(data));
    setSaved(true);
    setTodayDone(true);
    if (redirect) {
      setTimeout(() => router.push('/dashboard'), 600);
    } else {
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    setChecked({});
    setBias('');
    setNotes('');
    setMaxLoss('');
    setTargetProfit('');
    setTodayDone(false);
    localStorage.removeItem(`bazaarsaar-morning-${today}`);
  };

  const handleQuickCheck = () => {
    const allChecked: Record<string, boolean> = {};
    DEFAULT_CHECKLIST.forEach((item) => { allChecked[item.id] = true; });
    setChecked(allChecked);
  };

  const categories = ['mindset', 'market', 'plan', 'risk'] as const;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sun size={24} className="text-amber-500" />
          <div>
            <h1 className="text-xl font-bold text-[#fafaff]">Pre-Market Checklist</h1>
            <p className="text-xs text-amber-500/70">बाज़ार खुलने से पहले — अपनी तैयारी जांचें</p>
            <p className="text-xs text-[#4a4a6a]">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {todayDone && (
            <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle2 size={10} /> Completed
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#6b6b8a] border border-white/[0.06] bg-transparent cursor-pointer hover:bg-white/[0.04] transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* Market Intelligence — real data for prep */}
      <div className="mb-5">
        <MarketIntel />
      </div>

      {/* Quick Check for Advanced Users */}
      {checkedCount < totalCount && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <p className="text-xs text-[#6b6b8a]">Already done your prep? Check all items at once.</p>
            <p className="text-[10px] text-amber-500/40" lang="hi">तैयारी हो चुकी है? सब items एक बार में check करें।</p>
          </div>
          <button
            type="button"
            onClick={handleQuickCheck}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#d4d4e8] border border-white/[0.08] bg-transparent cursor-pointer hover:bg-white/[0.04] transition-colors whitespace-nowrap"
          >
            <CheckCircle2 size={13} />
            Check All
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <GlassCard className="p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#6b6b8a]">Readiness Score</span>
          <span className={`text-lg font-bold font-mono ${completion >= 80 ? 'text-green-500' : completion >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
            {completion}%
          </span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-[10px] text-[#4a4a6a] mt-2">
          {checkedCount}/{totalCount} items checked.
          {completion < 80 && ' Complete at least 80% before trading.'}
          {completion >= 80 && completion < 100 && ' Almost ready!'}
          {completion === 100 && ' You\'re fully prepared. Trade with confidence!'}
        </p>
      </GlassCard>

      {/* Checklist by Category */}
      <div className="space-y-4 mb-6">
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const items = DEFAULT_CHECKLIST.filter((i) => i.category === cat);
          const catChecked = items.filter((i) => checked[i.id]).length;

          return (
            <GlassCard key={cat} className={`p-5 border-l-4 ${config.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <config.icon size={16} className={config.color} />
                <h3 className="text-sm font-semibold text-[#d4d4e8]">{config.label}</h3>
                <span className="text-[10px] text-[#4a4a6a] ml-auto">{catChecked}/{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const itemHelp = item as CheckItemWithHelp;
                  return (
                  <div key={item.id}>
                    <label
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/[0.02] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className="bg-transparent border-none cursor-pointer p-0 shrink-0"
                      >
                        {checked[item.id] ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-[#32324a]" />
                        )}
                      </button>
                      <span className={`text-sm ${checked[item.id] ? 'text-[#6b6b8a] line-through' : 'text-[#d4d4e8]'}`}>
                        {item.label}
                      </span>
                    </label>
                    {itemHelp.help && (
                      <div className="ml-10 mb-1">
                        <p className="text-[10px] text-[#4a4a6a] leading-relaxed">{itemHelp.help}</p>
                        {itemHelp.helpHi && <p className="text-[10px] text-amber-500/50 leading-relaxed">{itemHelp.helpHi}</p>}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Market Bias — what do you think market will do today? */}
      <GlassCard className="p-5 mb-4">
        <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">What do you think the market will do today?</h3>
        <p className="text-[10px] text-[#4a4a6a] mb-1">Pick one based on global cues, news, and Gift Nifty. This is your guess — not a tip.</p>
        <p className="text-[10px] text-amber-500/50 mb-3" lang="hi">आज बाज़ार कैसा रहेगा? Global cues और news देखकर अपना अंदाज़ा चुनें।</p>
        <div className="flex gap-3">
          {[
            { value: 'bullish' as const, label: 'Up (तेज़ी)', icon: TrendingUp, color: 'green' },
            { value: 'neutral' as const, label: 'Flat (सामान्य)', icon: Minus, color: 'amber' },
            { value: 'bearish' as const, label: 'Down (मंदी)', icon: TrendingDown, color: 'red' },
          ].map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBias(bias === b.value ? '' : b.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border cursor-pointer transition-all ${
                bias === b.value
                  ? `border-${b.color}-500/40 bg-${b.color}-500/10 text-${b.color}-500`
                  : 'border-white/[0.06] bg-[#11111a] text-[#6b6b8a] hover:bg-white/[0.04]'
              }`}
            >
              <b.icon size={14} />
              {b.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Daily Limits — how much can you afford to lose/win today */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GlassCard className="p-4">
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
            Max Loss Today (आज का अधिकतम नुकसान)
          </label>
          <p className="text-[10px] text-[#4a4a6a] mb-2">
            If I lose this much, I will STOP trading today. No exceptions.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-red-500">₹</span>
            <input
              type="number"
              value={maxLoss}
              onChange={(e) => setMaxLoss(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-red-500/30"
            />
          </div>
          <p className="text-[10px] text-amber-500/50 mt-1.5" lang="hi">इतना नुकसान हो तो आज trading बंद। कोई बहाना नहीं।</p>
        </GlassCard>
        <GlassCard className="p-4">
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
            Target Profit (आज का लक्ष्य मुनाफ़ा)
          </label>
          <p className="text-[10px] text-[#4a4a6a] mb-2">
            If I make this much, I can stop for the day. Don&apos;t get greedy.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-green-500">₹</span>
            <input
              type="number"
              value={targetProfit}
              onChange={(e) => setTargetProfit(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
          </div>
          <p className="text-[10px] text-amber-500/50 mt-1.5" lang="hi">इतना मुनाफ़ा हो तो रुक जाएं। लालच न करें।</p>
        </GlassCard>
      </div>

      {/* Notes — what's your plan for today? */}
      <GlassCard className="p-5 mb-5">
        <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
          Today&apos;s Plan (आज की योजना)
        </label>
        <p className="text-[10px] text-[#4a4a6a] mb-2">
          Write 1-2 lines about what you plan to do today. Which stocks? Buy or sell? At what price?
          If you don&apos;t have a plan — don&apos;t trade.
        </p>
        <p className="text-[10px] text-amber-500/50 mb-2" lang="hi">
          आज क्या करने का plan है? कौन से stocks? खरीदना या बेचना? किस price पर? Plan नहीं है तो trade मत करो।
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Example: Watch RELIANCE near ₹2,450. If it breaks above with volume, buy. Stop-loss at ₹2,420."
          className="w-full px-4 py-3 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[80px]"
        />
      </GlassCard>

      {/* Save */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => handleSave(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors"
        >
          <Save size={16} />
          {saved ? 'Saved! Redirecting...' : 'Save & Start Trading →'}
        </button>
        {completion < 80 && (
          <span className="text-xs text-amber-500 flex items-center gap-1">
            <AlertTriangle size={12} />
            Low readiness — consider completing more items
          </span>
        )}
      </div>

      {/* Skip for advanced users */}
      {!todayDone && (
        <button
          type="button"
          onClick={() => {
            handleQuickCheck();
            setTimeout(() => handleSave(true), 100);
          }}
          className="text-xs text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#6b6b8a] underline"
        >
          I already did my prep — skip checklist & save &rarr;
        </button>
      )}
    </div>
  );
}
