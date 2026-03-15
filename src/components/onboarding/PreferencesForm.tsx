'use client';

import { usePersonaStore } from '@/lib/store/personaStore';

const LANGUAGES = [
  { id: 'en' as const, label: 'English', icon: '\uD83C\uDDEC\uD83C\uDDE7' },
  { id: 'hi' as const, label: '\u0939\u093F\u0902\u0926\u0940', icon: '\uD83C\uDDEE\uD83C\uDDF3' },
  { id: 'both' as const, label: 'Both / \u0926\u094B\u0928\u094B\u0902', icon: '\uD83C\uDF10' },
];

export function PreferencesForm() {
  const { language, notifications, setLanguage, setNotifications, setOnboardingStep } = usePersonaStore();

  return (
    <div className="w-full max-w-[520px] mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <span className="text-3xl block mb-2">&#9881;&#65039;</span>
        <h2 className="text-3xl font-bold text-[#fafaff] mb-2">Your Preferences</h2>
        <p className="text-sm text-amber-500/70 mb-1" lang="hi">आपकी पसंद</p>
        <p className="text-sm text-[#6b6b8a]">Pick your language and notification settings. You can change these anytime later in Settings.</p>
        <p className="text-[11px] text-amber-500/50" lang="hi">अपनी भाषा और notification चुनें। Settings में बाद में कभी भी बदल सकते हैं।</p>
      </div>

      {/* Language */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-4">
          Language / \u092D\u093E\u0937\u093E
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`p-4 rounded-xl bg-[rgba(17,17,24,0.7)] text-center cursor-pointer outline-none transition-all duration-200 border ${
                language === lang.id ? 'border-white/20' : 'border-white/[0.06]'
              }`}
            >
              <span className="text-2xl block mb-1">{lang.icon}</span>
              <span className="text-sm text-[#b0b0c8]">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
          Notifications
        </h3>
        <p className="text-[10px] text-amber-500/40 mb-4" lang="hi">सूचनाएं</p>
        <label className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(17,17,24,0.7)] border border-white/[0.06] cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.currentTarget.checked)}
            className="accent-green-500 w-4 h-4 cursor-pointer"
          />
          <div>
            <span className="text-sm text-[#d4d4e8] block">Send me weekly updates</span>
            <span className="text-xs text-[#6b6b8a] block">Every Monday, we&apos;ll let you know your weekly report card is ready — how many trades you won, your mood patterns, etc.</span>
            <span className="text-[10px] text-amber-500/40 block mt-0.5" lang="hi">हर सोमवार बताएंगे कि weekly report card तैयार है — कितने trades जीते, mood patterns, आदि।</span>
          </div>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => setOnboardingStep(1)}
          className="text-sm text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#9090aa]"
        >
          &larr; Back
        </button>
        <button
          type="button"
          onClick={() => setOnboardingStep(3)}
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[#ededf5] text-[#0a0a0f] border-none cursor-pointer hover:bg-white transition-all duration-200"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
