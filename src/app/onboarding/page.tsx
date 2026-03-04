'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonaStore } from '@/lib/store/personaStore';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { PersonaSelector } from '@/components/onboarding/PersonaSelector';
import { WatchlistBuilder } from '@/components/onboarding/WatchlistBuilder';
import { PreferencesForm } from '@/components/onboarding/PreferencesForm';
import { ConsentForm } from '@/components/onboarding/ConsentForm';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardingStep, onboardingCompleted } = usePersonaStore();

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [onboardingCompleted, router]);

  return (
    <div className="relative z-10">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#fafaff] tracking-tight">BazaarSaar</span>
          <span className="text-sm text-[#6b6b8a]">{'\u092C\u093E\u091C\u093C\u093E\u0930\u0938\u093E\u0930'}</span>
        </div>
        <StepIndicator currentStep={onboardingStep} />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 pb-12">
        {onboardingStep === 0 && <PersonaSelector />}
        {onboardingStep === 1 && <WatchlistBuilder />}
        {onboardingStep === 2 && <PreferencesForm />}
        {onboardingStep === 3 && <ConsentForm />}
        {onboardingStep === 4 && <OnboardingComplete />}
      </main>
    </div>
  );
}
