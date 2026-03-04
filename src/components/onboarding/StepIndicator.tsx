'use client';

const STEPS = ['Lens', 'Watchlist', 'Prefs', 'Done'];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  if (currentStep === 0) return null;

  return (
    <div className="flex gap-2">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < currentStep
              ? 'w-2 bg-green-500'
              : i === currentStep
              ? 'w-6 bg-[#9090aa]'
              : 'w-2 bg-[#32324a]'
          }`}
        />
      ))}
    </div>
  );
}
