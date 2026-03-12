'use client';

import { useRouter } from 'next/navigation';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';

const NEXT_STEPS = [
  { num: '1', title: 'Import your trades', desc: 'Go to Settings and connect Zerodha or upload a CSV. Your past trades appear instantly.' },
  { num: '2', title: 'Journal your first trade', desc: 'Click any trade and add your thesis, emotion, and playbook checklist. Takes 30 seconds.' },
  { num: '3', title: 'Pick a playbook', desc: 'Choose a trading checklist (breakout, swing, options) to build consistency in your process.' },
  { num: '4', title: 'Check your weekly review', desc: 'Every Monday, see your win rate, emotional patterns, and which setups actually make money.' },
];

export function OnboardingComplete() {
  const router = useRouter();
  const { persona, watchlist, setOnboardingCompleted } = usePersonaStore();

  if (!persona) return null;

  const config = PERSONA_CONFIGS[persona];

  const handleEnter = () => {
    setOnboardingCompleted(true);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-[480px] mx-auto text-center animate-fade-in">
      <div className="text-6xl mb-4">{config.icon}</div>
      <h2 className="text-4xl font-bold text-[#fafaff] mb-3">You&apos;re all set!</h2>
      <p className="text-[#6b6b8a] mb-8">
        Your <span className="text-[#d4d4e8] font-medium">{config.label}</span> universe is ready
        with <span className="font-mono text-[#d4d4e8]">{watchlist.length}</span> stocks.
      </p>

      <div className="p-6 rounded-2xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] text-left mb-8">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-5">
          How to get the most out of BazaarSaar
        </h3>
        <div className="flex flex-col gap-4">
          {NEXT_STEPS.map((step) => (
            <div key={step.title} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step.num}
              </span>
              <div>
                <div className="text-sm font-medium text-[#d4d4e8] mb-0.5">{step.title}</div>
                <div className="text-xs text-[#4a4a6a] leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleEnter}
        className="px-8 py-3.5 rounded-xl text-sm font-semibold border-none cursor-pointer text-white transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.35)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.25)'; }}
      >
        Enter BazaarSaar &rarr;
      </button>

      <p className="text-[10px] text-[#4a4a6a] mt-4">
        You can always change your preferences in Settings.
      </p>
    </div>
  );
}
