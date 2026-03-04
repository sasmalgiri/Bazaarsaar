'use client';

import { useState, useEffect } from 'react';
import { SEBI_DISCLAIMERS } from '@/lib/constants';

const STORAGE_KEY = 'bazaarsaar_disclaimer_accepted';

export default function DisclaimerBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setAccepted(false);
  }, []);

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl m-4 p-6 rounded-2xl bg-[#11111a] border border-white/[0.06]">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">&#9888;&#65039;</span>
          <div>
            <h3 className="text-[#fafaff] font-semibold text-lg mb-2">Important Disclaimer</h3>
            <p className="text-[#b0b0c8] text-sm leading-relaxed mb-3">
              {SEBI_DISCLAIMERS.general}
            </p>
            <p className="text-[#6b6b8a] text-sm leading-relaxed">
              {SEBI_DISCLAIMERS.generalHindi}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, 'true');
              setAccepted(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
