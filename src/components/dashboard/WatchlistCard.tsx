'use client';

import { useEffect, useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eye, RefreshCw } from 'lucide-react';
import { usePersonaStore } from '@/lib/store/personaStore';
import { useRouter } from 'next/navigation';

interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
}

export function WatchlistCard() {
  const { watchlist } = usePersonaStore();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(false);

  const fetchQuotes = useCallback(async (symbols: string[]) => {
    if (symbols.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/quote?symbols=${symbols.join(',')}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || {});
      }
    } catch {
      // silent — show dashes on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchQuotes(watchlist.slice(0, 20));
    }
  }, [watchlist, fetchQuotes]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-cyan-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Your Watchlist</h3>
        </div>
        <div className="flex items-center gap-2">
          {watchlist.length > 0 && (
            <button
              type="button"
              onClick={() => fetchQuotes(watchlist.slice(0, 20))}
              disabled={loading}
              className="p-1.5 rounded text-[#6b6b8a] bg-transparent border-none cursor-pointer hover:text-[#b0b0c8] hover:bg-white/[0.06] transition-colors disabled:opacity-50"
              title="Refresh prices"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <span className="text-xs font-mono text-[#6b6b8a]">{watchlist.length} stocks</span>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-[#6b6b8a] mb-3">No stocks in your watchlist</p>
          <button
            onClick={() => {
              usePersonaStore.getState().setOnboardingStep(1);
              usePersonaStore.getState().setOnboardingCompleted(false);
              router.push('/onboarding');
            }}
            className="px-4 py-2 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all"
          >
            Add Stocks
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {watchlist.slice(0, 10).map((symbol) => {
            const q = quotes[symbol];
            const hasData = q && q.price > 0;
            const isPositive = hasData && q.change >= 0;

            return (
              <div key={symbol} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-sm font-mono text-[#d4d4e8]">{symbol}</span>
                <div className="flex items-center gap-3">
                  {hasData ? (
                    <>
                      <span className="text-sm font-mono text-[#d4d4e8]">
                        {q.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-xs font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{q.changePercent.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-mono text-[#4a4a6a]">--</span>
                      <span className="text-xs font-mono text-[#4a4a6a]">--%</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {watchlist.length > 10 && (
            <p className="text-xs text-[#4a4a6a] text-center pt-2">
              +{watchlist.length - 10} more
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
