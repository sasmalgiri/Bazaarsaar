'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePersonaStore } from '@/lib/store/personaStore';

export function ConsentForm() {
  const { setDpdpConsent, setOnboardingStep } = usePersonaStore();
  const [dataStorage, setDataStorage] = useState(false);
  const [brokerSync, setBrokerSync] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const allChecked = dataStorage && brokerSync && analytics;

  const handleContinue = () => {
    setDpdpConsent(true);
    setOnboardingStep(4);
  };

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <GlassCard className="p-8">
        <h2 className="text-xl font-bold text-[#fafaff] mb-2">Data & Privacy Consent</h2>
        <p className="text-sm text-[#6b6b8a] mb-6">
          Under the Digital Personal Data Protection Act (DPDP), 2023, we need your consent for the following:
        </p>

        <div className="space-y-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={dataStorage}
              onChange={(e) => setDataStorage(e.currentTarget.checked)}
              className="mt-1 accent-green-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors">
                Store my trade data
              </p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                Your trades, journal entries, and preferences are stored securely in our database with row-level security. You can export or delete all data at any time.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={brokerSync}
              onChange={(e) => setBrokerSync(e.currentTarget.checked)}
              className="mt-1 accent-green-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors">
                Connect to broker (optional)
              </p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                If you connect Zerodha, we fetch your trade history via API. Tokens are encrypted at rest and expire daily at 6 AM IST. You can disconnect anytime.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.currentTarget.checked)}
              className="mt-1 accent-green-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors">
                Generate descriptive analytics
              </p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                Weekly reports summarize your trading patterns (win rate, P&L, emotions). These are descriptive only — never prescriptive advice.
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-white/[0.06] pt-4 mb-6">
          <p className="text-[11px] text-[#4a4a6a] leading-relaxed">
            By proceeding, you acknowledge that BazaarSaar is not a SEBI-registered investment advisor.
            All analytics are descriptive. We never recommend trades. Your data is never shared with third parties.
            You may withdraw consent and request deletion at any time under DPDP Act, 2023.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => usePersonaStore.getState().setOnboardingStep(2)}
            className="px-5 py-2.5 rounded-lg text-sm text-[#6b6b8a] bg-transparent border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!allChecked}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            I Consent & Continue
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
