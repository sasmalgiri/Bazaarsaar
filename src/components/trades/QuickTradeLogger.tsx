'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Zap, X, Plus, Check } from 'lucide-react';

const POPULAR_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'TATAMOTORS', 'ITC', 'LT', 'BHARTIARTL'];

const MOOD_OPTIONS = [
  { value: 'calm', emoji: '\uD83D\uDE0C', label: 'Calm', labelHi: 'शांत' },
  { value: 'confident', emoji: '\uD83D\uDE0E', label: 'Confident', labelHi: 'आत्मविश्वास' },
  { value: 'anxious', emoji: '\uD83D\uDE30', label: 'Anxious', labelHi: 'चिंतित' },
  { value: 'fomo', emoji: '\uD83D\uDE28', label: 'FOMO', labelHi: 'छूटने का डर' },
  { value: 'frustrated', emoji: '\uD83D\uDE21', label: 'Frustrated', labelHi: 'निराश' },
] as const;

interface QuickTradeLoggerProps {
  onTradeAdded?: () => void;
}

export function QuickTradeLogger({ onTradeAdded }: QuickTradeLoggerProps) {
  const [open, setOpen] = useState(false);
  const [moodChecked, setMoodChecked] = useState(false);
  const [mood, setMood] = useState('');
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [segment, setSegment] = useState<'EQ' | 'FO'>('EQ');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!symbol || !quantity || !price) return;

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    await supabase.from('trade').insert({
      user_id: user.id,
      symbol: symbol.toUpperCase(),
      exchange: 'NSE',
      segment,
      side,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      order_type: 'MARKET',
      status: 'CLOSED',
      traded_at: new Date().toISOString(),
      import_source: 'manual',
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSymbol('');
      setQuantity('');
      setPrice('');
      setMood('');
      setMoodChecked(false);
      onTradeAdded?.();
    }, 1500);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full bg-green-500 text-[#0d0d14] text-sm font-medium border-none cursor-pointer shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all z-50"
      >
        <Plus size={18} />
        Quick Trade
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 z-50 animate-fade-in">
      <GlassCard className="p-5 shadow-xl shadow-black/40 border border-white/[0.1]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-[#d4d4e8]">Quick Trade</h3>
          </div>
          <button
            type="button"
            onClick={() => { setOpen(false); setMoodChecked(false); setMood(''); }}
            title="Close"
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#6b6b8a] hover:text-[#d4d4e8] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Pre-trade emotional check-in */}
        {!moodChecked && (
          <div className="space-y-3">
            <p className="text-xs text-[#d4d4e8] font-medium">How are you feeling right now?</p>
            <p className="text-[10px] text-amber-500/60" lang="hi">अभी आपका mood कैसा है?</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  title={m.label}
                  onClick={() => setMood(m.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
                    mood === m.value
                      ? 'border-green-500/30 bg-green-500/10 text-green-500'
                      : 'border-white/[0.06] bg-transparent text-[#6b6b8a] hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
            {mood === 'fomo' && (
              <div className="p-2.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                <p className="text-[11px] text-amber-500">Pause. FOMO trades have the lowest win rate. Are you sure about this trade?</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">रुकें। FOMO से किए trades में सबसे कम जीत होती है।</p>
              </div>
            )}
            {mood === 'frustrated' && (
              <div className="p-2.5 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                <p className="text-[11px] text-red-400">Consider taking a break. Revenge trading costs money.</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">ब्रेक लें। बदले की trading पैसे डुबोती है।</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMoodChecked(true)}
              disabled={!mood}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Trade
            </button>
            <p className="text-[10px] text-[#4a4a6a] text-center">This helps you track which moods lead to good/bad trades.</p>
          </div>
        )}

        {moodChecked && <div className="space-y-3">
          {/* Symbol */}
          <div>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol (e.g., RELIANCE)"
              className="w-full px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {POPULAR_SYMBOLS.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSymbol(s)}
                  className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
                    symbol === s
                      ? 'border-green-500/40 bg-green-500/10 text-green-500'
                      : 'border-white/[0.06] bg-transparent text-[#4a4a6a] hover:text-[#6b6b8a]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Side + Segment */}
          <div className="flex gap-2">
            <div className="flex rounded-lg overflow-hidden border border-white/[0.06] flex-1">
              <button
                type="button"
                onClick={() => setSide('BUY')}
                className={`flex-1 px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  side === 'BUY' ? 'bg-green-500 text-[#0d0d14]' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setSide('SELL')}
                className={`flex-1 px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  side === 'SELL' ? 'bg-red-500 text-white' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                SELL
              </button>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setSegment('EQ')}
                title="Equity — regular stock delivery or intraday"
                className={`px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  segment === 'EQ' ? 'bg-cyan-500/20 text-cyan-500' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                EQ
              </button>
              <button
                type="button"
                onClick={() => setSegment('FO')}
                title="Futures & Options — derivatives segment"
                className={`px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  segment === 'FO' ? 'bg-purple-500/20 text-purple-500' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                F&O
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#4a4a6a] -mt-1">EQ = Stocks (शेयर) &nbsp;|&nbsp; F&O = Futures & Options (वायदा और विकल्प)</p>

          {/* Qty + Price */}
          <div className="flex gap-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="flex-1 px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="flex-1 px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !symbol || !quantity || !price}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving...' : <><Zap size={14} /> Log Trade</>}
          </button>
        </div>}
      </GlassCard>
    </div>
  );
}
