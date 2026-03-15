'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Zap, X, Plus, Check } from 'lucide-react';

const POPULAR_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'TATAMOTORS', 'ITC', 'LT', 'BHARTIARTL'];

interface QuickTradeLoggerProps {
  onTradeAdded?: () => void;
}

export function QuickTradeLogger({ onTradeAdded }: QuickTradeLoggerProps) {
  const [open, setOpen] = useState(false);
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
            onClick={() => setOpen(false)}
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#6b6b8a] hover:text-[#d4d4e8] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3">
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
                className={`px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  segment === 'EQ' ? 'bg-cyan-500/20 text-cyan-500' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                EQ
              </button>
              <button
                type="button"
                onClick={() => setSegment('FO')}
                className={`px-3 py-2 text-xs font-medium border-none cursor-pointer transition-colors ${
                  segment === 'FO' ? 'bg-purple-500/20 text-purple-500' : 'bg-[#11111a] text-[#6b6b8a]'
                }`}
              >
                F&O
              </button>
            </div>
          </div>

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
        </div>
      </GlassCard>
    </div>
  );
}
