'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { usePersonaStore } from '@/lib/store/personaStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Globe } from 'lucide-react';
import type { Language } from '@/types';

const LANGUAGE_OPTIONS: { value: Language; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { value: 'both', label: 'Both', native: 'दोनों' },
];

export function LanguageSettings() {
  const { language } = useTranslation();
  const setLanguage = usePersonaStore((s) => s.setLanguage);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={18} className="text-green-500" />
        <h2 className="text-lg font-semibold text-[#fafaff]">
          {language === 'hi' ? 'भाषा' : language === 'both' ? 'Language / भाषा' : 'Language'}
        </h2>
      </div>

      <div className="flex gap-3">
        {LANGUAGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
              language === opt.value
                ? 'bg-green-500/10 border-green-500/40 text-green-500'
                : 'bg-white/[0.04] border-white/[0.08] text-[#6b6b8a] hover:bg-white/[0.08] hover:text-[#b0b0c8]'
            }`}
          >
            <span>{opt.native}</span>
            {opt.value !== 'en' && opt.value !== 'both' && (
              <span className="ml-1.5 text-xs opacity-60">({opt.label})</span>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
