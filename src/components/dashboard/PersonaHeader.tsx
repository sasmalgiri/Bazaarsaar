'use client';

import { usePersonaStore } from '@/lib/store/personaStore';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { useRouter } from 'next/navigation';

export function PersonaHeader() {
  const { persona } = usePersonaStore();
  const router = useRouter();

  if (!persona) return null;
  const config = PERSONA_CONFIGS[persona];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{config.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-[#fafaff]">{config.label} Dashboard</h1>
          <p className="text-sm text-[#6b6b8a]">{config.labelHindi} &middot; {config.tagline}</p>
        </div>
      </div>
      <button
        onClick={() => {
          usePersonaStore.getState().setOnboardingStep(0);
          usePersonaStore.getState().setOnboardingCompleted(false);
          router.push('/onboarding');
        }}
        className="px-4 py-2 rounded-lg text-xs text-[#6b6b8a] border border-white/[0.06] bg-transparent cursor-pointer hover:border-white/[0.15] hover:text-[#b0b0c8] transition-all"
      >
        Switch Persona
      </button>
    </div>
  );
}
