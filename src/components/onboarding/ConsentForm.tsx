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

  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      // Log consent server-side to consent_log table
      await fetch('/api/user/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purposes: ['data_storage', 'broker_sync', 'descriptive_analytics'],
        }),
      });
    } catch {
      // Continue even if logging fails — consent is still given client-side
    }
    setDpdpConsent(true);
    setOnboardingStep(4);
  };

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <GlassCard className="p-8">
        <h2 className="text-xl font-bold text-[#fafaff] mb-1">Your Data, Your Control</h2>
        <p className="text-sm text-amber-500/70 mb-2" lang="hi">आपका डेटा, आपका नियंत्रण</p>
        <p className="text-sm text-[#6b6b8a] mb-2">
          Before we start, we need your permission to save your information. This is required by India&apos;s data protection law (DPDP Act, 2023).
        </p>
        <p className="text-[11px] text-amber-500/50 mb-6" lang="hi">
          शुरू करने से पहले, आपकी जानकारी save करने की अनुमति चाहिए। यह भारत के data protection कानून (DPDP Act, 2023) के तहत ज़रूरी है।
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
                Save my buying/selling records
              </p>
              <p className="text-[11px] text-amber-500/50" lang="hi">मेरी खरीद-बिक्री का रिकॉर्ड save करें</p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                When you buy or sell a stock, that&apos;s called a &quot;trade.&quot; We save your trades, notes, and settings safely. You can download or delete everything anytime.
              </p>
              <p className="text-[10px] text-amber-500/40 mt-0.5" lang="hi">
                जब आप stock खरीदते/बेचते हैं, उसे &quot;trade&quot; कहते हैं। हम आपके trades, नोट्स और settings सुरक्षित रखते हैं। कभी भी delete कर सकते हैं।
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
                Connect my Zerodha account (optional)
              </p>
              <p className="text-[11px] text-amber-500/50" lang="hi">मेरा Zerodha account जोड़ें (वैकल्पिक)</p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                Zerodha is a stock broker app (like Groww, Angel One). If you use it, we can automatically pull your trade history so you don&apos;t have to type it manually. Your login stays safe and expires every day.
              </p>
              <p className="text-[10px] text-amber-500/40 mt-0.5" lang="hi">
                Zerodha एक stock broker app है। अगर आप इसे use करते हैं, तो हम आपकी trade history अपने आप ला सकते हैं। आपका login सुरक्षित रहता है।
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
                Show me my weekly report card
              </p>
              <p className="text-[11px] text-amber-500/50" lang="hi">मुझे मेरा weekly report card दिखाएं</p>
              <p className="text-xs text-[#6b6b8a] mt-0.5">
                Every week, we create a simple summary: How many trades did you win? How much profit or loss? Were you calm or stressed? This is just a report — we never tell you what to buy or sell.
              </p>
              <p className="text-[10px] text-amber-500/40 mt-0.5" lang="hi">
                हर हफ़्ते एक summary: कितने trades जीते? कितना फ़ायदा/नुकसान? शांत थे या तनाव में? यह सिर्फ़ report है — हम कभी नहीं बताते कि क्या खरीदें/बेचें।
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-white/[0.06] pt-4 mb-6">
          <p className="text-[11px] text-[#4a4a6a] leading-relaxed mb-1">
            <strong className="text-[#6b6b8a]">Important:</strong> BazaarSaar is NOT a financial advisor. We don&apos;t tell you what to buy or sell. We don&apos;t share your data with anyone.
            You can delete all your data anytime. SEBI = Securities and Exchange Board of India (the government body that regulates the stock market).
          </p>
          <p className="text-[10px] text-amber-500/40 leading-relaxed" lang="hi">
            BazaarSaar कोई financial advisor नहीं है। हम नहीं बताते कि क्या खरीदें/बेचें। आपका data किसी से share नहीं होता। कभी भी data delete कर सकते हैं।
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
            disabled={!allChecked || submitting}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'I Consent & Continue'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
