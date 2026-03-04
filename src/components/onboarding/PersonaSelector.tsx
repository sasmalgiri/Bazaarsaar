'use client';

import { useState } from 'react';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';
import type { PersonaId } from '@/types';

export function PersonaSelector() {
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
  const { setPersona, setOnboardingStep } = usePersonaStore();

  const handleSelect = (key: PersonaId) => {
    setPersona(key);
    setOnboardingStep(1);
  };

  return (
    <div className="w-full max-w-[960px] mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#fafaff] mb-2 tracking-tight">
          Choose Your Lens
        </h1>
        <p className="text-base text-[#6b6b8a] max-w-[440px] mx-auto">
          Your universe adapts to how you see the market.
          <br />
          <span className="text-sm text-[#4a4a6a]">You can switch anytime.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.entries(PERSONA_CONFIGS) as [PersonaId, typeof PERSONA_CONFIGS[PersonaId]][]).map(
          ([key, config]) => {
            const isHovered = hoveredPersona === key;

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                onMouseEnter={() => setHoveredPersona(key)}
                onMouseLeave={() => setHoveredPersona(null)}
                className="relative text-left p-7 rounded-2xl bg-[rgba(17,17,24,0.7)] backdrop-blur-xl transition-all duration-[400ms] outline-none"
                style={{
                  border: `1px solid ${isHovered ? config.accentBorder : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isHovered ? config.glowColor : 'none',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <div className="text-[17px] font-semibold text-[#ededf5]">{config.label}</div>
                    <div className="text-xs text-[#6b6b8a]">{config.labelHindi}</div>
                  </div>
                </div>

                <p className="text-sm text-[#4a4a6a] italic mb-4">
                  &ldquo;{config.tagline}&rdquo;
                </p>

                <p className="text-sm text-[#9090aa] mb-5 leading-relaxed">
                  {config.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {config.metrics.map((m) => (
                    <span
                      key={m}
                      className="text-[11px] px-2.5 py-1 rounded-xl font-mono transition-all duration-300"
                      style={{
                        background: isHovered ? config.accentBg : 'rgba(26,26,36,1)',
                        color: isHovered ? '#d4d4e8' : '#6b6b8a',
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300"
                  style={{ color: isHovered ? '#d4d4e8' : '#4a4a6a' }}
                >
                  <span>Select this lens</span>
                  <span
                    className="transition-transform duration-300"
                    style={{ transform: isHovered ? 'translateX(4px)' : 'none' }}
                  >
                    &rarr;
                  </span>
                </div>
              </button>
            );
          }
        )}
      </div>

      <p className="text-center text-xs text-[#4a4a6a] mt-8">
        Your choice shapes what metrics and journal workflows surface for you.
      </p>
    </div>
  );
}
