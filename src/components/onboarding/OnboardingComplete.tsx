'use client';

import { useRouter } from 'next/navigation';
import { PERSONA_CONFIGS, ONBOARDING_FEATURES } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';

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
          What happens next
        </h3>
        <div className="flex flex-col gap-4">
          {ONBOARDING_FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="text-lg flex-shrink-0">{f.emoji}</span>
              <div>
                <div className="text-sm font-medium text-[#d4d4e8] mb-0.5">{f.title}</div>
                <div className="text-xs text-[#4a4a6a] leading-relaxed">{f.desc}</div>
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
        onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(34,197,94,0.35)'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(34,197,94,0.25)'; }}
      >
        Enter BazaarSaar &rarr;
      </button>
    </div>
  );
}
