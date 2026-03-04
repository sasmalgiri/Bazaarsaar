import { SEBI_DISCLAIMERS } from '@/lib/constants';

interface SEBIDisclaimerProps {
  type?: 'general' | 'journal';
  variant?: 'inline' | 'banner' | 'footer';
  showHindi?: boolean;
}

export function SEBIDisclaimer({ type = 'general', variant = 'inline', showHindi = false }: SEBIDisclaimerProps) {
  const text = type === 'journal' ? SEBI_DISCLAIMERS.journal : SEBI_DISCLAIMERS.general;

  if (variant === 'footer') {
    return (
      <p className="text-[11px] text-[#4a4a6a] leading-relaxed">
        {text}
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="sebi-disclaimer">
        <p className="leading-relaxed">{text}</p>
        {showHindi && (
          <p className="mt-2 leading-relaxed opacity-80">{SEBI_DISCLAIMERS.generalHindi}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.06]">
      <p className="text-[11px] text-[#4a4a6a] leading-relaxed">{text}</p>
    </div>
  );
}
