'use client';

import { useState } from 'react';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { usePersonaStore } from '@/lib/store/personaStore';
import type { PersonaId } from '@/types';

const PERSONA_HELP: Record<PersonaId, { question: string; questionHi: string; example: string; exampleHi: string; recommendation: string; recommendationHi: string }> = {
  investor: {
    question: 'I want to buy good companies and hold for years',
    questionHi: 'मैं अच्छी कंपनियां खरीदकर सालों तक रखना चाहता हूँ',
    example: 'Like buying Reliance or TCS and keeping for 1-5 years',
    exampleHi: 'जैसे Reliance या TCS खरीदकर 1-5 साल रखना',
    recommendation: 'Best for beginners. Lowest risk. Start here if you\'re new.',
    recommendationHi: 'शुरुआत करने वालों के लिए सबसे अच्छा। सबसे कम जोखिम।',
  },
  swing_trader: {
    question: 'I want to buy and sell within a few days or weeks',
    questionHi: 'मैं कुछ दिनों या हफ़्तों में खरीदना-बेचना चाहता हूँ',
    example: 'Buy a stock on Monday, sell on Friday if price goes up',
    exampleHi: 'सोमवार को stock खरीदो, शुक्रवार को बेचो अगर price बढ़े',
    recommendation: 'Medium risk. Need to check market daily.',
    recommendationHi: 'मध्यम जोखिम। रोज़ बाज़ार देखना ज़रूरी।',
  },
  options_trader: {
    question: 'I trade Futures & Options (F&O)',
    questionHi: 'मैं Futures & Options (F&O) में trade करता हूँ',
    example: 'Buying Nifty calls/puts, selling options for premium',
    exampleHi: 'Nifty calls/puts खरीदना, premium के लिए options बेचना',
    recommendation: 'Highest risk. SEBI data: 93% lose money here. Only for experienced traders.',
    recommendationHi: 'सबसे ज़्यादा जोखिम। SEBI डेटा: 93% यहां पैसे हारते हैं। सिर्फ़ अनुभवी traders के लिए।',
  },
};

export function PersonaSelector() {
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
  const { setPersona, setOnboardingStep } = usePersonaStore();

  const handleSelect = (key: PersonaId) => {
    setPersona(key);
    setOnboardingStep(1);
  };

  // Skip for advanced users — defaults to swing_trader
  const handleSkip = () => {
    setPersona('swing_trader');
    setOnboardingStep(1);
  };

  return (
    <div className="w-full max-w-[960px] mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#fafaff] mb-2 tracking-tight">
          How do you want to use the stock market?
        </h1>
        <p className="text-sm text-amber-500/70 mb-1" lang="hi">
          आप शेयर बाज़ार का इस्तेमाल कैसे करना चाहते हैं?
        </p>
        <p className="text-sm text-[#6b6b8a]">
          Don&apos;t worry — you can change this anytime. Pick what feels right.
        </p>
        <p className="text-[11px] text-amber-500/50" lang="hi">
          चिंता न करें — ये बाद में कभी भी बदल सकते हैं। जो सही लगे वो चुनें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.entries(PERSONA_CONFIGS) as [PersonaId, typeof PERSONA_CONFIGS[PersonaId]][]).map(
          ([key, config]) => {
            const isHovered = hoveredPersona === key;
            const help = PERSONA_HELP[key];

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
                {key === 'investor' && (
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">
                    Best for beginners
                  </span>
                )}
                {key === 'options_trader' && (
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-medium">
                    Advanced only
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <div className="text-[17px] font-semibold text-[#ededf5]">{config.label}</div>
                    <div className="text-xs text-amber-500/60">{config.labelHindi}</div>
                  </div>
                </div>

                <p className="text-sm text-[#d4d4e8] mb-1 font-medium">
                  &ldquo;{help.question}&rdquo;
                </p>
                <p className="text-[11px] text-amber-500/50 mb-3" lang="hi">
                  &ldquo;{help.questionHi}&rdquo;
                </p>

                <p className="text-xs text-[#6b6b8a] mb-1">
                  Example: {help.example}
                </p>
                <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">
                  उदाहरण: {help.exampleHi}
                </p>

                <div className={`text-[11px] p-2 rounded-lg mb-4 ${key === 'options_trader' ? 'bg-red-500/[0.06] text-red-400' : key === 'investor' ? 'bg-green-500/[0.06] text-green-500' : 'bg-amber-500/[0.06] text-amber-500'}`}>
                  <p>{help.recommendation}</p>
                  <p className="text-amber-500/50 mt-0.5" lang="hi">{help.recommendationHi}</p>
                </div>

                <div
                  className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300"
                  style={{ color: isHovered ? '#d4d4e8' : '#4a4a6a' }}
                >
                  <span>Select this &rarr;</span>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Skip for advanced users */}
      <div className="text-center mt-6">
        <button
          onClick={handleSkip}
          className="text-xs text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#6b6b8a] underline"
        >
          I already know what I&apos;m doing — skip setup &rarr;
        </button>
      </div>
    </div>
  );
}
