'use client';

import { PERSONA_CONFIGS, STARTER_PACKS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';

export function WatchlistBuilder() {
  const { persona, watchlist, addPackToWatchlist, toggleWatchlistSymbol, setOnboardingStep } = usePersonaStore();

  if (!persona) return null;

  const config = PERSONA_CONFIGS[persona];
  const packs = STARTER_PACKS[persona];

  return (
    <div className="w-full max-w-[720px] mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <span className="text-3xl block mb-2">{config.icon}</span>
        <h2 className="text-3xl font-bold text-[#fafaff] mb-2">Build Your Watchlist</h2>
        <p className="text-[#6b6b8a]">
          Pick starter packs or add stocks. Your daily intelligence is built from this.
        </p>
      </div>

      {/* Quick Start Packs */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-4">
          Quick Start Packs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packs.map((pack) => (
            <button
              key={pack.name}
              onClick={() => addPackToWatchlist(pack.symbols)}
              className="p-4 rounded-xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] text-left cursor-pointer transition-all duration-200 hover:border-white/[0.15] outline-none"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[#d4d4e8]">{pack.name}</span>
                <span className="text-xs text-green-500">+{pack.symbols.length}</span>
              </div>
              <span className="text-[11px] text-[#4a4a6a] font-mono">
                {pack.symbols.slice(0, 3).join(', ')} +{Math.max(0, pack.symbols.length - 3)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Your Watchlist */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider">
            Your Watchlist
          </h3>
          <span className="text-xs font-mono text-[#6b6b8a]">{watchlist.length} stocks</span>
        </div>
        {watchlist.length === 0 ? (
          <div className="p-8 rounded-xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] text-center">
            <p className="text-[#4a4a6a] text-sm">Add stocks from the packs above</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {watchlist.map((s) => (
              <button
                key={s}
                onClick={() => toggleWatchlistSymbol(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-[#b0b0c8] text-sm font-mono cursor-pointer outline-none transition-all duration-200 hover:border-red-500/30 hover:text-red-400"
              >
                {s} <span className="opacity-40">&times;</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => setOnboardingStep(0)}
          className="text-sm text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#9090aa]"
        >
          &larr; Back
        </button>
        <button
          onClick={() => watchlist.length > 0 && setOnboardingStep(2)}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium border-none transition-all duration-200 ${
            watchlist.length > 0
              ? 'bg-[#ededf5] text-[#0a0a0f] cursor-pointer hover:bg-white'
              : 'bg-[#1a1a24] text-[#4a4a6a] cursor-not-allowed'
          }`}
        >
          Continue ({watchlist.length}) &rarr;
        </button>
      </div>
    </div>
  );
}
