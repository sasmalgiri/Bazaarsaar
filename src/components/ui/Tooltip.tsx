'use client';

import { useState, type ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#d4d4e8] bg-[#1a1a2e] border border-white/[0.1] shadow-lg whitespace-nowrap pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}
