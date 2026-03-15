'use client';

import { PERSONA_CONFIGS, STARTER_PACKS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';

export function WatchlistBuilder() {
  const { persona, watchlist, addPackToWatchlist, toggleWatchlistSymbol, setOnboardingStep } = usePersonaStore();

  if (!persona) return null;

  const config = PERSONA_CONFIGS[persona];
  const packs = STARTER_PACKS[persona];

  // Skip for advanced users
  const handleSkip = () => {
    setOnboardingStep(2);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-3xl block mb-2">{config.icon}</span>
        <h2 className="text-3xl font-bold text-[#fafaff] mb-2">Pick Stocks to Watch</h2>
        <p className="text-sm text-amber-500/70 mb-2" lang="hi">कौन से stocks पर नज़र रखनी है?</p>
        <p className="text-sm text-[#6b6b8a] max-w-md mx-auto">
          A <strong className="text-[#d4d4e8]">watchlist</strong> is your personal list of stocks you want to keep an eye on — like
          a &quot;favorites&quot; list. You don&apos;t buy them yet, you just watch their prices.
        </p>
        <p className="text-[11px] text-amber-500/50 mt-1 max-w-md mx-auto" lang="hi">
          Watchlist = जिन stocks पर आप नज़र रखना चाहते हैं — जैसे &quot;favorites&quot; list। अभी खरीदना ज़रूरी नहीं, बस prices देखें।
        </p>
      </div>

      {/* What are these names? */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6">
        <p className="text-[11px] text-[#6b6b8a]">
          <strong className="text-[#d4d4e8]">What are RELIANCE, TCS, HDFCBANK?</strong> These are short names (symbols) for companies listed on the stock market.
          RELIANCE = Reliance Industries, TCS = Tata Consultancy Services, HDFCBANK = HDFC Bank. Just tap a pack below to add them.
        </p>
        <p className="text-[10px] text-amber-500/40 mt-1" lang="hi">
          ये stock market में listed कंपनियों के छोटे नाम हैं। RELIANCE = रिलायंस इंडस्ट्रीज़, TCS = टाटा कंसल्टेंसी। नीचे किसी pack पर tap करें।
        </p>
      </div>

      {/* Quick Start Packs */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
          Ready-Made Lists (tap to add)
        </h3>
        <p className="text-[10px] text-[#4a4a6a] mb-3">Don&apos;t know which stocks to pick? Just tap any pack — we&apos;ve picked popular ones for you.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packs.map((pack) => (
            <button
              key={pack.name}
              type="button"
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
        <div className="flex justify-between mb-3">
          <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider">
            Your Watchlist (tap to remove)
          </h3>
          <span className="text-xs font-mono text-[#6b6b8a]">{watchlist.length} stocks</span>
        </div>
        {watchlist.length === 0 ? (
          <div className="p-8 rounded-xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] text-center">
            <p className="text-[#6b6b8a] text-sm mb-1">Your list is empty</p>
            <p className="text-[#4a4a6a] text-xs">Tap any pack above to add stocks</p>
            <p className="text-[10px] text-amber-500/50 mt-0.5" lang="hi">ऊपर किसी pack पर tap करें</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {watchlist.map((s) => (
              <button
                key={s}
                type="button"
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
      <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => setOnboardingStep(0)}
          className="text-sm text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#9090aa]"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#6b6b8a] underline"
          >
            Skip this
          </button>
          <button
            type="button"
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
    </div>
  );
}
